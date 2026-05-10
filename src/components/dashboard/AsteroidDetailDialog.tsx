import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Orbit, Zap, Ruler, Calendar, ExternalLink, Globe2, Target, TrendingUp } from 'lucide-react';
import type { Asteroid } from '@/types/space';

interface Props {
  asteroid: Asteroid | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

const LD_KM = 384_400; // 1 lunar distance in km

export const AsteroidDetailDialog = ({ asteroid, open, onOpenChange }: Props) => {
  if (!asteroid) return null;

  const avgDiameterKm = (asteroid.estimatedDiameter.min + asteroid.estimatedDiameter.max) / 2;
  const lunarDistances = (asteroid.missDistance / LD_KM).toFixed(2);
  // Simple kinetic energy proxy (megatons TNT, very rough)
  const massKg = (4 / 3) * Math.PI * Math.pow((avgDiameterKm * 1000) / 2, 3) * 2600; // density 2.6 g/cm³
  const vMs = asteroid.relativeVelocity * 1000;
  const energyJ = 0.5 * massKg * vMs * vMs;
  const megatons = energyJ / 4.184e15;

  // Encoded NASA refs
  const nasaJplUrl = `https://ssd.jpl.nasa.gov/sbdb.cgi?sstr=${encodeURIComponent(asteroid.name)}`;
  const nasaNeoUrl = `https://api.nasa.gov/neo/rest/v1/neo/${asteroid.id}?api_key=DEMO_KEY`;
  const cneosUrl = `https://cneos.jpl.nasa.gov/ca/`;
  const donkiUrl = `https://kauai.ccmc.gsfc.nasa.gov/DONKI/search/`;

  const trajectoryNote = asteroid.isPotentiallyHazardous
    ? `Classified as Potentially Hazardous (PHA): MOID < 0.05 AU and absolute magnitude H ≤ 22.0. Trajectory will be re-observed during the next apparition.`
    : `Standard NEO trajectory; close approach poses no impact risk. Orbit refinement is routine.`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl glass-panel border-primary/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Target className="h-5 w-5 text-primary" />
            {asteroid.name}
            {asteroid.isPotentiallyHazardous && (
              <Badge variant="destructive" className="ml-1">
                <AlertTriangle className="h-3 w-3 mr-1" /> Hazardous
              </Badge>
            )}
          </DialogTitle>
          <DialogDescription>
            Near-Earth Object · close approach {asteroid.closeApproachDate} · orbiting {asteroid.orbitingBody}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs mt-2">
          <Stat icon={Ruler} label="Diameter (avg)" value={`${(avgDiameterKm * 1000).toFixed(0)} m`} sub={`${asteroid.estimatedDiameter.min.toFixed(2)}–${asteroid.estimatedDiameter.max.toFixed(2)} km`} />
          <Stat icon={Zap} label="Velocity" value={`${asteroid.relativeVelocity.toFixed(2)} km/s`} sub={`${(asteroid.relativeVelocity * 3600).toFixed(0)} km/h`} />
          <Stat icon={Orbit} label="Miss distance" value={`${asteroid.missDistance.toLocaleString(undefined, { maximumFractionDigits: 0 })} km`} sub={`${lunarDistances} LD`} />
          <Stat icon={Calendar} label="Approach date" value={asteroid.closeApproachDate} sub="UTC" />
          <Stat icon={Globe2} label="Orbiting" value={asteroid.orbitingBody} sub="Reference body" />
          <Stat icon={TrendingUp} label="Impact energy*" value={`${megatons < 0.01 ? '<0.01' : megatons.toFixed(2)} Mt`} sub="*Hypothetical, kinetic" />
        </div>

        <Separator className="my-3" />

        <div className="space-y-2 text-sm">
          <p className="font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" /> Trajectory analysis
          </p>
          <p className="text-muted-foreground text-xs leading-relaxed">{trajectoryNote}</p>
          <p className="text-muted-foreground text-xs leading-relaxed">
            At closest approach, the object will pass <span className="font-mono text-foreground">{lunarDistances}×</span> the
            Earth–Moon distance. Even at this range, ground-based radar (Goldstone, Arecibo legacy successors) can refine
            the orbit to within a few hundred meters.
          </p>
        </div>

        <Separator className="my-3" />

        <div>
          <p className="font-semibold text-sm mb-2">Source references</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <SourceLink href={nasaJplUrl} label="NASA JPL Small-Body Database" />
            <SourceLink href={nasaNeoUrl} label="NASA NEO REST API entry" />
            <SourceLink href={cneosUrl} label="CNEOS Close-Approach Tables" />
            <SourceLink href={donkiUrl} label="NASA DONKI Space Weather" />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Stat = ({ icon: Icon, label, value, sub }: { icon: any; label: string; value: string; sub?: string }) => (
  <div className="rounded-lg bg-secondary/40 border border-border/40 p-3">
    <Icon className="h-4 w-4 text-primary mb-1" />
    <p className="text-muted-foreground text-[10px] uppercase tracking-wider">{label}</p>
    <p className="font-mono text-sm font-bold">{value}</p>
    {sub && <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>}
  </div>
);

const SourceLink = ({ href, label }: { href: string; label: string }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center justify-between rounded-md border border-border/50 bg-secondary/30 px-3 py-2 hover:border-primary/50 hover:bg-primary/10 transition"
  >
    <span>{label}</span>
    <ExternalLink className="h-3 w-3 text-muted-foreground" />
  </a>
);
