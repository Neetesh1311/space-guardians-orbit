import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Satellite as SatelliteIcon, Radio } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Satellite } from '@/types/space';

interface SatelliteListProps {
  satellites: Satellite[];
  isLoading: boolean;
}

const SatelliteItem = ({ satellite }: { satellite: Satellite }) => {
  const riskStyles = {
    safe: 'border-success/30 bg-success/5',
    warning: 'border-warning/30 bg-warning/5',
    critical: 'border-destructive/30 bg-destructive/5',
  };

  const riskBadgeStyles = {
    safe: 'bg-success/20 text-success border-success/30',
    warning: 'bg-warning/20 text-warning border-warning/30',
    critical: 'bg-destructive/20 text-destructive border-destructive/30',
  };

  const orbitColors = {
    LEO: 'text-primary',
    MEO: 'text-success',
    GEO: 'text-warning',
    HEO: 'text-accent',
  };

  return (
    <div
      className={cn(
        'p-3 rounded-lg border transition-all duration-200 hover:scale-[1.01] cursor-pointer',
        riskStyles[satellite.riskLevel]
      )}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 min-w-0">
          <div className={cn('p-2 rounded-lg bg-secondary/50', orbitColors[satellite.orbitType])}>
            <SatelliteIcon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <h4 className="font-medium text-sm truncate">{satellite.name}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className={orbitColors[satellite.orbitType]}>{satellite.orbitType}</span>
              <span>•</span>
              <span>{satellite.altitude.toLocaleString()} km</span>
            </div>
          </div>
        </div>
        
        <Badge variant="outline" className={cn('text-[10px] shrink-0', riskBadgeStyles[satellite.riskLevel])}>
          {satellite.riskLevel.toUpperCase()}
        </Badge>
      </div>
    </div>
  );
};

export const SatelliteList = ({ satellites, isLoading }: SatelliteListProps) => {
  const criticalCount = satellites.filter(s => s.riskLevel === 'critical').length;
  const warningCount = satellites.filter(s => s.riskLevel === 'warning').length;

  // Sort by risk level
  const sortedSatellites = [...satellites].sort((a, b) => {
    const riskOrder = { critical: 0, warning: 1, safe: 2 };
    return riskOrder[a.riskLevel] - riskOrder[b.riskLevel];
  });

  return (
    <Card variant="glass" className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Radio className="h-4 w-4 text-primary" />
            Active Satellites
          </CardTitle>
          <div className="flex gap-1.5">
            {criticalCount > 0 && (
              <Badge variant="outline" className="border-destructive/50 text-destructive text-xs">
                {criticalCount} Critical
              </Badge>
            )}
            {warningCount > 0 && (
              <Badge variant="outline" className="border-warning/50 text-warning text-xs">
                {warningCount} Warning
              </Badge>
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          {satellites.length} tracked objects
        </p>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-4 pt-0">
        <ScrollArea className="h-full pr-3">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : (
            <div className="space-y-2">
              {sortedSatellites.map((satellite) => (
                <SatelliteItem key={satellite.id} satellite={satellite} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
