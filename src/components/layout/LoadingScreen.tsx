import { useEffect, useState } from 'react';
import { Shield, Satellite, Globe, Rocket } from 'lucide-react';

export const LoadingScreen = ({ onDone }: { onDone: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [stage, setStage] = useState('Initializing systems...');

  useEffect(() => {
    const stages = [
      { at: 15, label: 'Establishing satellite uplink...' },
      { at: 35, label: 'Loading orbital telemetry...' },
      { at: 55, label: 'Syncing NORAD catalog...' },
      { at: 75, label: 'Calibrating AI collision engine...' },
      { at: 92, label: 'Preparing mission control...' },
      { at: 100, label: 'Welcome, Commander.' },
    ];
    const id = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + Math.random() * 8 + 3, 100);
        const cur = stages.find((s) => next >= s.at && p < s.at);
        if (cur) setStage(cur.label);
        if (next >= 100) {
          clearInterval(id);
          setTimeout(onDone, 500);
        }
        return next;
      });
    }, 120);
    return () => clearInterval(id);
  }, [onDone]);

  return (
    <div className="fixed inset-0 z-[200] bg-background flex items-center justify-center stars-bg overflow-hidden">
      {/* Animated nebula layers */}
      <div className="absolute inset-0 nebula-bg opacity-70" />
      <div className="absolute inset-0 bg-gradient-radial from-primary/15 via-transparent to-transparent" />

      {/* Sweeping scanline */}
      <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent scan-line" />

      {/* Orbiting micro-satellites */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="relative w-[420px] h-[420px] animate-[spin_18s_linear_infinite]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_hsl(var(--primary))]" />
        </div>
        <div className="absolute w-[320px] h-[320px] animate-[spin_12s_linear_infinite_reverse]">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_hsl(var(--accent))]" />
        </div>
      </div>

      <div className="relative z-10 max-w-md w-full px-8 text-center">
        <div className="relative mx-auto w-36 h-36 mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-[spin_4s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border-2 border-accent/40 border-dashed animate-[spin_6s_linear_infinite_reverse]" />
          <div className="absolute inset-6 rounded-full border border-warning/20 animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-10 rounded-full bg-gradient-to-br from-primary/40 to-accent/40 blur-md animate-pulse-slow" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="h-14 w-14 text-primary animate-pulse drop-shadow-[0_0_12px_hsl(var(--primary))]" />
          </div>
        </div>

        <h1 className="text-4xl font-bold mb-1 tracking-tight">
          Space<span className="text-gradient">Shield</span>
        </h1>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-[0.3em]">
          Orbital Defense Network · v2.5
        </p>

        <div className="h-2 bg-secondary/50 rounded-full overflow-hidden mb-3 border border-border/40">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-200 shadow-[0_0_24px_hsl(var(--primary))]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[11px] text-muted-foreground font-mono">
          <span className="truncate">› {stage}</span>
          <span className="text-primary font-bold">{Math.floor(progress)}%</span>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-8">
          <div className="rounded border border-border/40 bg-secondary/30 px-2 py-1.5 text-[10px] font-mono text-muted-foreground flex items-center justify-center gap-1">
            <Satellite className="h-3 w-3 text-primary" /> 27,463 OBJ
          </div>
          <div className="rounded border border-border/40 bg-secondary/30 px-2 py-1.5 text-[10px] font-mono text-muted-foreground flex items-center justify-center gap-1">
            <Globe className="h-3 w-3 text-success" /> NORAD SYNC
          </div>
          <div className="rounded border border-border/40 bg-secondary/30 px-2 py-1.5 text-[10px] font-mono text-muted-foreground flex items-center justify-center gap-1">
            <Rocket className="h-3 w-3 text-warning" /> AI ONLINE
          </div>
        </div>
      </div>
    </div>
  );
};
