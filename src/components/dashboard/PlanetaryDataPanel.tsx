import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Circle, Orbit } from 'lucide-react';

interface PlanetData {
  name: string;
  type: 'terrestrial' | 'gas_giant' | 'ice_giant' | 'dwarf';
  distance: string;
  diameter: string;
  moons: number;
  dayLength: string;
  yearLength: string;
  temperature: string;
  color: string;
  facts: string[];
}

const PLANETS: PlanetData[] = [
  {
    name: 'Mercury',
    type: 'terrestrial',
    distance: '57.9M km',
    diameter: '4,879 km',
    moons: 0,
    dayLength: '59 Earth days',
    yearLength: '88 Earth days',
    temperature: '-180°C to 430°C',
    color: '#b5b5b5',
    facts: ['Smallest planet', 'No atmosphere', 'Fastest orbit']
  },
  {
    name: 'Venus',
    type: 'terrestrial',
    distance: '108.2M km',
    diameter: '12,104 km',
    moons: 0,
    dayLength: '243 Earth days',
    yearLength: '225 Earth days',
    temperature: '462°C',
    color: '#e6c229',
    facts: ['Hottest planet', 'Rotates backwards', 'Thick atmosphere']
  },
  {
    name: 'Earth',
    type: 'terrestrial',
    distance: '149.6M km',
    diameter: '12,742 km',
    moons: 1,
    dayLength: '24 hours',
    yearLength: '365.25 days',
    temperature: '-88°C to 58°C',
    color: '#4fc3f7',
    facts: ['Only known life', '71% water', 'Magnetic field']
  },
  {
    name: 'Mars',
    type: 'terrestrial',
    distance: '227.9M km',
    diameter: '6,779 km',
    moons: 2,
    dayLength: '24.6 hours',
    yearLength: '687 Earth days',
    temperature: '-140°C to 20°C',
    color: '#cd5c5c',
    facts: ['Largest volcano', 'Polar ice caps', 'Rovers active']
  },
  {
    name: 'Jupiter',
    type: 'gas_giant',
    distance: '778.5M km',
    diameter: '139,820 km',
    moons: 95,
    dayLength: '9.9 hours',
    yearLength: '11.9 Earth years',
    temperature: '-145°C',
    color: '#d4a574',
    facts: ['Largest planet', 'Great Red Spot', '95 known moons']
  },
  {
    name: 'Saturn',
    type: 'gas_giant',
    distance: '1.43B km',
    diameter: '116,460 km',
    moons: 146,
    dayLength: '10.7 hours',
    yearLength: '29.5 Earth years',
    temperature: '-178°C',
    color: '#f4d03f',
    facts: ['Famous rings', 'Least dense', '146 known moons']
  },
  {
    name: 'Uranus',
    type: 'ice_giant',
    distance: '2.87B km',
    diameter: '50,724 km',
    moons: 28,
    dayLength: '17.2 hours',
    yearLength: '84 Earth years',
    temperature: '-224°C',
    color: '#7fdbff',
    facts: ['Tilted axis', 'Ice giant', 'Faint rings']
  },
  {
    name: 'Neptune',
    type: 'ice_giant',
    distance: '4.5B km',
    diameter: '49,244 km',
    moons: 16,
    dayLength: '16.1 hours',
    yearLength: '165 Earth years',
    temperature: '-218°C',
    color: '#4169e1',
    facts: ['Windiest planet', 'Farthest planet', 'Triton moon']
  },
];

const MOON_DATA = {
  name: 'Moon (Luna)',
  distance: '384,400 km from Earth',
  diameter: '3,474 km',
  orbitalPeriod: '27.3 days',
  phases: ['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'],
  facts: [
    'Only natural satellite of Earth',
    'Fifth largest moon in Solar System',
    'Synchronous rotation (same face always toward Earth)',
    'First celestial body visited by humans (1969)',
    'Has water ice at poles',
  ],
};

export const PlanetaryDataPanel = () => {
  const typeColors = {
    terrestrial: 'bg-green-500/20 text-green-400',
    gas_giant: 'bg-orange-500/20 text-orange-400',
    ice_giant: 'bg-cyan-500/20 text-cyan-400',
    dwarf: 'bg-purple-500/20 text-purple-400',
  };

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Orbit className="h-5 w-5 text-primary" />
          Solar System Data
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] pr-3">
          {/* Moon Section */}
          <div className="mb-4 p-3 rounded-lg bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-2 mb-2">
              <div 
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: '#c4c4c4' }}
              />
              <span className="font-semibold">{MOON_DATA.name}</span>
              <Badge variant="outline" className="text-xs">Earth's Moon</Badge>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground mb-2">
              <span>Distance: {MOON_DATA.distance}</span>
              <span>Diameter: {MOON_DATA.diameter}</span>
              <span>Orbit: {MOON_DATA.orbitalPeriod}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {MOON_DATA.facts.slice(0, 2).map((fact, i) => (
                <Badge key={i} variant="secondary" className="text-xs">
                  {fact}
                </Badge>
              ))}
            </div>
          </div>

          {/* Planets */}
          <div className="space-y-3">
            {PLANETS.map((planet) => (
              <div 
                key={planet.name}
                className="p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors border border-border/30"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Circle 
                      className="h-4 w-4" 
                      style={{ color: planet.color, fill: planet.color }}
                    />
                    <span className="font-medium">{planet.name}</span>
                  </div>
                  <Badge className={typeColors[planet.type]}>
                    {planet.type.replace('_', ' ')}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground mb-2">
                  <span>Distance: {planet.distance}</span>
                  <span>Diameter: {planet.diameter}</span>
                  <span>Moons: {planet.moons}</span>
                  <span>Temp: {planet.temperature}</span>
                  <span>Day: {planet.dayLength}</span>
                  <span>Year: {planet.yearLength}</span>
                </div>

                <div className="flex flex-wrap gap-1">
                  {planet.facts.map((fact, i) => (
                    <Badge key={i} variant="outline" className="text-xs">
                      {fact}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
