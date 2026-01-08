import { useMutation } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface LaunchPlanRequest {
  missionName: string;
  satelliteName: string;
  targetOrbit: 'LEO' | 'MEO' | 'GEO' | 'HEO' | 'SSO' | 'POLAR';
  targetAltitude: number;
  targetInclination: number;
  launchSite: string;
  payloadMass: number;
}

export interface LaunchWindow {
  date: string;
  time_utc: string;
  window_duration_minutes: number;
  confidence_score: number;
}

export interface LaunchPlanResponse {
  optimal_launch_windows: LaunchWindow[];
  trajectory: {
    ascent_profile: string;
    max_q_altitude_km: number;
    stage1_separation_altitude_km: number;
    stage2_burn_duration_seconds: number;
    orbital_insertion_time_minutes: number;
  };
  fuel_analysis: {
    estimated_delta_v_km_s: number;
    fuel_margin_percent: number;
    efficiency_rating: 'excellent' | 'good' | 'acceptable' | 'marginal';
  };
  collision_avoidance: {
    risk_level: 'low' | 'medium' | 'high';
    conflicting_objects: string[];
    recommended_maneuvers: string[];
  };
  recommendations: string[];
  summary: string;
}

export const useLaunchPlanner = () => {
  const planMutation = useMutation({
    mutationFn: async (request: LaunchPlanRequest): Promise<LaunchPlanResponse> => {
      const { data, error } = await supabase.functions.invoke('ai-launch-planner', {
        body: request
      });

      if (error) {
        console.error('Launch planner error:', error);
        throw new Error(error.message || 'Failed to generate launch plan');
      }

      return data;
    },
    onSuccess: () => {
      toast.success('Launch plan generated successfully');
    },
    onError: (error: Error) => {
      toast.error(`Planning failed: ${error.message}`);
    }
  });

  return {
    generatePlan: planMutation.mutate,
    isPlanning: planMutation.isPending,
    plan: planMutation.data,
    error: planMutation.error,
    reset: planMutation.reset
  };
};