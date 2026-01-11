import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Rocket, Calendar, MapPin, Target } from 'lucide-react';

interface Mission {
  id: string;
  name: string;
  agency: string;
  status: 'active' | 'completed' | 'planned' | 'en-route';
  launchDate: string;
  destination: string;
  type: 'crewed' | 'robotic' | 'satellite' | 'probe';
  description: string;
}

const ACTIVE_MISSIONS: Mission[] = [
  {
    id: '1',
    name: 'Artemis III',
    agency: 'NASA',
    status: 'planned',
    launchDate: '2026',
    destination: 'Moon (South Pole)',
    type: 'crewed',
    description: 'First crewed lunar landing since Apollo 17'
  },
  {
    id: '2',
    name: 'Mars Sample Return',
    agency: 'NASA/ESA',
    status: 'planned',
    launchDate: '2028',
    destination: 'Mars',
    type: 'robotic',
    description: 'Retrieve samples collected by Perseverance rover'
  },
  {
    id: '3',
    name: 'Europa Clipper',
    agency: 'NASA',
    status: 'en-route',
    launchDate: '2024',
    destination: 'Europa (Jupiter Moon)',
    type: 'probe',
    description: 'Study Europa\'s ice shell and subsurface ocean'
  },
  {
    id: '4',
    name: 'Chandrayaan-4',
    agency: 'ISRO',
    status: 'planned',
    launchDate: '2027',
    destination: 'Moon',
    type: 'robotic',
    description: 'Lunar sample return mission'
  },
  {
    id: '5',
    name: 'Gaganyaan',
    agency: 'ISRO',
    status: 'planned',
    launchDate: '2025',
    destination: 'LEO',
    type: 'crewed',
    description: 'India\'s first crewed spaceflight'
  },
  {
    id: '6',
    name: 'James Webb ST',
    agency: 'NASA/ESA/CSA',
    status: 'active',
    launchDate: '2021',
    destination: 'L2 Point',
    type: 'probe',
    description: 'Deep space infrared observatory'
  },
  {
    id: '7',
    name: 'Voyager 1 & 2',
    agency: 'NASA',
    status: 'active',
    launchDate: '1977',
    destination: 'Interstellar Space',
    type: 'probe',
    description: 'First spacecraft to enter interstellar space'
  },
  {
    id: '8',
    name: 'Parker Solar Probe',
    agency: 'NASA',
    status: 'active',
    launchDate: '2018',
    destination: 'Sun',
    type: 'probe',
    description: 'Closest approach to the Sun ever'
  },
  {
    id: '9',
    name: 'JUICE',
    agency: 'ESA',
    status: 'en-route',
    launchDate: '2023',
    destination: 'Jupiter Moons',
    type: 'probe',
    description: 'Study Ganymede, Callisto, and Europa'
  },
  {
    id: '10',
    name: 'Psyche',
    agency: 'NASA',
    status: 'en-route',
    launchDate: '2023',
    destination: 'Asteroid 16 Psyche',
    type: 'probe',
    description: 'Study metallic asteroid in asteroid belt'
  },
];

export const SpaceMissionsPanel = () => {
  const statusColors = {
    active: 'bg-success/20 text-success border-success/30',
    completed: 'bg-primary/20 text-primary border-primary/30',
    planned: 'bg-warning/20 text-warning border-warning/30',
    'en-route': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  };

  const typeIcons = {
    crewed: '👨‍🚀',
    robotic: '🤖',
    satellite: '🛰️',
    probe: '🔭',
  };

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <Rocket className="h-5 w-5 text-primary" />
          Space Missions
          <Badge variant="secondary" className="ml-auto">
            {ACTIVE_MISSIONS.filter(m => m.status === 'active').length} Active
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[320px] pr-3">
          <div className="space-y-3">
            {ACTIVE_MISSIONS.map((mission) => (
              <div 
                key={mission.id}
                className="p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-all border border-border/30 hover:border-primary/30"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{typeIcons[mission.type]}</span>
                    <div>
                      <span className="font-medium block">{mission.name}</span>
                      <span className="text-xs text-muted-foreground">{mission.agency}</span>
                    </div>
                  </div>
                  <Badge className={statusColors[mission.status]}>
                    {mission.status}
                  </Badge>
                </div>
                
                <p className="text-xs text-muted-foreground mb-2">
                  {mission.description}
                </p>

                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {mission.launchDate}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Target className="h-3 w-3" />
                    {mission.destination}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
