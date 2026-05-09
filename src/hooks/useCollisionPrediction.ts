import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Satellite } from '@/types/space';
import { toast } from 'sonner';

interface CollisionPrediction {
  object1_name: string;
  object2_name: string;
  risk_score: number;
  time_to_closest_approach_hours: number;
  minimum_distance_km: number;
  risk_level: 'safe' | 'warning' | 'critical';
  recommended_action: string;
  analysis: string;
}

interface AICollisionResponse {
  predictions: CollisionPrediction[];
  overall_risk_assessment: string;
  kessler_risk: 'low' | 'medium' | 'high';
  summary: string;
}

export const useCollisionPrediction = () => {
  const queryClient = useQueryClient();

  const calculateFallback = (satellites: Satellite[]): AICollisionResponse => {
    const candidates = satellites
      .flatMap((a, i) => satellites.slice(i + 1).map((b) => {
        const dx = (a.position.x - b.position.x) * 6371;
        const dy = (a.position.y - b.position.y) * 6371;
        const dz = (a.position.z - b.position.z) * 6371;
        const positionDistance = Math.sqrt(dx * dx + dy * dy + dz * dz);
        const altitudeDelta = Math.abs(a.altitude - b.altitude);
        const inclinationDelta = Math.abs(a.inclination - b.inclination);
        const shellPenalty = a.orbitType === b.orbitType ? 24 : 0;
        const closeScore = Math.max(0, 55 - altitudeDelta / 8 - inclinationDelta * 1.2);
        const crowdingScore = a.orbitType === 'LEO' && b.orbitType === 'LEO' ? 18 : 0;
        const inheritedRisk = (a.riskLevel === 'critical' || b.riskLevel === 'critical') ? 25 : (a.riskLevel === 'warning' || b.riskLevel === 'warning') ? 12 : 0;
        const riskScore = Math.max(1, Math.min(96, Math.round(closeScore + shellPenalty + crowdingScore + inheritedRisk - positionDistance / 500)));
        const risk_level: CollisionPrediction['risk_level'] = riskScore >= 75 ? 'critical' : riskScore >= 42 ? 'warning' : 'safe';

        return {
          object1_name: a.name,
          object2_name: b.name,
          risk_score: riskScore,
          time_to_closest_approach_hours: Math.max(0.4, Math.min(72, altitudeDelta / Math.max(Math.abs(a.velocity - b.velocity), 0.08))),
          minimum_distance_km: Math.max(0.4, Math.min(5000, positionDistance + altitudeDelta)),
          risk_level,
          recommended_action: risk_level === 'critical' ? 'Execute radial separation burn of 4–8 m/s at next node.' : risk_level === 'warning' ? 'Schedule enhanced tracking and prepare 1–3 m/s phasing burn.' : 'Continue nominal tracking.',
          analysis: `Deterministic orbital-shell screening: Δalt ${altitudeDelta.toFixed(0)} km, Δinc ${inclinationDelta.toFixed(1)}°.`
        };
      }))
      .sort((a, b) => b.risk_score - a.risk_score)
      .slice(0, 8);

    const notable = candidates.filter((item) => item.risk_level !== 'safe');
    const critical = notable.filter((item) => item.risk_level === 'critical').length;
    return {
      predictions: notable.length ? notable : candidates.slice(0, 3),
      overall_risk_assessment: critical > 0 ? `${critical} critical conjunction candidates require immediate review.` : notable.length > 0 ? `${notable.length} warning-level conjunction candidates found.` : 'No significant conjunction candidates in the current propagated frame.',
      kessler_risk: critical > 1 ? 'high' : notable.length > 3 ? 'medium' : 'low',
      summary: 'Local deterministic fallback completed when AI service output was unavailable.'
    };
  };

  const analyzeMutation = useMutation({
    mutationFn: async (satellites: Satellite[]): Promise<AICollisionResponse> => {
      const { data, error } = await supabase.functions.invoke('ai-collision-prediction', {
        body: { 
          satellites: satellites.map(s => ({
            id: s.id,
            name: s.name,
            altitude: s.altitude,
            velocity: s.velocity,
            position: s.position,
            orbitType: s.orbitType
          }))
        }
      });

      if (error) {
        console.error('Collision prediction error:', error);
        return calculateFallback(satellites);
      }

      if (!data?.predictions || !Array.isArray(data.predictions)) {
        return calculateFallback(satellites);
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['collisionPredictions'], data);
      
      const criticalCount = data.predictions?.filter(p => p.risk_level === 'critical').length || 0;
      if (criticalCount > 0) {
        toast.error(`${criticalCount} critical collision risk${criticalCount > 1 ? 's' : ''} detected!`);
      } else {
        const warningCount = data.predictions?.filter(p => p.risk_level === 'warning').length || 0;
        toast.success(warningCount > 0 ? `${warningCount} warning-level collision risk${warningCount > 1 ? 's' : ''} detected` : 'Collision analysis complete');
      }
    },
    onError: (error: Error) => {
      toast.error(`Analysis failed: ${error.message}`);
    }
  });

  const predictions = useQuery({
    queryKey: ['collisionPredictions'],
    queryFn: () => null as AICollisionResponse | null,
    enabled: false,
  });

  return {
    analyze: analyzeMutation.mutate,
    isAnalyzing: analyzeMutation.isPending,
    predictions: predictions.data,
    error: analyzeMutation.error
  };
};