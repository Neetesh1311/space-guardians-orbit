import { useState, useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  AlertTriangle, 
  Shield, 
  X, 
  Bell, 
  ChevronRight,
  Radar
} from 'lucide-react';
import { useCollisionPrediction } from '@/hooks/useCollisionPrediction';
import type { Satellite } from '@/types/space';

interface CollisionAlertBannerProps {
  satellites: Satellite[];
  autoAnalyze?: boolean;
  onViewDetails?: () => void;
}

export const CollisionAlertBanner = ({ 
  satellites, 
  autoAnalyze = false,
  onViewDetails 
}: CollisionAlertBannerProps) => {
  const { analyze, isAnalyzing, predictions } = useCollisionPrediction();
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [hasAutoAnalyzed, setHasAutoAnalyzed] = useState(false);

  // Auto-analyze on mount if enabled
  useEffect(() => {
    if (autoAnalyze && !hasAutoAnalyzed && satellites.length > 0) {
      analyze(satellites);
      setHasAutoAnalyzed(true);
    }
  }, [autoAnalyze, satellites, hasAutoAnalyzed, analyze]);

  const criticalPredictions = predictions?.predictions?.filter(
    p => p.risk_level === 'critical' && !dismissed.includes(`${p.object1_name}-${p.object2_name}`)
  ) || [];

  const warningPredictions = predictions?.predictions?.filter(
    p => p.risk_level === 'warning' && !dismissed.includes(`${p.object1_name}-${p.object2_name}`)
  ) || [];

  const handleDismiss = (id: string) => {
    setDismissed([...dismissed, id]);
  };

  if (!predictions || (criticalPredictions.length === 0 && warningPredictions.length === 0)) {
    return null;
  }

  return (
    <div className="space-y-2 animate-in slide-in-from-top duration-300">
      {/* Critical Alerts */}
      {criticalPredictions.map((pred, index) => {
        const alertId = `${pred.object1_name}-${pred.object2_name}`;
        return (
          <Alert 
            key={alertId} 
            variant="destructive"
            className="border-destructive/50 bg-destructive/10 backdrop-blur animate-pulse-slow"
          >
            <AlertTriangle className="h-5 w-5 animate-pulse" />
            <div className="flex-1">
              <AlertTitle className="flex items-center gap-2">
                <span>CRITICAL COLLISION ALERT</span>
                <Badge variant="destructive" className="animate-pulse">
                  {pred.risk_score}% Risk
                </Badge>
              </AlertTitle>
              <AlertDescription className="mt-1">
                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                  <span className="font-medium">
                    {pred.object1_name} ↔ {pred.object2_name}
                  </span>
                  <span className="text-xs text-destructive/80">
                    Min distance: {pred.minimum_distance_km?.toFixed(1)} km • 
                    Time to CPA: {pred.time_to_closest_approach_hours?.toFixed(1)}h
                  </span>
                </div>
                {pred.recommended_action && (
                  <p className="text-xs mt-1 text-destructive/90 font-medium">
                    ⚡ Action: {pred.recommended_action}
                  </p>
                )}
              </AlertDescription>
            </div>
            <div className="flex items-center gap-2">
              {onViewDetails && (
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="border-destructive/50 text-destructive hover:bg-destructive/20"
                  onClick={onViewDetails}
                >
                  Details <ChevronRight className="h-3 w-3 ml-1" />
                </Button>
              )}
              <Button 
                size="icon" 
                variant="ghost" 
                className="h-6 w-6 text-destructive/70 hover:text-destructive"
                onClick={() => handleDismiss(alertId)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </Alert>
        );
      })}

      {/* Warning Alerts - Grouped if multiple */}
      {warningPredictions.length > 0 && (
        <Alert className="border-warning/50 bg-warning/10 backdrop-blur">
          <Bell className="h-5 w-5 text-warning" />
          <div className="flex-1">
            <AlertTitle className="flex items-center gap-2 text-warning">
              <span>Collision Warnings</span>
              <Badge variant="outline" className="border-warning/50 text-warning">
                {warningPredictions.length} potential {warningPredictions.length === 1 ? 'risk' : 'risks'}
              </Badge>
            </AlertTitle>
            <AlertDescription className="mt-1">
              <div className="space-y-1">
                {warningPredictions.slice(0, 3).map((pred, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs">
                    <Radar className="h-3 w-3 text-warning" />
                    <span>{pred.object1_name} ↔ {pred.object2_name}</span>
                    <Badge variant="outline" className="text-[10px] py-0 h-4 border-warning/30">
                      {pred.risk_score}%
                    </Badge>
                  </div>
                ))}
                {warningPredictions.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{warningPredictions.length - 3} more warnings
                  </p>
                )}
              </div>
            </AlertDescription>
          </div>
          {onViewDetails && (
            <Button 
              size="sm" 
              variant="outline"
              className="border-warning/50 text-warning hover:bg-warning/20"
              onClick={onViewDetails}
            >
              View All <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </Alert>
      )}

      {/* Kessler Syndrome Warning */}
      {predictions?.kessler_risk === 'high' && (
        <Alert className="border-destructive/30 bg-destructive/5 backdrop-blur">
          <Shield className="h-5 w-5 text-destructive" />
          <div className="flex-1">
            <AlertTitle className="text-destructive flex items-center gap-2">
              Kessler Syndrome Risk Elevated
              <Badge variant="destructive">HIGH</Badge>
            </AlertTitle>
            <AlertDescription className="text-xs text-muted-foreground">
              Multiple collision risks detected. Debris cascade potential is elevated. 
              Consider implementing avoidance maneuvers.
            </AlertDescription>
          </div>
        </Alert>
      )}
    </div>
  );
};
