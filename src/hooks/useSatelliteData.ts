import { useState, useEffect, useMemo } from 'react';
import type { Satellite } from '@/types/space';

// Generate mock satellite data with realistic positions
const generateMockSatellites = (): Satellite[] => {
  const satellites: Satellite[] = [];
  const orbitTypes: ('LEO' | 'MEO' | 'GEO' | 'HEO')[] = ['LEO', 'MEO', 'GEO', 'HEO'];
  const riskLevels: ('safe' | 'warning' | 'critical')[] = ['safe', 'safe', 'safe', 'warning', 'critical'];
  
  const satelliteNames = [
    'ISS', 'Hubble', 'Starlink-1234', 'GPS IIR-15', 'Iridium 42',
    'GOES-16', 'Landsat 9', 'NOAA-20', 'Terra', 'Aqua',
    'Sentinel-2A', 'COSMIC-2', 'ICESat-2', 'DSCOVR', 'SOHO',
    'Starlink-5678', 'OneWeb-89', 'Globalstar-FM12', 'Intelsat 35e', 'SES-17'
  ];

  for (let i = 0; i < 20; i++) {
    const orbitType = orbitTypes[Math.floor(Math.random() * orbitTypes.length)];
    let altitude: number;
    
    switch (orbitType) {
      case 'LEO': altitude = 400 + Math.random() * 1600; break;
      case 'MEO': altitude = 2000 + Math.random() * 33000; break;
      case 'GEO': altitude = 35786; break;
      case 'HEO': altitude = 500 + Math.random() * 39500; break;
    }

    const angle = (i / 20) * Math.PI * 2;
    const radius = 1 + (altitude / 40000);
    
    satellites.push({
      id: `sat-${i}`,
      name: satelliteNames[i] || `Satellite ${i}`,
      orbitType,
      altitude: Math.round(altitude),
      inclination: Math.random() * 90,
      velocity: 7.8 - (altitude / 100000), // Approximate orbital velocity
      riskLevel: riskLevels[Math.floor(Math.random() * riskLevels.length)],
      position: {
        x: Math.cos(angle) * radius,
        y: (Math.random() - 0.5) * 0.5,
        z: Math.sin(angle) * radius,
      },
    });
  }

  return satellites;
};

export const useSatelliteData = () => {
  const [satellites, setSatellites] = useState<Satellite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API delay
    const timer = setTimeout(() => {
      setSatellites(generateMockSatellites());
      setIsLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Slowly update satellite positions
  useEffect(() => {
    const interval = setInterval(() => {
      setSatellites(prev => prev.map(sat => {
        const speed = 0.001 * (1 + (sat.orbitType === 'LEO' ? 0.5 : 0));
        const angle = Math.atan2(sat.position.z, sat.position.x) + speed;
        const radius = Math.sqrt(sat.position.x ** 2 + sat.position.z ** 2);
        
        return {
          ...sat,
          position: {
            x: Math.cos(angle) * radius,
            y: sat.position.y,
            z: Math.sin(angle) * radius,
          },
        };
      }));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const stats = useMemo(() => ({
    total: satellites.length,
    safe: satellites.filter(s => s.riskLevel === 'safe').length,
    warning: satellites.filter(s => s.riskLevel === 'warning').length,
    critical: satellites.filter(s => s.riskLevel === 'critical').length,
    byOrbit: {
      LEO: satellites.filter(s => s.orbitType === 'LEO').length,
      MEO: satellites.filter(s => s.orbitType === 'MEO').length,
      GEO: satellites.filter(s => s.orbitType === 'GEO').length,
      HEO: satellites.filter(s => s.orbitType === 'HEO').length,
    },
  }), [satellites]);

  return { satellites, isLoading, stats };
};
