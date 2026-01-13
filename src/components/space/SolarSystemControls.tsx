import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Play, 
  Pause, 
  Settings2,
  Eye,
  EyeOff,
  Globe,
  Sun,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface Planet {
  name: string;
  color: string;
  visible: boolean;
  selected: boolean;
}

interface SolarSystemControlsProps {
  orbitSpeed: number;
  onOrbitSpeedChange: (speed: number) => void;
  zoom: number;
  onZoomChange: (zoom: number) => void;
  selectedPlanet: string | null;
  onSelectPlanet: (planet: string | null) => void;
  isPaused: boolean;
  onTogglePause: () => void;
  showOrbits: boolean;
  onToggleOrbits: () => void;
  showLabels: boolean;
  onToggleLabels: () => void;
  planetVisibility: Record<string, boolean>;
  onTogglePlanetVisibility: (planet: string) => void;
}

const PLANETS = [
  { name: 'Mercury', color: '#b5b5b5', type: 'Terrestrial' },
  { name: 'Venus', color: '#e6c229', type: 'Terrestrial' },
  { name: 'Earth', color: '#4fc3f7', type: 'Terrestrial' },
  { name: 'Mars', color: '#cd5c5c', type: 'Terrestrial' },
  { name: 'Jupiter', color: '#d4a574', type: 'Gas Giant' },
  { name: 'Saturn', color: '#f4d03f', type: 'Gas Giant' },
  { name: 'Uranus', color: '#7fdbff', type: 'Ice Giant' },
  { name: 'Neptune', color: '#4169e1', type: 'Ice Giant' },
];

export const SolarSystemControls = ({
  orbitSpeed,
  onOrbitSpeedChange,
  zoom,
  onZoomChange,
  selectedPlanet,
  onSelectPlanet,
  isPaused,
  onTogglePause,
  showOrbits,
  onToggleOrbits,
  showLabels,
  onToggleLabels,
  planetVisibility,
  onTogglePlanetVisibility,
}: SolarSystemControlsProps) => {
  const [expanded, setExpanded] = useState(true);
  const [showPlanetList, setShowPlanetList] = useState(false);

  return (
    <Card className="glass-panel border-border/50 absolute top-4 right-4 w-72 z-20">
      <div 
        className="flex items-center justify-between p-3 cursor-pointer hover:bg-secondary/20 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2">
          <Settings2 className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">Controls</span>
        </div>
        {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </div>
      
      {expanded && (
        <CardContent className="p-3 pt-0 space-y-4">
          {/* Play/Pause & Reset */}
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={isPaused ? 'default' : 'outline'}
              className="flex-1"
              onClick={onTogglePause}
            >
              {isPaused ? <Play className="h-4 w-4 mr-1" /> : <Pause className="h-4 w-4 mr-1" />}
              {isPaused ? 'Play' : 'Pause'}
            </Button>
            <Button 
              size="sm" 
              variant="outline"
              onClick={() => {
                onOrbitSpeedChange(1);
                onZoomChange(15);
                onSelectPlanet(null);
              }}
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Orbit Speed */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Orbit Speed</Label>
              <Badge variant="secondary" className="text-xs">{orbitSpeed.toFixed(1)}x</Badge>
            </div>
            <Slider
              value={[orbitSpeed]}
              onValueChange={([val]) => onOrbitSpeedChange(val)}
              min={0.1}
              max={5}
              step={0.1}
              className="w-full"
            />
          </div>

          {/* Zoom */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs">Zoom Level</Label>
              <Badge variant="secondary" className="text-xs">{zoom.toFixed(0)}x</Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onZoomChange(Math.min(50, zoom + 5))}>
                <ZoomIn className="h-3 w-3" />
              </Button>
              <Slider
                value={[zoom]}
                onValueChange={([val]) => onZoomChange(val)}
                min={5}
                max={50}
                step={1}
                className="flex-1"
              />
              <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => onZoomChange(Math.max(5, zoom - 5))}>
                <ZoomOut className="h-3 w-3" />
              </Button>
            </div>
          </div>

          {/* Display Options */}
          <div className="space-y-3">
            <Label className="text-xs font-medium">Display Options</Label>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {showOrbits ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  <span className="text-xs">Show Orbits</span>
                </div>
                <Switch checked={showOrbits} onCheckedChange={onToggleOrbits} />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {showLabels ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  <span className="text-xs">Show Labels</span>
                </div>
                <Switch checked={showLabels} onCheckedChange={onToggleLabels} />
              </div>
            </div>
          </div>

          {/* Planet Selection */}
          <div className="space-y-2">
            <div 
              className="flex items-center justify-between cursor-pointer"
              onClick={() => setShowPlanetList(!showPlanetList)}
            >
              <Label className="text-xs font-medium cursor-pointer">Planet Selection</Label>
              {showPlanetList ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </div>
            
            {showPlanetList && (
              <ScrollArea className="h-40">
                <div className="space-y-1.5 pr-2">
                  {PLANETS.map((planet) => (
                    <div 
                      key={planet.name}
                      className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                        selectedPlanet === planet.name 
                          ? 'bg-primary/20 border border-primary/50' 
                          : 'bg-secondary/20 hover:bg-secondary/40 border border-transparent'
                      }`}
                      onClick={() => onSelectPlanet(selectedPlanet === planet.name ? null : planet.name)}
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: planet.color }}
                        />
                        <span className="text-xs font-medium">{planet.name}</span>
                        <Badge variant="outline" className="text-[10px] py-0 h-4">
                          {planet.type}
                        </Badge>
                      </div>
                      <Switch
                        checked={planetVisibility[planet.name] !== false}
                        onCheckedChange={() => onTogglePlanetVisibility(planet.name)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>

          {/* Selected Planet Info */}
          {selectedPlanet && (
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/30">
              <div className="flex items-center gap-2 mb-1">
                <Globe className="h-3 w-3 text-primary" />
                <span className="text-xs font-medium">Selected: {selectedPlanet}</span>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Camera will focus on {selectedPlanet}. Click again to deselect.
              </p>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
};
