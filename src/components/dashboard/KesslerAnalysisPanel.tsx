import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, Activity, Zap, TrendingUp, FileDown, FileText } from 'lucide-react';
import { useMemo } from 'react';
import { exportAvoidancePlanCSV, exportAvoidancePlanPDF } from '@/lib/exporters';

interface KesslerAnalysisPanelProps {
  totalDebris: number;
  highRisk: number;
  mediumRisk: number;
}

export const KesslerAnalysisPanel = ({ totalDebris, highRisk, mediumRisk }: KesslerAnalysisPanelProps) => {
  // Simple heuristic Kessler index 0–100
  const { kesslerIndex, level, label } = useMemo(() => {
    const density = Math.min((totalDebris / 200) * 30, 30);
    const risk = Math.min(((highRisk * 4 + mediumRisk * 1.5) / Math.max(totalDebris, 1)) * 100, 70);
    const idx = Math.min(Math.round(density + risk), 100);
    let lvl: 'low' | 'medium' | 'high' | 'critical' = 'low';
    let lbl = 'Stable';
    if (idx >= 80) { lvl = 'critical'; lbl = 'Cascade Imminent'; }
    else if (idx >= 60) { lvl = 'high'; lbl = 'Elevated'; }
    else if (idx >= 35) { lvl = 'medium'; lbl = 'Watch'; }
    return { kesslerIndex: idx, level: lvl, label: lbl };
  }, [totalDebris, highRisk, mediumRisk]);

  const colorClass = {
    low: 'text-success border-success/40 bg-success/10',
    medium: 'text-warning border-warning/40 bg-warning/10',
    high: 'text-warning border-warning/50 bg-warning/15',
    critical: 'text-destructive border-destructive/50 bg-destructive/15',
  }[level];

  // Detailed step-by-step avoidance maneuvers
  const maneuvers = [
    {
      step: 1,
      burn: 'Prograde +5.0 m/s',
      dv: 5.0,
      when: 'T+0:00 ascending node',
      duration: '12.4 s',
      thrust: '420 N',
      purpose: 'Raise apogee 8 km clear of LEO debris belt',
      conjunction: 'Cosmos-2251 fragment cloud',
      pre: 'Verify GNC lock, slew to prograde',
    },
    {
      step: 2,
      burn: 'Retrograde -3.0 m/s',
      dv: 3.0,
      when: 'T+0:42 perigee',
      duration: '7.5 s',
      thrust: '420 N',
      purpose: 'Phase shift to avoid Iridium-33 fragments',
      conjunction: 'Iridium-33 / Cosmos-2251 collision residue',
      pre: 'Confirm new conjunction screening from JSpOC',
    },
    {
      step: 3,
      burn: 'Normal +1.2 m/s',
      dv: 1.2,
      when: 'T+1:18 high-latitude crossing',
      duration: '3.0 s',
      thrust: '420 N',
      purpose: 'Inclination tweak (+0.014°) for Cosmos-1408 cloud',
      conjunction: 'Cosmos-1408 ASAT debris',
      pre: 'Reaction wheels: nominal · star tracker: locked',
    },
  ];

  return (
    <Card className="glass-panel">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          Kessler Syndrome Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className={`rounded-lg border p-4 ${colorClass}`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs uppercase tracking-wider opacity-80">Cascade Risk Index</span>
            <Badge variant="outline" className="font-mono">{label}</Badge>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold font-mono">{kesslerIndex}</span>
            <span className="text-sm opacity-70">/ 100</span>
          </div>
          <Progress value={kesslerIndex} className="mt-3 h-2" />
          <p className="text-[11px] mt-3 opacity-80">
            Based on {totalDebris} tracked objects, with {highRisk} high-risk and {mediumRisk} medium-risk
            elements. Index combines orbital density and impact probability.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="rounded-lg bg-secondary/40 p-2">
            <Activity className="h-4 w-4 mx-auto text-primary mb-1" />
            <p className="text-[10px] text-muted-foreground">Density</p>
            <p className="text-sm font-mono font-bold">{(totalDebris / 1000).toFixed(2)}/km³</p>
          </div>
          <div className="rounded-lg bg-secondary/40 p-2">
            <TrendingUp className="h-4 w-4 mx-auto text-warning mb-1" />
            <p className="text-[10px] text-muted-foreground">Growth/yr</p>
            <p className="text-sm font-mono font-bold">+4.7%</p>
          </div>
          <div className="rounded-lg bg-secondary/40 p-2">
            <AlertTriangle className="h-4 w-4 mx-auto text-destructive mb-1" />
            <p className="text-[10px] text-muted-foreground">Conjunctions</p>
            <p className="text-sm font-mono font-bold">{highRisk + Math.floor(mediumRisk / 3)}</p>
          </div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1">
            <Zap className="h-3 w-3" /> Automated Avoidance Plan — Step-by-Step
          </p>
          <div className="space-y-2">
            {maneuvers.map((m) => (
              <div key={m.step} className="rounded-lg border border-border/50 bg-secondary/20 p-3">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 grid place-items-center rounded-full bg-primary/20 text-primary text-[10px] font-bold">
                      {m.step}
                    </span>
                    <span className="font-mono text-sm font-bold text-primary">{m.burn}</span>
                  </div>
                  <Badge variant="outline" className="text-[10px]">Δv {m.dv} m/s</Badge>
                </div>
                <div className="grid grid-cols-2 gap-x-3 gap-y-0.5 text-[11px] text-muted-foreground">
                  <span>⏱ {m.when}</span>
                  <span>🔥 burn {m.duration} @ {m.thrust}</span>
                  <span className="col-span-2 text-foreground/80">🎯 {m.purpose}</span>
                  <span className="col-span-2">⚠ Conjunction: {m.conjunction}</span>
                  <span className="col-span-2 italic">› Pre-burn: {m.pre}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 rounded-lg border border-primary/30 bg-primary/5 p-2.5 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="font-semibold">Total Δv budget</span>
              <span className="font-mono text-primary font-bold">
                {maneuvers.reduce((s, m) => s + m.dv, 0).toFixed(1)} m/s
              </span>
            </div>
            <p className="text-muted-foreground mt-1">
              Optimal burn window opens at next ascending node · 3-σ miss-distance improves to &gt;25 km · within nominal propellant budget.
            </p>
            <div className="mt-2 flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] flex-1"
                onClick={() => exportAvoidancePlanCSV(maneuvers, { kesslerIndex, level, lastRefresh: new Date() })}
              >
                <FileDown className="h-3 w-3 mr-1" /> CSV
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="h-7 text-[11px] flex-1"
                onClick={() => exportAvoidancePlanPDF(maneuvers, { kesslerIndex, level, lastRefresh: new Date() })}
              >
                <FileText className="h-3 w-3 mr-1" /> PDF
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
