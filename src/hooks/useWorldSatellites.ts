import { useState, useEffect, useMemo } from 'react';
import type { Satellite } from '@/types/space';

// Comprehensive list of real-world satellites
const WORLD_SATELLITES: Omit<Satellite, 'position'>[] = [
  // ISS and Space Stations
  { id: 'iss', name: 'ISS (ZARYA)', orbitType: 'LEO', altitude: 420, inclination: 51.6, velocity: 7.66, riskLevel: 'safe' },
  { id: 'css', name: 'Tiangong (CSS)', orbitType: 'LEO', altitude: 390, inclination: 41.5, velocity: 7.68, riskLevel: 'safe' },
  
  // GPS Constellation
  { id: 'gps-01', name: 'GPS IIR-2', orbitType: 'MEO', altitude: 20200, inclination: 55, velocity: 3.87, riskLevel: 'safe' },
  { id: 'gps-02', name: 'GPS IIR-3', orbitType: 'MEO', altitude: 20200, inclination: 55, velocity: 3.87, riskLevel: 'safe' },
  { id: 'gps-03', name: 'GPS IIR-4', orbitType: 'MEO', altitude: 20200, inclination: 55, velocity: 3.87, riskLevel: 'safe' },
  { id: 'gps-04', name: 'GPS IIR-5', orbitType: 'MEO', altitude: 20200, inclination: 55, velocity: 3.87, riskLevel: 'safe' },
  { id: 'gps-05', name: 'GPS III-01', orbitType: 'MEO', altitude: 20200, inclination: 55, velocity: 3.87, riskLevel: 'safe' },
  { id: 'gps-06', name: 'GPS III-02', orbitType: 'MEO', altitude: 20200, inclination: 55, velocity: 3.87, riskLevel: 'safe' },
  
  // Starlink Constellation (sample)
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `starlink-${i + 1}`,
    name: `Starlink-${1000 + i}`,
    orbitType: 'LEO' as const,
    altitude: 550 + Math.random() * 10,
    inclination: 53.0 + Math.random() * 0.5,
    velocity: 7.59,
    riskLevel: Math.random() > 0.95 ? 'warning' as const : 'safe' as const
  })),
  
  // OneWeb Constellation
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `oneweb-${i + 1}`,
    name: `OneWeb-${100 + i}`,
    orbitType: 'LEO' as const,
    altitude: 1200,
    inclination: 87.9,
    velocity: 7.26,
    riskLevel: 'safe' as const
  })),
  
  // Iridium NEXT
  ...Array.from({ length: 66 }, (_, i) => ({
    id: `iridium-${i + 1}`,
    name: `Iridium ${100 + i}`,
    orbitType: 'LEO' as const,
    altitude: 780,
    inclination: 86.4,
    velocity: 7.46,
    riskLevel: 'safe' as const
  })),
  
  // Weather Satellites
  { id: 'goes-16', name: 'GOES-16', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe' },
  { id: 'goes-17', name: 'GOES-17', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe' },
  { id: 'goes-18', name: 'GOES-18', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe' },
  { id: 'noaa-20', name: 'NOAA-20', orbitType: 'LEO', altitude: 824, inclination: 98.7, velocity: 7.44, riskLevel: 'safe' },
  { id: 'noaa-21', name: 'NOAA-21', orbitType: 'LEO', altitude: 824, inclination: 98.7, velocity: 7.44, riskLevel: 'safe' },
  { id: 'meteosat-11', name: 'Meteosat-11', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe' },
  { id: 'himawari-8', name: 'Himawari-8', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe' },
  
  // Earth Observation
  { id: 'landsat-8', name: 'Landsat 8', orbitType: 'LEO', altitude: 705, inclination: 98.2, velocity: 7.5, riskLevel: 'safe' },
  { id: 'landsat-9', name: 'Landsat 9', orbitType: 'LEO', altitude: 705, inclination: 98.2, velocity: 7.5, riskLevel: 'safe' },
  { id: 'sentinel-1a', name: 'Sentinel-1A', orbitType: 'LEO', altitude: 693, inclination: 98.2, velocity: 7.5, riskLevel: 'safe' },
  { id: 'sentinel-1b', name: 'Sentinel-1B', orbitType: 'LEO', altitude: 693, inclination: 98.2, velocity: 7.5, riskLevel: 'warning' },
  { id: 'sentinel-2a', name: 'Sentinel-2A', orbitType: 'LEO', altitude: 786, inclination: 98.6, velocity: 7.45, riskLevel: 'safe' },
  { id: 'sentinel-2b', name: 'Sentinel-2B', orbitType: 'LEO', altitude: 786, inclination: 98.6, velocity: 7.45, riskLevel: 'safe' },
  { id: 'worldview-3', name: 'WorldView-3', orbitType: 'LEO', altitude: 617, inclination: 97.5, velocity: 7.54, riskLevel: 'safe' },
  { id: 'planet-dove', name: 'Planet Dove-1', orbitType: 'LEO', altitude: 475, inclination: 97.4, velocity: 7.62, riskLevel: 'safe' },
  
  // Scientific Satellites
  { id: 'hubble', name: 'Hubble Space Telescope', orbitType: 'LEO', altitude: 540, inclination: 28.5, velocity: 7.59, riskLevel: 'warning' },
  { id: 'jwst', name: 'James Webb ST', orbitType: 'HEO', altitude: 1500000, inclination: 0, velocity: 0.3, riskLevel: 'safe' },
  { id: 'chandra', name: 'Chandra X-ray', orbitType: 'HEO', altitude: 139000, inclination: 28.5, velocity: 1.5, riskLevel: 'safe' },
  { id: 'fermi', name: 'Fermi Gamma-ray', orbitType: 'LEO', altitude: 550, inclination: 25.6, velocity: 7.59, riskLevel: 'safe' },
  { id: 'tess', name: 'TESS', orbitType: 'HEO', altitude: 108000, inclination: 37, velocity: 2.2, riskLevel: 'safe' },
  
  // Communication Satellites
  { id: 'intelsat-39', name: 'Intelsat 39', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe' },
  { id: 'ses-17', name: 'SES-17', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe' },
  { id: 'viasat-3', name: 'ViaSat-3', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe' },
  { id: 'eutelsat-36d', name: 'Eutelsat 36D', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe' },
  
  // Navigation (GLONASS)
  ...Array.from({ length: 24 }, (_, i) => ({
    id: `glonass-${i + 1}`,
    name: `GLONASS-M ${700 + i}`,
    orbitType: 'MEO' as const,
    altitude: 19130,
    inclination: 64.8,
    velocity: 3.95,
    riskLevel: 'safe' as const
  })),
  
  // Galileo
  ...Array.from({ length: 22 }, (_, i) => ({
    id: `galileo-${i + 1}`,
    name: `Galileo-${200 + i}`,
    orbitType: 'MEO' as const,
    altitude: 23222,
    inclination: 56,
    velocity: 3.67,
    riskLevel: 'safe' as const
  })),
  
  // BeiDou
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `beidou-${i + 1}`,
    name: `BeiDou-3 M${i + 1}`,
    orbitType: 'MEO' as const,
    altitude: 21528,
    inclination: 55,
    velocity: 3.77,
    riskLevel: 'safe' as const
  })),
  
  // Military/Reconnaissance (publicly known)
  { id: 'usa-224', name: 'USA-224 (KH-11)', orbitType: 'LEO', altitude: 260, inclination: 97.9, velocity: 7.77, riskLevel: 'safe' },
  { id: 'usa-290', name: 'USA-290 (KH-11)', orbitType: 'LEO', altitude: 260, inclination: 97.9, velocity: 7.77, riskLevel: 'safe' },
  
  // Space Debris / Defunct (marked as critical)
  { id: 'envisat', name: 'Envisat (defunct)', orbitType: 'LEO', altitude: 766, inclination: 98.5, velocity: 7.45, riskLevel: 'critical' },
  { id: 'cosmos-954', name: 'Cosmos 954 debris', orbitType: 'LEO', altitude: 450, inclination: 65, velocity: 7.64, riskLevel: 'critical' },
  { id: 'fengyun-1c', name: 'Fengyun-1C debris', orbitType: 'LEO', altitude: 850, inclination: 98.6, velocity: 7.43, riskLevel: 'critical' },
];

const generatePosition = (satellite: Omit<Satellite, 'position'>, index: number, totalInOrbit: number, time: number): { x: number; y: number; z: number } => {
  const baseAngle = (index / totalInOrbit) * Math.PI * 2;
  const orbitSpeed = satellite.orbitType === 'LEO' ? 0.002 : satellite.orbitType === 'MEO' ? 0.001 : 0.0002;
  const angle = baseAngle + time * orbitSpeed;
  
  // Normalize radius based on altitude
  const normalizedRadius = 1 + (satellite.altitude / 50000);
  const inclinationRad = (satellite.inclination * Math.PI) / 180;
  
  return {
    x: Math.cos(angle) * normalizedRadius * Math.cos(inclinationRad * 0.3),
    y: Math.sin(inclinationRad * 0.3) * normalizedRadius * 0.3 * Math.sin(angle * 0.5),
    z: Math.sin(angle) * normalizedRadius,
  };
};

export const useWorldSatellites = () => {
  const [time, setTime] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(t => t + 1);
    }, 100);
    return () => clearInterval(interval);
  }, []);

  const satellites = useMemo((): Satellite[] => {
    const orbitGroups: Record<string, number> = {};
    
    return WORLD_SATELLITES.map((sat, index) => {
      orbitGroups[sat.orbitType] = (orbitGroups[sat.orbitType] || 0) + 1;
      const indexInOrbit = orbitGroups[sat.orbitType];
      const totalInOrbit = WORLD_SATELLITES.filter(s => s.orbitType === sat.orbitType).length;
      
      return {
        ...sat,
        position: generatePosition(sat, indexInOrbit, totalInOrbit, time),
      };
    });
  }, [time]);

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
    byType: {
      starlink: satellites.filter(s => s.name.includes('Starlink')).length,
      gps: satellites.filter(s => s.name.includes('GPS')).length,
      scientific: satellites.filter(s => ['Hubble', 'JWST', 'Chandra', 'TESS', 'Fermi'].some(n => s.name.includes(n))).length,
    }
  }), [satellites]);

  return { satellites, isLoading, stats };
};