import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { useWorldSatellites } from '@/hooks/useWorldSatellites';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  Satellite, 
  Globe2, 
  Signal, 
  Gauge, 
  MapPin,
  Filter,
  RefreshCw,
  Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';

const Satellites = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrbit, setSelectedOrbit] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');
  const { satellites, stats, isLoading } = useWorldSatellites();

  const filteredSatellites = useMemo(() => {
    return satellites.filter(sat => {
      const matchesSearch = sat.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesOrbit = selectedOrbit === 'all' || sat.orbitType === selectedOrbit;
      
      let matchesCountry = selectedCountry === 'all';
      if (selectedCountry === 'india') {
        matchesCountry = ['GSAT', 'INSAT', 'Cartosat', 'RISAT', 'IRNSS', 'AstroSat', 'Chandrayaan', 'Aditya', 'EOS', 'Oceansat', 'RESOURCESAT', 'XPoSat', 'Mars Orbiter', 'ScatSat'].some(n => sat.name.includes(n));
      } else if (selectedCountry === 'usa') {
        matchesCountry = ['GPS', 'Starlink', 'GOES', 'NOAA', 'Landsat', 'Hubble', 'JWST', 'USA', 'Iridium', 'OneWeb', 'ViaSat', 'Intelsat'].some(n => sat.name.includes(n));
      } else if (selectedCountry === 'china') {
        matchesCountry = ['BeiDou', 'Tiangong', 'Fengyun'].some(n => sat.name.includes(n));
      } else if (selectedCountry === 'russia') {
        matchesCountry = ['GLONASS', 'Cosmos'].some(n => sat.name.includes(n));
      } else if (selectedCountry === 'europe') {
        matchesCountry = ['Galileo', 'Sentinel', 'Meteosat', 'Eutelsat'].some(n => sat.name.includes(n));
      }
      
      return matchesSearch && matchesOrbit && matchesCountry;
    });
  }, [satellites, searchQuery, selectedOrbit, selectedCountry]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'safe': return 'bg-success/20 text-success border-success/30';
      case 'warning': return 'bg-warning/20 text-warning border-warning/30';
      case 'critical': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getOrbitColor = (orbit: string) => {
    switch (orbit) {
      case 'LEO': return 'bg-primary/20 text-primary';
      case 'MEO': return 'bg-accent/20 text-accent';
      case 'GEO': return 'bg-warning/20 text-warning';
      case 'HEO': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background stars-bg">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <Satellite className="h-8 w-8 text-primary" />
              Satellites Database
            </h1>
            <p className="text-muted-foreground mt-1">
              Track {stats.total} satellites worldwide in real-time including {stats.byType.indian} Indian satellites
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
            <Card className="glass-panel">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{stats.total}</p>
                <p className="text-xs text-muted-foreground">Total</p>
              </CardContent>
            </Card>
            <Card className="glass-panel">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-success">{stats.byOrbit.LEO}</p>
                <p className="text-xs text-muted-foreground">LEO</p>
              </CardContent>
            </Card>
            <Card className="glass-panel">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-accent">{stats.byOrbit.MEO}</p>
                <p className="text-xs text-muted-foreground">MEO</p>
              </CardContent>
            </Card>
            <Card className="glass-panel">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-warning">{stats.byOrbit.GEO}</p>
                <p className="text-xs text-muted-foreground">GEO</p>
              </CardContent>
            </Card>
            <Card className="glass-panel">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-destructive">{stats.byOrbit.HEO}</p>
                <p className="text-xs text-muted-foreground">HEO</p>
              </CardContent>
            </Card>
            <Card className="glass-panel border-primary/30">
              <CardContent className="p-4 text-center">
                <p className="text-2xl font-bold text-primary">{stats.byType.indian}</p>
                <p className="text-xs text-muted-foreground">🇮🇳 Indian</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="glass-panel mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search satellites..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary/50"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Orbit:</span>
                  </div>
                  {['all', 'LEO', 'MEO', 'GEO', 'HEO'].map((orbit) => (
                    <Button
                      key={orbit}
                      variant={selectedOrbit === orbit ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedOrbit(orbit)}
                      className="text-xs relative z-10"
                    >
                      {orbit === 'all' ? 'All' : orbit}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Flag className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Country:</span>
                  </div>
                  {[
                    { value: 'all', label: 'All' },
                    { value: 'india', label: '🇮🇳 India' },
                    { value: 'usa', label: '🇺🇸 USA' },
                    { value: 'china', label: '🇨🇳 China' },
                    { value: 'russia', label: '🇷🇺 Russia' },
                    { value: 'europe', label: '🇪🇺 Europe' },
                  ].map((country) => (
                    <Button
                      key={country.value}
                      variant={selectedCountry === country.value ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCountry(country.value)}
                      className="text-xs relative z-10"
                    >
                      {country.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Results ({filteredSatellites.length})</span>
                <RefreshCw className={cn("h-4 w-4 text-muted-foreground", isLoading && "animate-spin")} />
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredSatellites.map((sat) => (
                    <Card 
                      key={sat.id} 
                      className={cn(
                        "bg-secondary/30 border-border/50 hover:border-primary/50 transition-all duration-300",
                        sat.name.includes('GSAT') || sat.name.includes('INSAT') || sat.name.includes('IRNSS') || sat.name.includes('Cartosat') || sat.name.includes('AstroSat') || sat.name.includes('Chandrayaan') || sat.name.includes('Aditya') ? 'border-l-4 border-l-orange-500' : ''
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground truncate">{sat.name}</h3>
                            <div className="flex gap-2 mt-1">
                              <Badge className={cn("text-[10px]", getOrbitColor(sat.orbitType))}>
                                {sat.orbitType}
                              </Badge>
                              <Badge className={cn("text-[10px]", getRiskColor(sat.riskLevel))}>
                                {sat.riskLevel}
                              </Badge>
                            </div>
                          </div>
                          <Satellite className="h-5 w-5 text-primary animate-pulse" />
                        </div>
                        
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Globe2 className="h-3 w-3" /> Altitude
                            </span>
                            <span className="font-mono text-foreground">{sat.altitude.toLocaleString()} km</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Signal className="h-3 w-3" /> Inclination
                            </span>
                            <span className="font-mono text-foreground">{sat.inclination.toFixed(1)}°</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Gauge className="h-3 w-3" /> Velocity
                            </span>
                            <span className="font-mono text-foreground">{sat.velocity.toFixed(2)} km/s</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> Position
                            </span>
                            <span className="font-mono text-foreground text-[10px]">
                              ({sat.position.x.toFixed(2)}, {sat.position.y.toFixed(2)}, {sat.position.z.toFixed(2)})
                            </span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Satellites;
