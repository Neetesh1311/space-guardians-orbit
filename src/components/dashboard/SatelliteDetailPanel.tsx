import { useEffect, useMemo, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import type { Satellite } from '@/types/space';
import { Activity, Calendar, FileDown, FileText, Gauge, Globe2, Radio, Rocket, Satellite as SatelliteIcon, Shield, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { exportSatelliteCSV, exportSatellitePDF } from '@/lib/exporters';

interface SatelliteDetailPanelProps {
  satellite: Satellite | null;
  compact?: boolean;
}

const riskTone = (risk?: string) => {
  if (risk === 'critical') return 'text-destructive border-destructive/40 bg-destructive/10';
  if (risk === 'warning') return 'text-warning border-warning/40 bg-warning/10';
  return 'text-success border-success/40 bg-success/10';
};

const orbitPeriodMinutes = (altitude: number) => {
  const earthRadius = 6371;
  const mu = 398600.4418;
  const semiMajorAxis = earthRadius + altitude;
  return (2 * Math.PI * Math.sqrt(Math.pow(semiMajorAxis, 3) / mu)) / 60;
};

const trajectoryPrediction = (satellite: Satellite) => {
  const period = orbitPeriodMinutes(satellite.altitude);
  const passMinutes = satellite.orbitType === 'GEO' ? 1436 : period;
  const crowding = satellite.orbitType === 'LEO' && satellite.altitude >= 500 && satellite.altitude <= 900;
  const drift = satellite.orbitType === 'GEO' ? 'station-keeping drift under ±0.08°/day' : `${(360 / period).toFixed(2)}° mean anomaly advance per minute`;
  const nextPass = satellite.orbitType === 'GEO' ? 'continuous regional coverage' : `${Math.round(passMinutes / 2)} min to next comparable ground-track pass`;
  return { period, crowding, drift, nextPass };
};

export const SatelliteDetailPanel = ({ satellite, compact = false }: SatelliteDetailPanelProps) => {
  // Stable phase offset per satellite (so progress doesn't reset when selecting another)
  const phaseOffset = useMemo(() => {
    if (!satellite) return 0;
    let h = 0;
    for (let i = 0; i < satellite.id.length; i++) h = (h * 31 + satellite.id.charCodeAt(i)) | 0;
    return Math.abs(h % 1000) / 1000;
  }, [satellite?.id]);

  // Tick every second; recompute progress from real time + phase
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  if (!satellite) {
    return (
      <Card className="glass-panel h-full">
        <CardContent className="h-full min-h-[280px] flex flex-col items-center justify-center text-center p-6">
          <SatelliteIcon className="h-12 w-12 text-muted-foreground/40 mb-3" />
          <p className="font-medium">Select a satellite</p>
          <p className="text-xs text-muted-foreground mt-1">Click any live object in the 3D view or satellite list.</p>
        </CardContent>
      </Card>
    );
  }

  const prediction = trajectoryPrediction(satellite);
  const riskScore = satellite.riskLevel === 'critical' ? 92 : satellite.riskLevel === 'warning' ? 58 : 18;
  const minutesNow = now / 1000 / 60;
  const orbitProgress = Math.round((((minutesNow % prediction.period) / prediction.period) + phaseOffset) % 1 * 100);

  return (
    <Card className={cn('glass-panel overflow-hidden', compact ? '' : 'h-full')}>
      <CardHeader className="pb-3 border-b border-border/40 bg-secondary/20">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <CardTitle className="text-lg flex items-center gap-2">
              <SatelliteIcon className="h-5 w-5 text-primary" />
              <span className="truncate">{satellite.name}</span>
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{satellite.operator || satellite.country || 'Orbital object'} • {satellite.orbitType}</p>
          </div>
          <Badge variant="outline" className={riskTone(satellite.riskLevel)}>{satellite.riskLevel.toUpperCase()}</Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="rounded-lg bg-secondary/30 border border-border/50 p-3">
            <Globe2 className="h-4 w-4 text-primary mb-1" />
            <p className="text-muted-foreground">Altitude</p>
            <p className="font-mono text-base font-bold">{satellite.altitude.toLocaleString()} km</p>
          </div>
          <div className="rounded-lg bg-secondary/30 border border-border/50 p-3">
            <Gauge className="h-4 w-4 text-warning mb-1" />
            <p className="text-muted-foreground">Velocity</p>
            <p className="font-mono text-base font-bold">{satellite.velocity.toFixed(2)} km/s</p>
          </div>
          <div className="rounded-lg bg-secondary/30 border border-border/50 p-3">
            <Activity className="h-4 w-4 text-accent mb-1" />
            <p className="text-muted-foreground">Inclination</p>
            <p className="font-mono text-base font-bold">{satellite.inclination.toFixed(1)}°</p>
          </div>
          <div className="rounded-lg bg-secondary/30 border border-border/50 p-3">
            <Calendar className="h-4 w-4 text-success mb-1" />
            <p className="text-muted-foreground">Launch</p>
            <p className="font-mono text-sm font-bold">{satellite.launchDate || 'Tracked'}</p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Orbit progress</span>
            <span className="font-mono">{orbitProgress}%</span>
          </div>
          <Progress value={orbitProgress} className="h-2" />
          <div className="grid grid-cols-2 gap-2 text-[11px] text-muted-foreground">
            <span>Period: {prediction.period.toFixed(1)} min</span>
            <span>{prediction.nextPass}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3 text-xs">
          <div>
            <p className="text-muted-foreground flex items-center gap-1 mb-1"><Target className="h-3 w-3" /> Mission objective</p>
            <p className="leading-relaxed">{satellite.mission || 'Operational satellite tracking, communications, navigation, science, or Earth observation mission.'}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-muted-foreground flex items-center gap-1"><Rocket className="h-3 w-3" /> Launch vehicle</p>
              <p className="font-medium">{satellite.launchVehicle || 'Catalog pending'}</p>
            </div>
            <div>
              <p className="text-muted-foreground flex items-center gap-1"><Radio className="h-3 w-3" /> Telemetry</p>
              <p className="font-medium">Live propagated</p>
            </div>
          </div>
          <div className="rounded-lg border border-border/50 bg-secondary/20 p-3">
            <p className="text-muted-foreground flex items-center gap-1 mb-1"><Shield className="h-3 w-3" /> Trajectory prediction</p>
            <p>{prediction.drift}. {prediction.crowding ? 'Object is inside the dense LEO collision-monitoring band; conjunction checks are prioritized.' : 'Current orbital shell is within nominal monitoring thresholds.'}</p>
            <div className="mt-2 flex items-center justify-between">
              <span>Collision risk model</span>
              <Badge variant="outline" className={riskTone(satellite.riskLevel)}>{riskScore}% confidence</Badge>
            </div>
          </div>

          <div className="flex gap-2 pt-1">
            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => exportSatelliteCSV(satellite)}>
              <FileDown className="h-3.5 w-3.5 mr-1" /> CSV
            </Button>
            <Button size="sm" variant="outline" className="flex-1 h-8 text-xs" onClick={() => exportSatellitePDF(satellite)}>
              <FileText className="h-3.5 w-3.5 mr-1" /> PDF
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
