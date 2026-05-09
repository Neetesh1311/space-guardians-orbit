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
    <div className="fixed inset-0 z-[200] bg-background flex items-center justify-center stars-bg">
      <div className="absolute inset-0 bg-gradient-radial from-primary/10 via-transparent to-transparent" />
      <div className="relative z-10 max-w-md w-full px-8 text-center">
        <div className="relative mx-auto w-32 h-32 mb-8">
          <div className="absolute inset-0 rounded-full bg-primary/20 blur-3xl animate-pulse" />
          <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-[spin_4s_linear_infinite]" />
          <div className="absolute inset-2 rounded-full border-2 border-accent/40 border-dashed animate-[spin_6s_linear_infinite_reverse]" />
          <div className="absolute inset-6 rounded-full border border-warning/20 animate-[spin_3s_linear_infinite]" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Shield className="h-12 w-12 text-primary animate-pulse" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-1 tracking-tight">
          Space<span className="text-primary">Shield</span>
        </h1>
        <p className="text-xs text-muted-foreground mb-8 uppercase tracking-widest">
          Ultimate Space Protection System
        </p>

        <div className="h-1.5 bg-secondary/50 rounded-full overflow-hidden mb-3">
          <div
            className="h-full bg-gradient-to-r from-primary via-accent to-primary transition-all duration-200 shadow-[0_0_20px_hsl(var(--primary))]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-muted-foreground font-mono">
          <span>{stage}</span>
          <span className="text-primary">{Math.floor(progress)}%</span>
        </div>

        <div className="flex justify-center gap-6 mt-8 opacity-60">
          <Satellite className="h-4 w-4 animate-bounce" style={{ animationDelay: '0ms' }} />
          <Globe className="h-4 w-4 animate-bounce" style={{ animationDelay: '150ms' }} />
          <Rocket className="h-4 w-4 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
