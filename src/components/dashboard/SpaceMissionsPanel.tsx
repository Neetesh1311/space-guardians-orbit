import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Rocket, Calendar, MapPin, Target, Users, Clock } from 'lucide-react';

interface Mission {
  id: string;
  name: string;
  agency: string;
  status: 'active' | 'completed' | 'planned' | 'en-route';
  launchDate: string;
  destination: string;
  type: 'crewed' | 'robotic' | 'satellite' | 'probe';
  description: string;
  rocket?: string;
  launchSite?: string;
}

// Comprehensive ISRO and International Missions
const ACTIVE_MISSIONS: Mission[] = [
  // ISRO Missions
  {
    id: 'gaganyaan-g1',
    name: 'Gaganyaan-1 (Uncrewed)',
    agency: 'ISRO',
    status: 'planned',
    launchDate: '2024-Q4',
    destination: 'LEO (400 km)',
    type: 'robotic',
    description: 'First uncrewed test flight of India\'s human spaceflight program with Vyommitra humanoid robot',
    rocket: 'LVM3 (GSLV Mk III)',
    launchSite: 'Satish Dhawan Space Centre, Sriharikota',
  },
  {
    id: 'gaganyaan-g2',
    name: 'Gaganyaan-2 (Crewed)',
    agency: 'ISRO',
    status: 'planned',
    launchDate: '2025',
    destination: 'LEO (400 km)',
    type: 'crewed',
    description: 'India\'s first crewed spaceflight mission carrying 3 Gaganauts for 3-day mission',
    rocket: 'LVM3 Human-Rated',
    launchSite: 'Satish Dhawan Space Centre',
  },
  {
    id: 'chandrayaan-4',
    name: 'Chandrayaan-4 (Sample Return)',
    agency: 'ISRO',
    status: 'planned',
    launchDate: '2027',
    destination: 'Moon (South Pole)',
    type: 'robotic',
    description: 'Lunar sample return mission - collecting and returning regolith samples to Earth',
    rocket: 'LVM3 + PSLV',
    launchSite: 'Satish Dhawan Space Centre',
  },
  {
    id: 'shukrayaan-1',
    name: 'Shukrayaan-1 (Venus Orbiter)',
    agency: 'ISRO',
    status: 'planned',
    launchDate: '2028',
    destination: 'Venus',
    type: 'probe',
    description: 'India\'s first Venus mission to study atmosphere, surface, and solar wind interaction',
    rocket: 'GSLV Mk II',
    launchSite: 'Satish Dhawan Space Centre',
  },
  {
    id: 'mangalyaan-2',
    name: 'Mars Orbiter Mission 2',
    agency: 'ISRO',
    status: 'planned',
    launchDate: '2026',
    destination: 'Mars',
    type: 'probe',
    description: 'Follow-up to MOM with orbiter and lander, studying Martian atmosphere and surface',
    rocket: 'LVM3',
    launchSite: 'Satish Dhawan Space Centre',
  },
  {
    id: 'aditya-l1',
    name: 'Aditya-L1',
    agency: 'ISRO',
    status: 'active',
    launchDate: '2023-09-02',
    destination: 'Sun-Earth L1 Point',
    type: 'probe',
    description: 'India\'s first solar observatory at L1 Lagrange point studying solar corona and space weather',
    rocket: 'PSLV-XL C57',
    launchSite: 'Satish Dhawan Space Centre',
  },
  {
    id: 'xposat',
    name: 'XPoSat',
    agency: 'ISRO',
    status: 'active',
    launchDate: '2024-01-01',
    destination: 'LEO (650 km)',
    type: 'satellite',
    description: 'X-ray Polarimeter Satellite studying polarization of cosmic X-ray sources',
    rocket: 'PSLV-C58',
    launchSite: 'Satish Dhawan Space Centre',
  },
  {
    id: 'insat-3ds',
    name: 'INSAT-3DS',
    agency: 'ISRO',
    status: 'active',
    launchDate: '2024-02-17',
    destination: 'GEO',
    type: 'satellite',
    description: 'Advanced meteorological satellite for weather monitoring and disaster warning',
    rocket: 'GSLV-F14',
    launchSite: 'Satish Dhawan Space Centre',
  },
  {
    id: 'nisar',
    name: 'NISAR (NASA-ISRO SAR)',
    agency: 'ISRO/NASA',
    status: 'planned',
    launchDate: '2024',
    destination: 'LEO (747 km)',
    type: 'satellite',
    description: 'Joint NASA-ISRO mission with dual-frequency SAR for Earth observation',
    rocket: 'GSLV Mk II',
    launchSite: 'Satish Dhawan Space Centre',
  },
  {
    id: 'spadex',
    name: 'SPADEX (Docking Experiment)',
    agency: 'ISRO',
    status: 'planned',
    launchDate: '2024',
    destination: 'LEO',
    type: 'robotic',
    description: 'Space Docking Experiment demonstrating autonomous docking capability for future missions',
    rocket: 'PSLV',
    launchSite: 'Satish Dhawan Space Centre',
  },
  // International Missions
  {
    id: 'artemis-3',
    name: 'Artemis III',
    agency: 'NASA',
    status: 'planned',
    launchDate: '2025-09',
    destination: 'Moon (South Pole)',
    type: 'crewed',
    description: 'First crewed lunar landing since Apollo 17, including first woman on Moon',
    rocket: 'SLS + Starship HLS',
    launchSite: 'Kennedy Space Center',
  },
  {
    id: 'europa-clipper',
    name: 'Europa Clipper',
    agency: 'NASA',
    status: 'en-route',
    launchDate: '2024-10-14',
    destination: 'Jupiter\'s Moon Europa',
    type: 'probe',
    description: 'Investigating Europa\'s subsurface ocean and potential for life',
    rocket: 'Falcon Heavy',
    launchSite: 'Kennedy Space Center',
  },
  {
    id: 'juice',
    name: 'JUICE',
    agency: 'ESA',
    status: 'en-route',
    launchDate: '2023-04-14',
    destination: 'Jupiter System',
    type: 'probe',
    description: 'Jupiter Icy Moons Explorer studying Ganymede, Callisto, and Europa',
    rocket: 'Ariane 5',
    launchSite: 'Kourou, French Guiana',
  },
  {
    id: 'jwst',
    name: 'James Webb ST',
    agency: 'NASA/ESA/CSA',
    status: 'active',
    launchDate: '2021-12-25',
    destination: 'L2 Point',
    type: 'probe',
    description: 'Largest space telescope observing in infrared, studying early universe',
    rocket: 'Ariane 5',
    launchSite: 'Kourou, French Guiana',
  },
  {
    id: 'voyager-1',
    name: 'Voyager 1',
    agency: 'NASA',
    status: 'active',
    launchDate: '1977-09-05',
    destination: 'Interstellar Space',
    type: 'probe',
    description: 'First human-made object to enter interstellar space, 24+ billion km from Earth',
    rocket: 'Titan IIIE',
    launchSite: 'Cape Canaveral',
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
    crewed: Users,
    robotic: Rocket,
    satellite: Target,
    probe: Clock,
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
        <ScrollArea className="h-[400px] pr-3">
          <div className="space-y-3">
            {ACTIVE_MISSIONS.map((mission) => {
              const TypeIcon = typeIcons[mission.type];
              return (
                <div 
                  key={mission.id}
                  className="p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-all border border-border/30 hover:border-primary/30"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <TypeIcon className="h-4 w-4 text-primary" />
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

                  {mission.rocket && (
                    <div className="mt-2 pt-2 border-t border-border/30">
                      <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                        <span>Rocket: {mission.rocket}</span>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
