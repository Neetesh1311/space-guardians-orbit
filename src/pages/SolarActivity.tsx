import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { useSolarWeather } from '@/hooks/useSolarWeather';
import { 
  Sun, 
  Zap, 
  Wind, 
  Activity, 
  AlertTriangle,
  Radio,
  Satellite,
  Shield
} from 'lucide-react';
import { format } from 'date-fns';

const SolarActivity = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data, isLoading, error } = useSolarWeather();

  const getThreatInfo = (level: string) => {
    const info: Record<string, { color: string; impact: string; icon: React.ReactNode }> = {
      low: { 
        color: 'bg-success/20 text-success border-success/30',
        impact: 'Minimal impact on satellite operations',
        icon: <Shield className="h-5 w-5 text-success" />
      },
      moderate: { 
        color: 'bg-warning/20 text-warning border-warning/30',
        impact: 'Possible minor communication disruptions',
        icon: <Radio className="h-5 w-5 text-warning" />
      },
      high: { 
        color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
        impact: 'Significant risk to satellite electronics and communications',
        icon: <AlertTriangle className="h-5 w-5 text-orange-400" />
      },
      severe: { 
        color: 'bg-destructive/20 text-destructive border-destructive/30',
        impact: 'Critical risk - immediate protective measures recommended',
        icon: <AlertTriangle className="h-5 w-5 text-destructive animate-pulse" />
      },
    };
    return info[level] || info.low;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background stars-bg">
        <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex">
          <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-4 md:p-6">
            <Skeleton className="h-8 w-64 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Skeleton className="h-[400px]" />
              <Skeleton className="h-[400px]" />
              <Skeleton className="h-[400px]" />
            </div>
          </main>
        </div>
      </div>
    );
  }

  const threatInfo = getThreatInfo(data?.overallThreatLevel || 'low');

  return (
    <div className="min-h-screen bg-background stars-bg">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10 border border-warning/30">
                <Sun className="h-6 w-6 text-warning" />
              </div>
              Solar Activity Monitor
            </h1>
            <p className="text-muted-foreground mt-1">
              Real-time space weather monitoring via NASA DONKI API
            </p>
          </div>

          {/* Threat Level Banner */}
          <Card className={`mb-6 border-2 ${threatInfo.color}`}>
            <CardContent className="py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {threatInfo.icon}
                  <div>
                    <h3 className="font-semibold">
                      Space Weather Threat Level: {data?.overallThreatLevel?.toUpperCase()}
                    </h3>
                    <p className="text-sm text-muted-foreground">{threatInfo.impact}</p>
                  </div>
                </div>
                <Badge variant="outline" className={threatInfo.color}>
                  <Satellite className="h-3 w-3 mr-1" />
                  Satellite Advisory Active
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Stats Overview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="glass-panel border-border/50">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/10">
                    <Zap className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{data?.flares.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Solar Flares (7 days)</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-border/50">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-orange-500/10">
                    <Wind className="h-5 w-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{data?.cmes.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Coronal Mass Ejections</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="glass-panel border-border/50">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Activity className="h-5 w-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{data?.geomagneticStorms.length || 0}</p>
                    <p className="text-xs text-muted-foreground">Geomagnetic Storms</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Solar Flares */}
            <Card className="glass-panel border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-yellow-400" />
                  Solar Flares
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {data?.flares.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Zap className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No solar flares detected</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data?.flares.map((flare) => (
                        <div 
                          key={flare.flrID}
                          className={`p-3 rounded-lg border ${
                            flare.classType?.startsWith('X') ? 'bg-destructive/5 border-destructive/30' :
                            flare.classType?.startsWith('M') ? 'bg-orange-500/5 border-orange-500/30' :
                            'bg-yellow-500/5 border-yellow-500/30'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Class {flare.classType || 'Unknown'}
                            </span>
                            <Badge variant="outline" className={
                              flare.classType?.startsWith('X') ? 'bg-destructive/20 text-destructive' :
                              flare.classType?.startsWith('M') ? 'bg-orange-500/20 text-orange-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            }>
                              {flare.classType?.startsWith('X') ? 'Extreme' :
                               flare.classType?.startsWith('M') ? 'Strong' : 'Moderate'}
                            </Badge>
                          </div>
                          <div className="text-xs text-muted-foreground space-y-1">
                            <p>Start: {flare.beginTime ? format(new Date(flare.beginTime), 'MMM d, HH:mm') : 'N/A'}</p>
                            <p>Peak: {flare.peakTime ? format(new Date(flare.peakTime), 'MMM d, HH:mm') : 'N/A'}</p>
                            <p>Location: {flare.sourceLocation || 'Unknown'}</p>
                            {flare.activeRegionNum && <p>Active Region: {flare.activeRegionNum}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* CMEs */}
            <Card className="glass-panel border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Wind className="h-5 w-5 text-orange-400" />
                  Coronal Mass Ejections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {data?.cmes.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Wind className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No CMEs detected</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data?.cmes.map((cme) => {
                        const analysis = cme.cmeAnalyses?.[0];
                        const speed = analysis?.speed || 0;
                        return (
                          <div 
                            key={cme.activityID}
                            className={`p-3 rounded-lg border ${
                              speed > 1500 ? 'bg-destructive/5 border-destructive/30' :
                              speed > 800 ? 'bg-orange-500/5 border-orange-500/30' :
                              'bg-secondary/30 border-border/50'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">CME Event</span>
                              {speed > 0 && (
                                <Badge variant="outline" className={
                                  speed > 1500 ? 'bg-destructive/20 text-destructive' :
                                  speed > 800 ? 'bg-orange-500/20 text-orange-400' :
                                  'bg-secondary'
                                }>
                                  {Math.round(speed)} km/s
                                </Badge>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground space-y-1">
                              <p>Start: {cme.startTime ? format(new Date(cme.startTime), 'MMM d, HH:mm') : 'N/A'}</p>
                              <p>Location: {cme.sourceLocation || 'Unknown'}</p>
                              {analysis && (
                                <>
                                  <p>Half Angle: {analysis.halfAngle}°</p>
                                  <p>Lat/Long: {analysis.latitude}° / {analysis.longitude}°</p>
                                </>
                              )}
                            </div>
                            {cme.note && (
                              <p className="text-xs mt-2 text-muted-foreground line-clamp-2">
                                {cme.note}
                              </p>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Geomagnetic Storms */}
            <Card className="glass-panel border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Activity className="h-5 w-5 text-purple-400" />
                  Geomagnetic Storms
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  {data?.geomagneticStorms.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <Activity className="h-8 w-8 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">No geomagnetic storms detected</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {data?.geomagneticStorms.map((storm) => {
                        const maxKp = Math.max(...(storm.allKpIndex?.map(k => k.kpIndex) || [0]));
                        return (
                          <div 
                            key={storm.gstID}
                            className={`p-3 rounded-lg border ${
                              maxKp >= 8 ? 'bg-destructive/5 border-destructive/30' :
                              maxKp >= 6 ? 'bg-orange-500/5 border-orange-500/30' :
                              maxKp >= 5 ? 'bg-warning/5 border-warning/30' :
                              'bg-purple-500/5 border-purple-500/30'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm font-medium">
                                G{Math.min(5, Math.max(1, maxKp - 4))} Storm
                              </span>
                              <Badge variant="outline" className={
                                maxKp >= 8 ? 'bg-destructive/20 text-destructive' :
                                maxKp >= 6 ? 'bg-orange-500/20 text-orange-400' :
                                maxKp >= 5 ? 'bg-warning/20 text-warning' :
                                'bg-purple-500/20 text-purple-400'
                              }>
                                Kp {maxKp}
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground">
                              <p>Start: {storm.startTime ? format(new Date(storm.startTime), 'MMM d, HH:mm') : 'N/A'}</p>
                            </div>
                            {storm.allKpIndex && storm.allKpIndex.length > 0 && (
                              <div className="mt-2 flex gap-1">
                                {storm.allKpIndex.slice(0, 8).map((kp, i) => (
                                  <div 
                                    key={i}
                                    className={`w-6 h-6 rounded text-xs flex items-center justify-center font-medium ${
                                      kp.kpIndex >= 7 ? 'bg-destructive text-destructive-foreground' :
                                      kp.kpIndex >= 5 ? 'bg-warning text-warning-foreground' :
                                      'bg-secondary text-secondary-foreground'
                                    }`}
                                  >
                                    {kp.kpIndex}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SolarActivity;