import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Users, MapPin, Clock, Zap, Thermometer } from 'lucide-react';

interface ISSData {
  latitude: number;
  longitude: number;
  altitude: number;
  velocity: number;
  timestamp: Date;
}

interface CrewMember {
  name: string;
  nationality: string;
  role: string;
  mission: string;
}

const ISS_CREW: CrewMember[] = [
  { name: 'Oleg Kononenko', nationality: '🇷🇺', role: 'Commander', mission: 'Exp 71' },
  { name: 'Nikolai Chub', nationality: '🇷🇺', role: 'Flight Engineer', mission: 'Exp 71' },
  { name: 'Tracy Dyson', nationality: '🇺🇸', role: 'Flight Engineer', mission: 'Exp 71' },
  { name: 'Matthew Dominick', nationality: '🇺🇸', role: 'Flight Engineer', mission: 'Crew-8' },
  { name: 'Michael Barratt', nationality: '🇺🇸', role: 'Flight Engineer', mission: 'Crew-8' },
  { name: 'Jeanette Epps', nationality: '🇺🇸', role: 'Flight Engineer', mission: 'Crew-8' },
  { name: 'Alexander Grebenkin', nationality: '🇷🇺', role: 'Flight Engineer', mission: 'Crew-8' },
];

export const ISSTrackerPanel = () => {
  const [issData, setIssData] = useState<ISSData>({
    latitude: 0,
    longitude: 0,
    altitude: 420,
    velocity: 27600,
    timestamp: new Date(),
  });

  const [orbitProgress, setOrbitProgress] = useState(0);

  // Simulate ISS position updates
  useEffect(() => {
    const interval = setInterval(() => {
      setIssData(prev => ({
        ...prev,
        latitude: (prev.latitude + 0.5) % 180 - 90,
        longitude: (prev.longitude + 1.5) % 360 - 180,
        altitude: 408 + Math.random() * 12,
        velocity: 27550 + Math.random() * 100,
        timestamp: new Date(),
      }));
      setOrbitProgress(prev => (prev + 1) % 100);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const formatCoord = (val: number, isLat: boolean) => {
    const dir = isLat 
      ? (val >= 0 ? 'N' : 'S')
      : (val >= 0 ? 'E' : 'W');
    return `${Math.abs(val).toFixed(2)}° ${dir}`;
  };

  const getLocationName = (lat: number, lon: number) => {
    // Simplified location detection
    if (lat > 60) return 'Northern Polar Region';
    if (lat < -60) return 'Southern Polar Region';
    if (lon > -30 && lon < 60 && lat > 0 && lat < 60) return 'Over Europe';
    if (lon > 60 && lon < 150 && lat > 0) return 'Over Asia';
    if (lon > -170 && lon < -30 && lat > 0 && lat < 60) return 'Over North America';
    if (lon > -80 && lon < -30 && lat < 0) return 'Over South America';
    if (lon > 10 && lon < 55 && lat < 0) return 'Over Africa';
    if (lon > 100 && lon < 180 && lat < 0) return 'Over Australia/Oceania';
    if (lon > 60 && lon < 100 && lat > 0 && lat < 40) return 'Over India';
    return 'Over Pacific Ocean';
  };

  return (
    <Card variant="glass" className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <div className="relative">
            <div className="w-5 h-5 bg-primary rounded-full animate-pulse" />
            <div className="absolute inset-0 w-5 h-5 bg-primary/50 rounded-full animate-ping" />
          </div>
          ISS Live Tracker
          <Badge variant="outline" className="ml-auto bg-success/20 text-success">
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Position Data */}
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <MapPin className="h-3 w-3" />
              Position
            </div>
            <div className="font-mono text-sm">
              {formatCoord(issData.latitude, true)}
            </div>
            <div className="font-mono text-sm">
              {formatCoord(issData.longitude, false)}
            </div>
          </div>
          
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
              <Zap className="h-3 w-3" />
              Speed
            </div>
            <div className="font-mono text-lg font-bold text-primary">
              {issData.velocity.toFixed(0)}
            </div>
            <div className="text-xs text-muted-foreground">km/h</div>
          </div>
        </div>

        {/* Altitude & Location */}
        <div className="p-3 rounded-lg bg-secondary/20 border border-border/30">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Current Location</span>
            <Badge variant="secondary">{getLocationName(issData.latitude, issData.longitude)}</Badge>
          </div>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Altitude: {issData.altitude.toFixed(1)} km</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {issData.timestamp.toLocaleTimeString()}
            </span>
          </div>
        </div>

        {/* Orbit Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Orbit Progress</span>
            <span className="font-mono">{orbitProgress}%</span>
          </div>
          <Progress value={orbitProgress} className="h-2" />
          <div className="text-xs text-muted-foreground text-center">
            Completes orbit every ~92 minutes
          </div>
        </div>

        {/* Crew */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Crew ({ISS_CREW.length})</span>
          </div>
          <div className="grid grid-cols-2 gap-1">
            {ISS_CREW.slice(0, 4).map((member, i) => (
              <div key={i} className="flex items-center gap-1 text-xs p-1 rounded bg-secondary/20">
                <span>{member.nationality}</span>
                <span className="truncate">{member.name.split(' ')[1]}</span>
              </div>
            ))}
          </div>
          {ISS_CREW.length > 4 && (
            <div className="text-xs text-muted-foreground text-center mt-1">
              +{ISS_CREW.length - 4} more crew members
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
