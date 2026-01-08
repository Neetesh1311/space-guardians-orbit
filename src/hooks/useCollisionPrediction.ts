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
        throw new Error(error.message || 'Failed to analyze collisions');
      }

      return data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['collisionPredictions'], data);
      
      const criticalCount = data.predictions?.filter(p => p.risk_level === 'critical').length || 0;
      if (criticalCount > 0) {
        toast.error(`${criticalCount} critical collision risk${criticalCount > 1 ? 's' : ''} detected!`);
      } else {
        toast.success('Collision analysis complete');
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