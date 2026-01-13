import { useState, useEffect, useMemo } from 'react';
import type { Satellite } from '@/types/space';

// Extended interface for detailed satellite specifications
interface DetailedSatellite extends Omit<Satellite, 'position'> {
  launchDate?: string;
  operator?: string;
  mission?: string;
  mass?: number;
  power?: number;
  designLife?: number;
  launchVehicle?: string;
  country?: string;
}

// Comprehensive list of real-world satellites including detailed ISRO satellites
const WORLD_SATELLITES: DetailedSatellite[] = [
  // ISS and Space Stations
  { id: 'iss', name: 'ISS (ZARYA)', orbitType: 'LEO', altitude: 420, inclination: 51.6, velocity: 7.66, riskLevel: 'safe', launchDate: '1998-11-20', operator: 'NASA/Roscosmos/ESA/JAXA/CSA', mission: 'Human spaceflight research', mass: 419725, country: 'International' },
  { id: 'css', name: 'Tiangong (CSS)', orbitType: 'LEO', altitude: 390, inclination: 41.5, velocity: 7.68, riskLevel: 'safe', launchDate: '2021-04-29', operator: 'CNSA', mission: 'Chinese space station', mass: 100000, country: 'China' },
  
  // ============ INDIAN SATELLITES (ISRO) - DETAILED ============
  
  // NavIC/IRNSS Navigation Constellation
  { id: 'irnss-1a', name: 'IRNSS-1A', orbitType: 'GEO', altitude: 35786, inclination: 29, velocity: 3.07, riskLevel: 'warning', launchDate: '2013-07-01', operator: 'ISRO', mission: 'Navigation - First NavIC satellite, atomic clock anomaly', mass: 1425, power: 1660, designLife: 10, launchVehicle: 'PSLV-C22', country: 'India' },
  { id: 'irnss-1b', name: 'IRNSS-1B', orbitType: 'GEO', altitude: 35786, inclination: 31, velocity: 3.07, riskLevel: 'safe', launchDate: '2014-04-04', operator: 'ISRO', mission: 'Navigation - NavIC constellation, 55°E inclined GSO', mass: 1432, power: 1660, designLife: 10, launchVehicle: 'PSLV-C24', country: 'India' },
  { id: 'irnss-1c', name: 'IRNSS-1C', orbitType: 'GEO', altitude: 35786, inclination: 5, velocity: 3.07, riskLevel: 'safe', launchDate: '2014-10-16', operator: 'ISRO', mission: 'Navigation - Geostationary at 83°E', mass: 1425, power: 1660, designLife: 10, launchVehicle: 'PSLV-C26', country: 'India' },
  { id: 'irnss-1d', name: 'IRNSS-1D', orbitType: 'GEO', altitude: 35786, inclination: 31, velocity: 3.07, riskLevel: 'safe', launchDate: '2015-03-28', operator: 'ISRO', mission: 'Navigation - 111.75°E inclined GSO', mass: 1425, power: 1660, designLife: 10, launchVehicle: 'PSLV-C27', country: 'India' },
  { id: 'irnss-1e', name: 'IRNSS-1E', orbitType: 'GEO', altitude: 35786, inclination: 29, velocity: 3.07, riskLevel: 'safe', launchDate: '2016-01-20', operator: 'ISRO', mission: 'Navigation - 111.75°E inclined GSO', mass: 1425, power: 1660, designLife: 10, launchVehicle: 'PSLV-C31', country: 'India' },
  { id: 'irnss-1f', name: 'IRNSS-1F', orbitType: 'GEO', altitude: 35786, inclination: 5, velocity: 3.07, riskLevel: 'safe', launchDate: '2016-03-10', operator: 'ISRO', mission: 'Navigation - Geostationary at 32.5°E', mass: 1425, power: 1660, designLife: 10, launchVehicle: 'PSLV-C32', country: 'India' },
  { id: 'irnss-1g', name: 'IRNSS-1G', orbitType: 'GEO', altitude: 35786, inclination: 5, velocity: 3.07, riskLevel: 'safe', launchDate: '2016-04-28', operator: 'ISRO', mission: 'Navigation - Completed 7-satellite constellation', mass: 1425, power: 1660, designLife: 10, launchVehicle: 'PSLV-C33', country: 'India' },
  { id: 'irnss-1h', name: 'NVS-01 (IRNSS-1H)', orbitType: 'GEO', altitude: 35786, inclination: 29, velocity: 3.07, riskLevel: 'safe', launchDate: '2023-05-29', operator: 'ISRO', mission: 'Navigation - 2nd gen NavIC with L1 civilian signal', mass: 2232, power: 2400, designLife: 12, launchVehicle: 'GSLV-F12', country: 'India' },
  { id: 'irnss-1i', name: 'NVS-02', orbitType: 'GEO', altitude: 35786, inclination: 29, velocity: 3.07, riskLevel: 'safe', launchDate: '2024-01-29', operator: 'ISRO', mission: 'Navigation - Replacement for IRNSS-1E', mass: 2232, power: 2400, designLife: 12, launchVehicle: 'GSLV-F14', country: 'India' },
  
  // GSAT Communication Satellites
  { id: 'gsat-30', name: 'GSAT-30', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe', launchDate: '2020-01-17', operator: 'ISRO', mission: 'Communication - DTH, VSAT, 12 C + 12 Ku band transponders', mass: 3357, power: 6000, designLife: 15, launchVehicle: 'Ariane 5', country: 'India' },
  { id: 'gsat-31', name: 'GSAT-31', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe', launchDate: '2019-02-06', operator: 'ISRO', mission: 'Communication - VSAT, telecom, DTH at 48°E', mass: 2536, power: 4700, designLife: 15, launchVehicle: 'Ariane 5', country: 'India' },
  { id: 'gsat-11', name: 'GSAT-11', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe', launchDate: '2018-12-05', operator: 'ISRO', mission: 'Communication - Heaviest Indian satellite, 16 Gbps HTS', mass: 5854, power: 13500, designLife: 15, launchVehicle: 'Ariane 5', country: 'India' },
  { id: 'gsat-29', name: 'GSAT-29', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe', launchDate: '2018-11-14', operator: 'ISRO', mission: 'Communication - HTS Ka/Ku, bridge digital divide in NE India', mass: 3423, power: 8800, designLife: 10, launchVehicle: 'GSLV Mk III-D2', country: 'India' },
  { id: 'gsat-19', name: 'GSAT-19', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe', launchDate: '2017-06-05', operator: 'ISRO', mission: 'Communication - First GSLV Mk III operational launch', mass: 3136, power: 4500, designLife: 10, launchVehicle: 'GSLV Mk III-D1', country: 'India' },
  { id: 'gsat-18', name: 'GSAT-18', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe', launchDate: '2016-10-06', operator: 'ISRO', mission: 'Communication - 48 transponders for DTH & VSAT', mass: 3404, power: 6000, designLife: 15, launchVehicle: 'Ariane 5', country: 'India' },
  { id: 'gsat-7', name: 'GSAT-7 (Rukmini)', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe', launchDate: '2013-08-30', operator: 'ISRO/Indian Navy', mission: 'Military - Naval network-centric operations, UHF/S/C/Ku bands', mass: 2650, power: 2900, designLife: 9, launchVehicle: 'Ariane 5', country: 'India' },
  { id: 'gsat-7a', name: 'GSAT-7A', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe', launchDate: '2018-12-19', operator: 'ISRO/IAF', mission: 'Military - Air Force network, UAV control, secure comms', mass: 2250, power: 3300, designLife: 8, launchVehicle: 'GSLV-F11', country: 'India' },
  
  // INSAT Meteorological
  { id: 'insat-3d', name: 'INSAT-3D', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe', launchDate: '2013-07-26', operator: 'ISRO/IMD', mission: 'Meteorology - 6-channel imager, 19-channel sounder', mass: 2060, power: 1164, designLife: 7, launchVehicle: 'Ariane 5', country: 'India' },
  { id: 'insat-3dr', name: 'INSAT-3DR', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe', launchDate: '2016-09-08', operator: 'ISRO/IMD', mission: 'Meteorology - Enhanced imager, Search & Rescue transponder', mass: 2211, power: 1700, designLife: 10, launchVehicle: 'GSLV-F05', country: 'India' },
  { id: 'insat-3ds', name: 'INSAT-3DS', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe', launchDate: '2024-02-17', operator: 'ISRO/IMD', mission: 'Meteorology - Weather, DCS, SAR, enhanced imaging', mass: 2274, power: 2600, designLife: 10, launchVehicle: 'GSLV-F14', country: 'India' },
  { id: 'insat-4a', name: 'INSAT-4A', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'warning', launchDate: '2005-12-22', operator: 'ISRO', mission: 'Communication - Oldest operational INSAT, DTH services', mass: 3081, power: 5900, designLife: 12, launchVehicle: 'Ariane 5', country: 'India' },
  { id: 'insat-4b', name: 'INSAT-4B', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe', launchDate: '2007-03-12', operator: 'ISRO', mission: 'Communication - C and Ku band transponders', mass: 3025, power: 5900, designLife: 12, launchVehicle: 'Ariane 5', country: 'India' },
  
  // Earth Observation - Cartosat Series
  { id: 'cartosat-2f', name: 'Cartosat-2F', orbitType: 'LEO', altitude: 505, inclination: 97.5, velocity: 7.6, riskLevel: 'safe', launchDate: '2018-01-12', operator: 'ISRO', mission: 'Earth Observation - 0.6m PAN, cartography, urban planning', mass: 710, power: 986, designLife: 5, launchVehicle: 'PSLV-C40', country: 'India' },
  { id: 'cartosat-3', name: 'Cartosat-3', orbitType: 'LEO', altitude: 509, inclination: 97.5, velocity: 7.6, riskLevel: 'safe', launchDate: '2019-11-27', operator: 'ISRO', mission: 'Earth Observation - 0.25m PAN (highest resolution Indian sat)', mass: 1625, power: 2300, designLife: 5, launchVehicle: 'PSLV-C47', country: 'India' },
  
  // Earth Observation - RISAT Series (Radar)
  { id: 'risat-2b', name: 'RISAT-2B', orbitType: 'LEO', altitude: 556, inclination: 37, velocity: 7.58, riskLevel: 'safe', launchDate: '2019-05-22', operator: 'ISRO', mission: 'Radar Imaging - X-band SAR, all-weather day-night imaging', mass: 615, power: 1000, designLife: 5, launchVehicle: 'PSLV-C46', country: 'India' },
  { id: 'risat-2br1', name: 'RISAT-2BR1', orbitType: 'LEO', altitude: 576, inclination: 37, velocity: 7.57, riskLevel: 'safe', launchDate: '2019-12-11', operator: 'ISRO', mission: 'Radar Imaging - X-band SAR, surveillance applications', mass: 628, power: 1000, designLife: 5, launchVehicle: 'PSLV-C48', country: 'India' },
  
  // EOS Series (Earth Observation Satellite)
  { id: 'eos-01', name: 'EOS-01 (RISAT-2BR2)', orbitType: 'LEO', altitude: 575, inclination: 37, velocity: 7.57, riskLevel: 'safe', launchDate: '2020-11-07', operator: 'ISRO', mission: 'Radar Imaging - Agriculture, forestry, disaster management', mass: 615, power: 1000, designLife: 5, launchVehicle: 'PSLV-C49', country: 'India' },
  { id: 'eos-02', name: 'EOS-02 (Microsat-2A)', orbitType: 'LEO', altitude: 450, inclination: 37, velocity: 7.64, riskLevel: 'safe', launchDate: '2022-08-07', operator: 'ISRO', mission: 'Technology Demo - Thermal imaging, small satellite platform', mass: 142, power: 220, designLife: 1, launchVehicle: 'SSLV-D1', country: 'India' },
  { id: 'eos-03', name: 'EOS-03 (GISAT-1)', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe', launchDate: '2024', operator: 'ISRO', mission: 'Earth Observation - GEO imaging, real-time disaster monitoring', mass: 2268, power: 2400, designLife: 7, launchVehicle: 'GSLV-F10', country: 'India' },
  { id: 'eos-04', name: 'EOS-04 (RISAT-1A)', orbitType: 'LEO', altitude: 529, inclination: 97.5, velocity: 7.59, riskLevel: 'safe', launchDate: '2022-02-14', operator: 'ISRO', mission: 'Radar Imaging - C-band SAR, 1-50m resolution, agriculture', mass: 1710, power: 2280, designLife: 5, launchVehicle: 'PSLV-C52', country: 'India' },
  { id: 'eos-06', name: 'EOS-06 (Oceansat-3)', orbitType: 'LEO', altitude: 742, inclination: 98.28, velocity: 7.45, riskLevel: 'safe', launchDate: '2022-11-26', operator: 'ISRO', mission: 'Ocean Observation - Chlorophyll, SST, ocean color, ARGOS', mass: 1117, power: 1700, designLife: 5, launchVehicle: 'PSLV-C54', country: 'India' },
  
  // Resource Monitoring
  { id: 'resourcesat-2a', name: 'RESOURCESAT-2A', orbitType: 'LEO', altitude: 817, inclination: 98.7, velocity: 7.44, riskLevel: 'safe', launchDate: '2016-12-07', operator: 'ISRO', mission: 'Earth Resources - LISS-3, LISS-4, AWiFS for agriculture', mass: 1235, power: 1250, designLife: 5, launchVehicle: 'PSLV-C36', country: 'India' },
  { id: 'oceansat-2', name: 'Oceansat-2', orbitType: 'LEO', altitude: 720, inclination: 98.3, velocity: 7.48, riskLevel: 'safe', launchDate: '2009-09-23', operator: 'ISRO', mission: 'Ocean Observation - Ocean color monitor, scatterometer', mass: 960, power: 1330, designLife: 5, launchVehicle: 'PSLV-C14', country: 'India' },
  { id: 'scatsat-1', name: 'ScatSat-1', orbitType: 'LEO', altitude: 720, inclination: 98.1, velocity: 7.48, riskLevel: 'safe', launchDate: '2016-09-26', operator: 'ISRO', mission: 'Weather - Ku-band scatterometer for wind vector', mass: 371, power: 750, designLife: 5, launchVehicle: 'PSLV-C35', country: 'India' },
  
  // Scientific Missions
  { id: 'astrosat', name: 'AstroSat', orbitType: 'LEO', altitude: 650, inclination: 6, velocity: 7.53, riskLevel: 'safe', launchDate: '2015-09-28', operator: 'ISRO', mission: 'Space Astronomy - Multi-wavelength observatory, UV/X-ray', mass: 1515, power: 2100, designLife: 5, launchVehicle: 'PSLV-C30', country: 'India' },
  { id: 'chandrayaan-2', name: 'Chandrayaan-2 Orbiter', orbitType: 'HEO', altitude: 100, inclination: 90, velocity: 1.68, riskLevel: 'safe', launchDate: '2019-07-22', operator: 'ISRO', mission: 'Lunar Science - 8 payloads mapping lunar surface', mass: 2379, power: 1000, designLife: 7, launchVehicle: 'GSLV Mk III-M1', country: 'India' },
  { id: 'mars-orbiter', name: 'Mars Orbiter Mission (Mangalyaan)', orbitType: 'HEO', altitude: 377, inclination: 150, velocity: 4.3, riskLevel: 'safe', launchDate: '2013-11-05', operator: 'ISRO', mission: 'Mars Science - First Asian Mars mission, methane detection', mass: 1337, power: 840, designLife: 6, launchVehicle: 'PSLV-C25', country: 'India' },
  { id: 'aditya-l1', name: 'Aditya-L1', orbitType: 'HEO', altitude: 1500000, inclination: 0, velocity: 0.3, riskLevel: 'safe', launchDate: '2023-09-02', operator: 'ISRO', mission: 'Solar Observatory - Corona & space weather from L1 point', mass: 1475, power: 1384, designLife: 5, launchVehicle: 'PSLV-C57', country: 'India' },
  { id: 'xposat', name: 'XPoSat', orbitType: 'LEO', altitude: 650, inclination: 6, velocity: 7.53, riskLevel: 'safe', launchDate: '2024-01-01', operator: 'ISRO', mission: 'X-ray Astronomy - Polarimetry of cosmic X-ray sources', mass: 469, power: 500, designLife: 5, launchVehicle: 'PSLV-C58', country: 'India' },
  
  // ============ INTERNATIONAL SATELLITES ============
  
  // GPS Constellation
  { id: 'gps-01', name: 'GPS IIR-2', orbitType: 'MEO', altitude: 20200, inclination: 55, velocity: 3.87, riskLevel: 'safe', country: 'USA' },
  { id: 'gps-02', name: 'GPS IIR-3', orbitType: 'MEO', altitude: 20200, inclination: 55, velocity: 3.87, riskLevel: 'safe', country: 'USA' },
  { id: 'gps-03', name: 'GPS IIR-4', orbitType: 'MEO', altitude: 20200, inclination: 55, velocity: 3.87, riskLevel: 'safe', country: 'USA' },
  { id: 'gps-04', name: 'GPS IIR-5', orbitType: 'MEO', altitude: 20200, inclination: 55, velocity: 3.87, riskLevel: 'safe', country: 'USA' },
  { id: 'gps-05', name: 'GPS III-01', orbitType: 'MEO', altitude: 20200, inclination: 55, velocity: 3.87, riskLevel: 'safe', country: 'USA' },
  { id: 'gps-06', name: 'GPS III-02', orbitType: 'MEO', altitude: 20200, inclination: 55, velocity: 3.87, riskLevel: 'safe', country: 'USA' },
  
  // Starlink Constellation (sample)
  ...Array.from({ length: 100 }, (_, i) => ({
    id: `starlink-${i + 1}`,
    name: `Starlink-${1000 + i}`,
    orbitType: 'LEO' as const,
    altitude: 550 + Math.random() * 10,
    inclination: 53.0 + Math.random() * 0.5,
    velocity: 7.59,
    riskLevel: Math.random() > 0.95 ? 'warning' as const : 'safe' as const,
    country: 'USA',
  })),
  
  // OneWeb Constellation
  ...Array.from({ length: 40 }, (_, i) => ({
    id: `oneweb-${i + 1}`,
    name: `OneWeb-${100 + i}`,
    orbitType: 'LEO' as const,
    altitude: 1200,
    inclination: 87.9,
    velocity: 7.26,
    riskLevel: 'safe' as const,
    country: 'UK',
  })),
  
  // Iridium NEXT
  ...Array.from({ length: 66 }, (_, i) => ({
    id: `iridium-${i + 1}`,
    name: `Iridium ${100 + i}`,
    orbitType: 'LEO' as const,
    altitude: 780,
    inclination: 86.4,
    velocity: 7.46,
    riskLevel: 'safe' as const,
    country: 'USA',
  })),
  
  // Weather Satellites
  { id: 'goes-16', name: 'GOES-16', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe', country: 'USA' },
  { id: 'goes-17', name: 'GOES-17', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe', country: 'USA' },
  { id: 'goes-18', name: 'GOES-18', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe', country: 'USA' },
  { id: 'noaa-20', name: 'NOAA-20', orbitType: 'LEO', altitude: 824, inclination: 98.7, velocity: 7.44, riskLevel: 'safe', country: 'USA' },
  { id: 'noaa-21', name: 'NOAA-21', orbitType: 'LEO', altitude: 824, inclination: 98.7, velocity: 7.44, riskLevel: 'safe', country: 'USA' },
  { id: 'meteosat-11', name: 'Meteosat-11', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe', country: 'EU' },
  { id: 'himawari-8', name: 'Himawari-8', orbitType: 'GEO', altitude: 35786, inclination: 0.1, velocity: 3.07, riskLevel: 'safe', country: 'Japan' },
  
  // Earth Observation
  { id: 'landsat-8', name: 'Landsat 8', orbitType: 'LEO', altitude: 705, inclination: 98.2, velocity: 7.5, riskLevel: 'safe', country: 'USA' },
  { id: 'landsat-9', name: 'Landsat 9', orbitType: 'LEO', altitude: 705, inclination: 98.2, velocity: 7.5, riskLevel: 'safe', country: 'USA' },
  { id: 'sentinel-1a', name: 'Sentinel-1A', orbitType: 'LEO', altitude: 693, inclination: 98.2, velocity: 7.5, riskLevel: 'safe', country: 'EU' },
  { id: 'sentinel-1b', name: 'Sentinel-1B', orbitType: 'LEO', altitude: 693, inclination: 98.2, velocity: 7.5, riskLevel: 'warning', country: 'EU' },
  { id: 'sentinel-2a', name: 'Sentinel-2A', orbitType: 'LEO', altitude: 786, inclination: 98.6, velocity: 7.45, riskLevel: 'safe', country: 'EU' },
  { id: 'sentinel-2b', name: 'Sentinel-2B', orbitType: 'LEO', altitude: 786, inclination: 98.6, velocity: 7.45, riskLevel: 'safe', country: 'EU' },
  { id: 'worldview-3', name: 'WorldView-3', orbitType: 'LEO', altitude: 617, inclination: 97.5, velocity: 7.54, riskLevel: 'safe', country: 'USA' },
  { id: 'planet-dove', name: 'Planet Dove-1', orbitType: 'LEO', altitude: 475, inclination: 97.4, velocity: 7.62, riskLevel: 'safe', country: 'USA' },
  
  // Scientific Satellites
  { id: 'hubble', name: 'Hubble Space Telescope', orbitType: 'LEO', altitude: 540, inclination: 28.5, velocity: 7.59, riskLevel: 'warning', launchDate: '1990-04-24', mission: 'Space Telescope - Visible/UV/IR astronomy', country: 'USA' },
  { id: 'jwst', name: 'James Webb ST', orbitType: 'HEO', altitude: 1500000, inclination: 0, velocity: 0.3, riskLevel: 'safe', launchDate: '2021-12-25', mission: 'Space Telescope - Infrared astronomy from L2', country: 'USA/EU' },
  { id: 'chandra', name: 'Chandra X-ray', orbitType: 'HEO', altitude: 139000, inclination: 28.5, velocity: 1.5, riskLevel: 'safe', country: 'USA' },
  { id: 'fermi', name: 'Fermi Gamma-ray', orbitType: 'LEO', altitude: 550, inclination: 25.6, velocity: 7.59, riskLevel: 'safe', country: 'USA' },
  { id: 'tess', name: 'TESS', orbitType: 'HEO', altitude: 108000, inclination: 37, velocity: 2.2, riskLevel: 'safe', country: 'USA' },
  
  // Communication Satellites
  { id: 'intelsat-39', name: 'Intelsat 39', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe', country: 'USA' },
  { id: 'ses-17', name: 'SES-17', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe', country: 'Luxembourg' },
  { id: 'viasat-3', name: 'ViaSat-3', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe', country: 'USA' },
  { id: 'eutelsat-36d', name: 'Eutelsat 36D', orbitType: 'GEO', altitude: 35786, inclination: 0, velocity: 3.07, riskLevel: 'safe', country: 'France' },
  
  // Navigation (GLONASS)
  ...Array.from({ length: 24 }, (_, i) => ({
    id: `glonass-${i + 1}`,
    name: `GLONASS-M ${700 + i}`,
    orbitType: 'MEO' as const,
    altitude: 19130,
    inclination: 64.8,
    velocity: 3.95,
    riskLevel: 'safe' as const,
    country: 'Russia',
  })),
  
  // Galileo
  ...Array.from({ length: 22 }, (_, i) => ({
    id: `galileo-${i + 1}`,
    name: `Galileo-${200 + i}`,
    orbitType: 'MEO' as const,
    altitude: 23222,
    inclination: 56,
    velocity: 3.67,
    riskLevel: 'safe' as const,
    country: 'EU',
  })),
  
  // BeiDou
  ...Array.from({ length: 30 }, (_, i) => ({
    id: `beidou-${i + 1}`,
    name: `BeiDou-3 M${i + 1}`,
    orbitType: 'MEO' as const,
    altitude: 21528,
    inclination: 55,
    velocity: 3.77,
    riskLevel: 'safe' as const,
    country: 'China',
  })),
  
  // Military/Reconnaissance (publicly known)
  { id: 'usa-224', name: 'USA-224 (KH-11)', orbitType: 'LEO', altitude: 260, inclination: 97.9, velocity: 7.77, riskLevel: 'safe', country: 'USA' },
  { id: 'usa-290', name: 'USA-290 (KH-11)', orbitType: 'LEO', altitude: 260, inclination: 97.9, velocity: 7.77, riskLevel: 'safe', country: 'USA' },
  
  // Space Debris / Defunct (marked as critical)
  { id: 'envisat', name: 'Envisat (defunct)', orbitType: 'LEO', altitude: 766, inclination: 98.5, velocity: 7.45, riskLevel: 'critical', country: 'EU' },
  { id: 'cosmos-954', name: 'Cosmos 954 debris', orbitType: 'LEO', altitude: 450, inclination: 65, velocity: 7.64, riskLevel: 'critical', country: 'Russia' },
  { id: 'fengyun-1c', name: 'Fengyun-1C debris', orbitType: 'LEO', altitude: 850, inclination: 98.6, velocity: 7.43, riskLevel: 'critical', country: 'China' },
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
