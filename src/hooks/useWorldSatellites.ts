import { useState, useEffect, useMemo } from 'react';
import type { Satellite } from '@/types/space';

// Comprehensive list of real-world satellites including Indian satellites
const WORLD_SATELLITES: Omit<Satellite, 'position'>[] = [
  // ISS and Space Stations
  { id: 'iss', name: 'ISS (ZARYA)', orbitType: 'LEO', altitude: 420, inclination: 51.6, velocity: 7.66, riskLevel: 'safe' },
  { id: 'css', name: 'Tiangong (CSS)', orbitType: 'LEO', altitude: 390, inclination: 41.5, velocity: 7.68, riskLevel: 'safe' },
  
  // 🇮🇳 INDIAN SATELLITES (ISRO)
  // Communication Satellites
  { id: 'gsat-30', name: 'GSAT-30', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe' },
  { id: 'gsat-31', name: 'GSAT-31', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe' },
  { id: 'gsat-11', name: 'GSAT-11', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe' },
  { id: 'gsat-29', name: 'GSAT-29', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe' },
  { id: 'gsat-19', name: 'GSAT-19', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe' },
  { id: 'gsat-18', name: 'GSAT-18', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe' },
  { id: 'insat-3d', name: 'INSAT-3D', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe' },
  { id: 'insat-3dr', name: 'INSAT-3DR', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe' },
  { id: 'insat-4a', name: 'INSAT-4A', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'warning' },
  { id: 'insat-4b', name: 'INSAT-4B', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe' },
  
  // Earth Observation (Indian)
  { id: 'cartosat-2f', name: 'Cartosat-2F', orbitType: 'LEO', altitude: 505, inclination: 97.5, velocity: 7.6, riskLevel: 'safe' },
  { id: 'cartosat-3', name: 'Cartosat-3', orbitType: 'LEO', altitude: 509, inclination: 97.5, velocity: 7.6, riskLevel: 'safe' },
  { id: 'resourcesat-2a', name: 'RESOURCESAT-2A', orbitType: 'LEO', altitude: 817, inclination: 98.7, velocity: 7.44, riskLevel: 'safe' },
  { id: 'risat-2b', name: 'RISAT-2B', orbitType: 'LEO', altitude: 556, inclination: 37, velocity: 7.58, riskLevel: 'safe' },
  { id: 'risat-2br1', name: 'RISAT-2BR1', orbitType: 'LEO', altitude: 576, inclination: 37, velocity: 7.57, riskLevel: 'safe' },
  { id: 'oceansat-2', name: 'Oceansat-2', orbitType: 'LEO', altitude: 720, inclination: 98.3, velocity: 7.48, riskLevel: 'safe' },
  { id: 'scatsat-1', name: 'ScatSat-1', orbitType: 'LEO', altitude: 720, inclination: 98.1, velocity: 7.48, riskLevel: 'safe' },
  { id: 'eos-01', name: 'EOS-01', orbitType: 'LEO', altitude: 575, inclination: 37, velocity: 7.57, riskLevel: 'safe' },
  { id: 'eos-02', name: 'EOS-02', orbitType: 'LEO', altitude: 450, inclination: 37, velocity: 7.64, riskLevel: 'safe' },
  { id: 'eos-03', name: 'EOS-03', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe' },
  { id: 'eos-04', name: 'EOS-04', orbitType: 'LEO', altitude: 529, inclination: 97.5, velocity: 7.59, riskLevel: 'safe' },
  { id: 'eos-06', name: 'EOS-06', orbitType: 'LEO', altitude: 720, inclination: 98.3, velocity: 7.48, riskLevel: 'safe' },
  
  // Navigation (Indian - NavIC/IRNSS)
  { id: 'irnss-1a', name: 'IRNSS-1A', orbitType: 'GEO', altitude: 35786, inclination: 29, velocity: 3.07, riskLevel: 'warning' },
  { id: 'irnss-1b', name: 'IRNSS-1B', orbitType: 'GEO', altitude: 35786, inclination: 31, velocity: 3.07, riskLevel: 'safe' },
  { id: 'irnss-1c', name: 'IRNSS-1C', orbitType: 'GEO', altitude: 35786, inclination: 5, velocity: 3.07, riskLevel: 'safe' },
  { id: 'irnss-1d', name: 'IRNSS-1D', orbitType: 'GEO', altitude: 35786, inclination: 31, velocity: 3.07, riskLevel: 'safe' },
  { id: 'irnss-1e', name: 'IRNSS-1E', orbitType: 'GEO', altitude: 35786, inclination: 29, velocity: 3.07, riskLevel: 'safe' },
  { id: 'irnss-1f', name: 'IRNSS-1F', orbitType: 'GEO', altitude: 35786, inclination: 5, velocity: 3.07, riskLevel: 'safe' },
  { id: 'irnss-1g', name: 'IRNSS-1G', orbitType: 'GEO', altitude: 35786, inclination: 5, velocity: 3.07, riskLevel: 'safe' },
  { id: 'irnss-1h', name: 'IRNSS-1H (NVS-01)', orbitType: 'GEO', altitude: 35786, inclination: 29, velocity: 3.07, riskLevel: 'safe' },
  { id: 'irnss-1i', name: 'IRNSS-1I (NVS-02)', orbitType: 'GEO', altitude: 35786, inclination: 29, velocity: 3.07, riskLevel: 'safe' },
  
  // Scientific (Indian)
  { id: 'astrosat', name: 'AstroSat', orbitType: 'LEO', altitude: 650, inclination: 6, velocity: 7.53, riskLevel: 'safe' },
  { id: 'chandrayaan-2', name: 'Chandrayaan-2 Orbiter', orbitType: 'HEO', altitude: 100, inclination: 90, velocity: 1.68, riskLevel: 'safe' },
  { id: 'mars-orbiter', name: 'Mars Orbiter Mission', orbitType: 'HEO', altitude: 377, inclination: 150, velocity: 4.3, riskLevel: 'safe' },
  { id: 'aditya-l1', name: 'Aditya-L1', orbitType: 'HEO', altitude: 1500000, inclination: 0, velocity: 0.3, riskLevel: 'safe' },
  { id: 'xposat', name: 'XPoSat', orbitType: 'LEO', altitude: 650, inclination: 6, velocity: 7.53, riskLevel: 'safe' },
  
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

// Space Debris Data
export interface SpaceDebris {
  id: string;
  name: string;
  origin: string;
  size: 'small' | 'medium' | 'large';
  altitude: number;
  velocity: number;
  riskLevel: 'low' | 'medium' | 'high';
  position: { x: number; y: number; z: number };
}

const SPACE_DEBRIS_DATA: Omit<SpaceDebris, 'position'>[] = [
  // Major debris events
  { id: 'fengyun-debris-1', name: 'Fengyun-1C Fragment A', origin: 'China ASAT Test 2007', size: 'large', altitude: 865, velocity: 7.42, riskLevel: 'high' },
  { id: 'fengyun-debris-2', name: 'Fengyun-1C Fragment B', origin: 'China ASAT Test 2007', size: 'medium', altitude: 820, velocity: 7.44, riskLevel: 'high' },
  { id: 'fengyun-debris-3', name: 'Fengyun-1C Fragment C', origin: 'China ASAT Test 2007', size: 'small', altitude: 890, velocity: 7.41, riskLevel: 'medium' },
  { id: 'cosmos-iridium-1', name: 'Cosmos-Iridium Fragment 1', origin: 'Cosmos-Iridium Collision 2009', size: 'large', altitude: 780, velocity: 7.46, riskLevel: 'high' },
  { id: 'cosmos-iridium-2', name: 'Cosmos-Iridium Fragment 2', origin: 'Cosmos-Iridium Collision 2009', size: 'medium', altitude: 790, velocity: 7.45, riskLevel: 'medium' },
  { id: 'cosmos-iridium-3', name: 'Cosmos-Iridium Fragment 3', origin: 'Cosmos-Iridium Collision 2009', size: 'small', altitude: 775, velocity: 7.46, riskLevel: 'low' },
  
  // Rocket bodies
  { id: 'rb-1', name: 'Delta II R/B', origin: 'USA Launch Debris', size: 'large', altitude: 420, velocity: 7.66, riskLevel: 'medium' },
  { id: 'rb-2', name: 'CZ-2C R/B', origin: 'China Launch Debris', size: 'large', altitude: 580, velocity: 7.57, riskLevel: 'medium' },
  { id: 'rb-3', name: 'Breeze-M R/B', origin: 'Russia Launch Debris', size: 'large', altitude: 35786, velocity: 3.07, riskLevel: 'low' },
  { id: 'rb-4', name: 'Centaur R/B', origin: 'USA Launch Debris', size: 'large', altitude: 750, velocity: 7.47, riskLevel: 'medium' },
  { id: 'rb-5', name: 'H-2A R/B', origin: 'Japan Launch Debris', size: 'large', altitude: 620, velocity: 7.53, riskLevel: 'low' },
  { id: 'rb-6', name: 'PSLV R/B', origin: 'India Launch Debris', size: 'large', altitude: 500, velocity: 7.6, riskLevel: 'low' },
  
  // Small debris fragments
  ...Array.from({ length: 50 }, (_, i) => ({
    id: `debris-small-${i + 1}`,
    name: `Fragment ${1000 + i}`,
    origin: ['Mission Debris', 'Collision Fragment', 'Explosion Fragment', 'Paint Flake', 'MLI Debris'][Math.floor(Math.random() * 5)],
    size: 'small' as const,
    altitude: 300 + Math.random() * 1000,
    velocity: 7.2 + Math.random() * 0.6,
    riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
  })),
  
  // Medium debris
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `debris-med-${i + 1}`,
    name: `Object ${2000 + i}`,
    origin: ['Defunct Satellite', 'Stage Debris', 'Payload Adapter', 'Solar Panel Fragment'][Math.floor(Math.random() * 4)],
    size: 'medium' as const,
    altitude: 400 + Math.random() * 800,
    velocity: 7.3 + Math.random() * 0.4,
    riskLevel: ['low', 'medium', 'high'][Math.floor(Math.random() * 3)] as 'low' | 'medium' | 'high',
  })),
  
  // Large debris (defunct satellites)
  { id: 'defunct-1', name: 'Cosmos 1275 (defunct)', origin: 'USSR', size: 'large', altitude: 985, velocity: 7.38, riskLevel: 'high' },
  { id: 'defunct-2', name: 'SL-16 R/B', origin: 'USSR/Russia', size: 'large', altitude: 850, velocity: 7.43, riskLevel: 'high' },
  { id: 'defunct-3', name: 'Ariane 1 R/B', origin: 'ESA', size: 'large', altitude: 720, velocity: 7.48, riskLevel: 'medium' },
  { id: 'defunct-4', name: 'Thor Burner 2A R/B', origin: 'USA', size: 'large', altitude: 680, velocity: 7.5, riskLevel: 'medium' },
  { id: 'defunct-5', name: 'Pegasus R/B', origin: 'USA', size: 'medium', altitude: 590, velocity: 7.56, riskLevel: 'low' },
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

const generateDebrisPosition = (debris: Omit<SpaceDebris, 'position'>, index: number, time: number): { x: number; y: number; z: number } => {
  const baseAngle = (index / 100) * Math.PI * 2 + (index * 0.5);
  const orbitSpeed = 0.003;
  const angle = baseAngle + time * orbitSpeed;
  
  const normalizedRadius = 1 + (debris.altitude / 50000);
  const randomOffset = Math.sin(index * 1.5) * 0.2;
  
  return {
    x: Math.cos(angle) * normalizedRadius + randomOffset,
    y: Math.sin(angle * 0.7) * 0.2,
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

  const spaceDebris = useMemo((): SpaceDebris[] => {
    return SPACE_DEBRIS_DATA.map((debris, index) => ({
      ...debris,
      position: generateDebrisPosition(debris, index, time),
    }));
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
      scientific: satellites.filter(s => ['Hubble', 'JWST', 'Chandra', 'TESS', 'Fermi', 'AstroSat', 'XPoSat'].some(n => s.name.includes(n))).length,
      indian: satellites.filter(s => ['GSAT', 'INSAT', 'Cartosat', 'RISAT', 'IRNSS', 'AstroSat', 'Chandrayaan', 'Aditya', 'EOS', 'Oceansat', 'RESOURCESAT', 'XPoSat', 'Mars Orbiter'].some(n => s.name.includes(n))).length,
    },
    debris: {
      total: spaceDebris.length,
      high: spaceDebris.filter(d => d.riskLevel === 'high').length,
      medium: spaceDebris.filter(d => d.riskLevel === 'medium').length,
      low: spaceDebris.filter(d => d.riskLevel === 'low').length,
    }
  }), [satellites, spaceDebris]);

  return { satellites, spaceDebris, isLoading, stats };
};
