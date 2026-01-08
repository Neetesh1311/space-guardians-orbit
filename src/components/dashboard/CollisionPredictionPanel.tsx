import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useCollisionPrediction } from '@/hooks/useCollisionPrediction';
import type { Satellite } from '@/types/space';
import { Brain, AlertTriangle, Shield, Loader2, Zap, Target } from 'lucide-react';

interface CollisionPredictionPanelProps {
  satellites: Satellite[];
}

export const CollisionPredictionPanel = ({ satellites }: CollisionPredictionPanelProps) => {
  const { analyze, isAnalyzing, predictions } = useCollisionPrediction();

  const handleAnalyze = () => {
    analyze(satellites);
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-destructive/20 text-destructive border-destructive/30';
      case 'warning': return 'bg-warning/20 text-warning border-warning/30';
      default: return 'bg-success/20 text-success border-success/30';
    }
  };

  const getKesslerColor = (risk: string) => {
    switch (risk) {
      case 'high': return 'text-destructive';
      case 'medium': return 'text-warning';
      default: return 'text-success';
    }
  };

  return (
    <Card className="h-full glass-panel border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Brain className="h-5 w-5 text-primary" />
            AI Collision Prediction
          </CardTitle>
          <Button 
            onClick={handleAnalyze} 
            disabled={isAnalyzing || satellites.length === 0}
            size="sm"
            variant="glow"
            className="relative z-10"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="h-4 w-4 mr-2" />
                Analyze Risks
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      
      <CardContent>
        {!predictions ? (
          <div className="text-center py-8 text-muted-foreground">
            <Target className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p className="text-sm mb-2">No analysis performed yet</p>
            <p className="text-xs">Click "Analyze Risks" to run AI-powered collision prediction</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Overall Assessment */}
            <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Overall Assessment</span>
                <Badge 
                  variant="outline" 
                  className={`${getKesslerColor(predictions.kessler_risk || 'low')}`}
                >
                  Kessler Risk: {predictions.kessler_risk?.toUpperCase() || 'LOW'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {predictions.overall_risk_assessment || predictions.summary || 'Analysis complete'}
              </p>
            </div>

            {/* Predictions List */}
            <ScrollArea className="h-[280px]">
              <div className="space-y-2">
                {predictions.predictions?.length > 0 ? (
                  predictions.predictions.map((pred, index) => (
                    <div 
                      key={index}
                      className={`p-3 rounded-lg border ${
                        pred.risk_level === 'critical' ? 'bg-destructive/5 border-destructive/30' :
                        pred.risk_level === 'warning' ? 'bg-warning/5 border-warning/30' :
                        'bg-secondary/30 border-border/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {pred.risk_level === 'critical' && (
                            <AlertTriangle className="h-4 w-4 text-destructive animate-pulse" />
                          )}
                          {pred.risk_level === 'warning' && (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                          {pred.risk_level === 'safe' && (
                            <Shield className="h-4 w-4 text-success" />
                          )}
                          <span className="text-sm font-medium">
                            {pred.object1_name} ↔ {pred.object2_name}
                          </span>
                        </div>
                        <Badge variant="outline" className={getRiskColor(pred.risk_level)}>
                          {pred.risk_score}%
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
                        <div>
                          <span className="text-foreground/70">Min Distance:</span> {pred.minimum_distance_km?.toFixed(1)} km
                        </div>
                        <div>
                          <span className="text-foreground/70">Time to CPA:</span> {pred.time_to_closest_approach_hours?.toFixed(1)}h
                        </div>
                      </div>
                      
                      {pred.recommended_action && (
                        <p className="text-xs text-primary/80 mt-1">
                          💡 {pred.recommended_action}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-6">
                    <Shield className="h-8 w-8 mx-auto mb-2 text-success" />
                    <p className="text-sm text-muted-foreground">No significant collision risks detected</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}
      </CardContent>
    </Card>
  );
};