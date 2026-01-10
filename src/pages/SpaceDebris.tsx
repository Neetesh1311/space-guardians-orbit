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
import { Progress } from '@/components/ui/progress';
import { 
  Search, 
  Trash2,
  AlertTriangle,
  Gauge,
  Globe2,
  Filter,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

const SpaceDebris = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRisk, setSelectedRisk] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const { spaceDebris, stats } = useWorldSatellites();

  const filteredDebris = useMemo(() => {
    return spaceDebris.filter(debris => {
      const matchesSearch = debris.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           debris.origin.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRisk = selectedRisk === 'all' || debris.riskLevel === selectedRisk;
      const matchesSize = selectedSize === 'all' || debris.size === selectedSize;
      
      return matchesSearch && matchesRisk && matchesSize;
    });
  }, [spaceDebris, searchQuery, selectedRisk, selectedSize]);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-success/20 text-success border-success/30';
      case 'medium': return 'bg-warning/20 text-warning border-warning/30';
      case 'high': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getSizeColor = (size: string) => {
    switch (size) {
      case 'small': return 'bg-primary/20 text-primary';
      case 'medium': return 'bg-accent/20 text-accent';
      case 'large': return 'bg-warning/20 text-warning';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalDebris = stats.debris.total;
  const highRiskPercent = (stats.debris.high / totalDebris) * 100;
  const mediumRiskPercent = (stats.debris.medium / totalDebris) * 100;

  return (
    <div className="min-h-screen bg-background stars-bg">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-3">
              <Trash2 className="h-8 w-8 text-destructive" />
              Space Debris Tracker
            </h1>
            <p className="text-muted-foreground mt-1">
              Monitoring {totalDebris} tracked debris objects in Earth orbit
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="glass-panel">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Total Tracked</span>
                  <Trash2 className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-3xl font-bold text-primary">{totalDebris}</p>
                <p className="text-xs text-muted-foreground mt-1">Objects &gt; 10cm</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">High Risk</span>
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <p className="text-3xl font-bold text-destructive">{stats.debris.high}</p>
                <Progress value={highRiskPercent} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-1">{highRiskPercent.toFixed(1)}% of total</p>
              </CardContent>
            </Card>
            
            <Card className="glass-panel">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Medium Risk</span>
                  <AlertTriangle className="h-5 w-5 text-warning" />
                </div>
                <p className="text-3xl font-bold text-warning">{stats.debris.medium}</p>
                <Progress value={mediumRiskPercent} className="mt-2 h-2" />
                <p className="text-xs text-muted-foreground mt-1">{mediumRiskPercent.toFixed(1)}% of total</p>
              </CardContent>
            </Card>
          </div>

          {/* Info Banner */}
          <Card className="glass-panel mb-6 border-warning/30 bg-warning/5">
            <CardContent className="p-4 flex items-start gap-3">
              <Info className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">About Space Debris</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Space debris, also known as space junk, includes defunct satellites, spent rocket stages, 
                  and fragments from collisions. Even small debris traveling at 7+ km/s can cause catastrophic 
                  damage to operational satellites and the ISS. Major debris events include the 2007 Chinese 
                  ASAT test and the 2009 Cosmos-Iridium collision.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Filters */}
          <Card className="glass-panel mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search debris by name or origin..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 bg-secondary/50"
                  />
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  <div className="flex items-center gap-1">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">Risk:</span>
                  </div>
                  {['all', 'high', 'medium', 'low'].map((risk) => (
                    <Button
                      key={risk}
                      variant={selectedRisk === risk ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedRisk(risk)}
                      className="text-xs relative z-10"
                    >
                      {risk.charAt(0).toUpperCase() + risk.slice(1)}
                    </Button>
                  ))}
                </div>

                <div className="flex gap-2 flex-wrap">
                  <span className="text-xs text-muted-foreground flex items-center">Size:</span>
                  {['all', 'large', 'medium', 'small'].map((size) => (
                    <Button
                      key={size}
                      variant={selectedSize === size ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className="text-xs relative z-10"
                    >
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          <Card className="glass-panel">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">
                Tracked Objects ({filteredDebris.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredDebris.map((debris) => (
                    <Card 
                      key={debris.id} 
                      className={cn(
                        "bg-secondary/30 border-border/50",
                        debris.riskLevel === 'high' && 'border-l-4 border-l-destructive'
                      )}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <h3 className="font-semibold text-foreground text-sm truncate">{debris.name}</h3>
                            <p className="text-[10px] text-muted-foreground truncate">{debris.origin}</p>
                            <div className="flex gap-2 mt-2">
                              <Badge className={cn("text-[10px]", getSizeColor(debris.size))}>
                                {debris.size}
                              </Badge>
                              <Badge className={cn("text-[10px]", getRiskColor(debris.riskLevel))}>
                                {debris.riskLevel} risk
                              </Badge>
                            </div>
                          </div>
                          <Trash2 className={cn(
                            "h-4 w-4",
                            debris.riskLevel === 'high' ? 'text-destructive' : 
                            debris.riskLevel === 'medium' ? 'text-warning' : 'text-muted-foreground'
                          )} />
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Globe2 className="h-3 w-3" /> Altitude
                            </span>
                            <span className="font-mono text-foreground">{debris.altitude.toFixed(0)} km</span>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-muted-foreground flex items-center gap-1">
                              <Gauge className="h-3 w-3" /> Velocity
                            </span>
                            <span className="font-mono text-foreground">{debris.velocity.toFixed(2)} km/s</span>
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

export default SpaceDebris;
