import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Sidebar } from '@/components/layout/Sidebar';
import { Footer } from '@/components/layout/Footer';
import { EarthScene } from '@/components/space/EarthScene';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { AsteroidPanel } from '@/components/dashboard/AsteroidPanel';
import { SatelliteList } from '@/components/dashboard/SatelliteList';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { MissionClock } from '@/components/dashboard/MissionClock';
import { SolarWeatherPanel } from '@/components/dashboard/SolarWeatherPanel';
import { CollisionPredictionPanel } from '@/components/dashboard/CollisionPredictionPanel';
import { useWorldSatellites } from '@/hooks/useWorldSatellites';
import { useAsteroidData } from '@/hooks/useAsteroidData';
import { 
  Satellite, 
  Globe, 
  AlertTriangle, 
  Shield 
} from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { satellites, isLoading: satellitesLoading, stats: satelliteStats } = useWorldSatellites();
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
              value={stats.debris?.total || 98}
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
            {/* AI Collision Prediction */}
            <div className="h-[450px]">
              <CollisionPredictionPanel satellites={satellites} />
            </div>

            {/* Solar Weather */}
            <div className="h-[450px]">
              <SolarWeatherPanel />
            </div>
          </div>

          {/* Third Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Asteroid Panel */}
            <div className="h-[400px]">
              <AsteroidPanel />
            </div>

            {/* Satellite List */}
            <div className="h-[400px]">
              <SatelliteList satellites={satellites.slice(0, 50)} isLoading={satellitesLoading} />
            </div>
          </div>

          <Footer />
        </main>
      </div>
    </div>
  );
};

export default Index;
