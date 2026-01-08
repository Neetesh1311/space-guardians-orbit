import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useSolarWeather } from '@/hooks/useSolarWeather';
import { Sun, Zap, Wind, AlertTriangle, Activity } from 'lucide-react';
import { format } from 'date-fns';

const ThreatLevelBadge = ({ level }: { level: string }) => {
  const variants: Record<string, { class: string; icon: React.ReactNode }> = {
    low: { class: 'bg-success/20 text-success border-success/30', icon: null },
    moderate: { class: 'bg-warning/20 text-warning border-warning/30', icon: null },
    high: { class: 'bg-orange-500/20 text-orange-400 border-orange-500/30', icon: <AlertTriangle className="h-3 w-3 mr-1" /> },
    severe: { class: 'bg-destructive/20 text-destructive border-destructive/30', icon: <AlertTriangle className="h-3 w-3 mr-1 animate-pulse" /> },
  };
  
  const variant = variants[level] || variants.low;
  
  return (
    <Badge variant="outline" className={variant.class}>
      {variant.icon}
      {level.toUpperCase()}
    </Badge>
  );
};

export const SolarWeatherPanel = () => {
  const { data, isLoading, error } = useSolarWeather();

  if (isLoading) {
    return (
      <Card className="h-full glass-panel border-border/50">
        <CardHeader className="pb-3">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error || !data) {
    return (
      <Card className="h-full glass-panel border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Sun className="h-5 w-5 text-warning" />
            Solar Weather
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Unable to load solar weather data</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full glass-panel border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <Sun className="h-5 w-5 text-warning" />
            Solar Weather Monitor
          </CardTitle>
          <ThreatLevelBadge level={data.overallThreatLevel} />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Stats Overview */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg bg-secondary/30 border border-border/50 text-center">
            <Zap className="h-4 w-4 mx-auto mb-1 text-yellow-400" />
            <p className="text-lg font-bold">{data.flares.length}</p>
            <p className="text-[10px] text-muted-foreground">Solar Flares</p>
          </div>
          <div className="p-2 rounded-lg bg-secondary/30 border border-border/50 text-center">
            <Wind className="h-4 w-4 mx-auto mb-1 text-orange-400" />
            <p className="text-lg font-bold">{data.cmes.length}</p>
            <p className="text-[10px] text-muted-foreground">CMEs</p>
          </div>
          <div className="p-2 rounded-lg bg-secondary/30 border border-border/50 text-center">
            <Activity className="h-4 w-4 mx-auto mb-1 text-purple-400" />
            <p className="text-lg font-bold">{data.geomagneticStorms.length}</p>
            <p className="text-[10px] text-muted-foreground">Geo Storms</p>
          </div>
        </div>

        <ScrollArea className="h-[240px]">
          <div className="space-y-3">
            {/* Solar Flares */}
            {data.flares.slice(0, 5).map((flare) => (
              <div key={flare.flrID} className="p-3 rounded-lg bg-yellow-500/5 border border-yellow-500/20">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Zap className="h-3 w-3 text-yellow-400" />
                    <span className="text-sm font-medium">Solar Flare</span>
                  </div>
                  <Badge variant="outline" className={
                    flare.classType?.startsWith('X') ? 'bg-destructive/20 text-destructive' :
                    flare.classType?.startsWith('M') ? 'bg-orange-500/20 text-orange-400' :
                    'bg-yellow-500/20 text-yellow-400'
                  }>
                    {flare.classType || 'Unknown'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {flare.beginTime ? format(new Date(flare.beginTime), 'MMM d, HH:mm') : 'Time unknown'} • {flare.sourceLocation || 'Unknown location'}
                </p>
              </div>
            ))}

            {/* CMEs */}
            {data.cmes.slice(0, 3).map((cme) => (
              <div key={cme.activityID} className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Wind className="h-3 w-3 text-orange-400" />
                    <span className="text-sm font-medium">CME Detected</span>
                  </div>
                  {cme.cmeAnalyses?.[0]?.speed && (
                    <Badge variant="outline" className="bg-orange-500/20 text-orange-400">
                      {Math.round(cme.cmeAnalyses[0].speed)} km/s
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {cme.startTime ? format(new Date(cme.startTime), 'MMM d, HH:mm') : 'Time unknown'}
                </p>
                {cme.note && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{cme.note}</p>
                )}
              </div>
            ))}

            {/* Geomagnetic Storms */}
            {data.geomagneticStorms.slice(0, 2).map((storm) => (
              <div key={storm.gstID} className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/20">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <Activity className="h-3 w-3 text-purple-400" />
                    <span className="text-sm font-medium">Geomagnetic Storm</span>
                  </div>
                  {storm.allKpIndex?.[0] && (
                    <Badge variant="outline" className={
                      storm.allKpIndex[0].kpIndex >= 7 ? 'bg-destructive/20 text-destructive' :
                      storm.allKpIndex[0].kpIndex >= 5 ? 'bg-orange-500/20 text-orange-400' :
                      'bg-purple-500/20 text-purple-400'
                    }>
                      Kp {storm.allKpIndex[0].kpIndex}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  {storm.startTime ? format(new Date(storm.startTime), 'MMM d, HH:mm') : 'Time unknown'}
                </p>
              </div>
            ))}

            {data.flares.length === 0 && data.cmes.length === 0 && data.geomagneticStorms.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <Sun className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No significant solar activity in the past 7 days</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};