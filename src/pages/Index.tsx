import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { EarthScene } from '@/components/space/EarthScene';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AsteroidPanel } from '@/components/dashboard/AsteroidPanel';
import { SatelliteList } from '@/components/dashboard/SatelliteList';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { MissionClock } from '@/components/dashboard/MissionClock';
import { useSatelliteData } from '@/hooks/useSatelliteData';
import { useAsteroidData } from '@/hooks/useAsteroidData';
import { 
  Satellite, 
  Globe, 
  AlertTriangle, 
  Shield 
} from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { satellites, isLoading: satellitesLoading, stats: satelliteStats } = useSatelliteData();
  const { data: asteroids } = useAsteroidData();

  const hazardousAsteroids = asteroids?.filter(a => a.isPotentiallyHazardous).length || 0;

  return (
    <div className="min-h-screen bg-background stars-bg">
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden">
          {/* Mission Clock */}
          <div className="mb-6">
            <MissionClock />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatsCard
              title="Active Satellites"
              value={satelliteStats.total}
              subtitle={`${satelliteStats.byOrbit.LEO} LEO • ${satelliteStats.byOrbit.GEO} GEO`}
              icon={Satellite}
              variant="glow"
            />
            <StatsCard
              title="Tracked Debris"
              value="23,847"
              subtitle="Objects > 10cm"
              icon={Globe}
            />
            <StatsCard
              title="NEO Detected"
              value={asteroids?.length || 0}
              subtitle={`${hazardousAsteroids} hazardous`}
              icon={AlertTriangle}
              variant={hazardousAsteroids > 0 ? 'warning' : 'default'}
            />
            <StatsCard
              title="Risk Score"
              value={satelliteStats.critical > 0 ? 'HIGH' : 'LOW'}
              subtitle={`${satelliteStats.critical} critical alerts`}
              icon={Shield}
              variant={satelliteStats.critical > 0 ? 'critical' : 'success'}
            />
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* 3D Earth View - Takes 2 columns */}
            <div className="lg:col-span-2 h-[500px] md:h-[600px] rounded-xl overflow-hidden border border-border/50 bg-card/30 backdrop-blur relative">
              <EarthScene satellites={satellites} />
              
              {/* Overlay Controls */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="glass-panel px-3 py-2 text-xs space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success" />
                    <span className="text-muted-foreground">Safe: {satelliteStats.safe}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-warning" />
                    <span className="text-muted-foreground">Warning: {satelliteStats.warning}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-destructive" />
                    <span className="text-muted-foreground">Critical: {satelliteStats.critical}</span>
                  </div>
                </div>
                
                <div className="glass-panel px-3 py-2">
                  <p className="text-[10px] text-muted-foreground uppercase">Drag to rotate • Scroll to zoom</p>
                </div>
              </div>
            </div>

            {/* Alerts Panel */}
            <div className="h-[500px] md:h-[600px]">
              <AlertsPanel />
            </div>
          </div>

          {/* Secondary Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Asteroid Panel */}
            <div className="h-[400px]">
              <AsteroidPanel />
            </div>

            {/* Satellite List */}
            <div className="h-[400px]">
              <SatelliteList satellites={satellites} isLoading={satellitesLoading} />
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-8 pt-6 border-t border-border/50 text-center text-xs text-muted-foreground">
            <p className="mb-2">
              <span className="font-semibold text-foreground">SpaceShield</span> — Ultimate Space Traffic & Satellite Protection System
            </p>
            <p>
              Developed by <span className="text-primary">Neetesh Kumar</span> • 
              <a href="mailto:neeteshk1104@gmail.com" className="hover:text-primary transition-colors ml-1">neeteshk1104@gmail.com</a> • 
              <a href="https://github.com/neetesh1541" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors ml-1">GitHub</a> • 
              <a href="https://in.linkedin.com/in/neetesh-kumar-846616287" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors ml-1">LinkedIn</a>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
};

export default Index;
