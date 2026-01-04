import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useAsteroidData } from '@/hooks/useAsteroidData';
import { AlertTriangle, Orbit, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Asteroid } from '@/types/space';

const AsteroidItem = ({ asteroid }: { asteroid: Asteroid }) => {
  const formatDistance = (km: number) => {
    if (km > 1000000) {
      return `${(km / 1000000).toFixed(2)}M km`;
    }
    return `${km.toLocaleString()} km`;
  };

  const formatDiameter = (min: number, max: number) => {
    const avg = (min + max) / 2;
    if (avg < 1) {
      return `${(avg * 1000).toFixed(0)}m`;
    }
    return `${avg.toFixed(2)}km`;
  };

  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-all duration-300 hover:scale-[1.01]',
        asteroid.isPotentiallyHazardous
          ? 'bg-destructive/10 border-destructive/30 hover:border-destructive/50'
          : 'bg-secondary/30 border-border/50 hover:border-primary/30'
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h4 className="font-semibold text-sm truncate">{asteroid.name}</h4>
            {asteroid.isPotentiallyHazardous && (
              <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                <AlertTriangle className="h-3 w-3 mr-1" />
                HAZARDOUS
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Orbit className="h-3 w-3 text-primary" />
              <span>{formatDistance(asteroid.missDistance)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Zap className="h-3 w-3 text-warning" />
              <span>{asteroid.relativeVelocity.toFixed(1)} km/s</span>
            </div>
            <div className="col-span-2">
              <span className="text-muted-foreground/70">Diameter: </span>
              <span>{formatDiameter(asteroid.estimatedDiameter.min, asteroid.estimatedDiameter.max)}</span>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-[10px] text-muted-foreground uppercase">Approach</div>
          <div className="text-xs font-medium">{asteroid.closeApproachDate}</div>
        </div>
      </div>
    </div>
  );
};

const LoadingSkeleton = () => (
  <div className="space-y-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div key={i} className="p-4 rounded-lg border border-border/50 bg-secondary/20">
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-8 w-16" />
        </div>
      </div>
    ))}
  </div>
);

export const AsteroidPanel = () => {
  const { data: asteroids, isLoading, error } = useAsteroidData();

  const hazardousCount = asteroids?.filter(a => a.isPotentiallyHazardous).length || 0;

  return (
    <Card variant="glass" className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-warning animate-pulse" />
            Near-Earth Asteroids
          </CardTitle>
          {hazardousCount > 0 && (
            <Badge variant="outline" className="border-destructive/50 text-destructive">
              {hazardousCount} Hazardous
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground">
          Next 7 days • NASA NEO API
        </p>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-4 pt-0">
        <ScrollArea className="h-full pr-3">
          {isLoading ? (
            <LoadingSkeleton />
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-32 text-muted-foreground">
              <AlertTriangle className="h-8 w-8 mb-2 text-destructive" />
              <p className="text-sm">Failed to load asteroid data</p>
            </div>
          ) : (
            <div className="space-y-3">
              {asteroids?.slice(0, 10).map((asteroid) => (
                <AsteroidItem key={asteroid.id} asteroid={asteroid} />
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
