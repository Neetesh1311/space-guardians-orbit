import { useQuery } from '@tanstack/react-query';

const NASA_API_KEY = 'PVMAF11BDXNn4RrwlWNkdQgrhdikm4ImVi2PYNTu';

export interface SolarFlare {
  flrID: string;
  beginTime: string;
  peakTime: string;
  endTime: string;
  classType: string;
  sourceLocation: string;
  activeRegionNum: number;
  linkedEvents: any[];
}

export interface CME {
  activityID: string;
  startTime: string;
  sourceLocation: string;
  note: string;
  instruments: { displayName: string }[];
  cmeAnalyses: {
    speed: number;
    latitude: number;
    longitude: number;
    halfAngle: number;
  }[];
}

export interface GeomagneticStorm {
  gstID: string;
  startTime: string;
  allKpIndex: { kpIndex: number; observedTime: string; source: string }[];
  linkedEvents: any[];
}

export interface SolarWeatherData {
  flares: SolarFlare[];
  cmes: CME[];
  geomagneticStorms: GeomagneticStorm[];
  overallThreatLevel: 'low' | 'moderate' | 'high' | 'severe';
}

const getDateRange = () => {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 7);
  return {
    start: start.toISOString().split('T')[0],
    end: end.toISOString().split('T')[0],
  };
};

const fetchSolarFlares = async (): Promise<SolarFlare[]> => {
  const { start, end } = getDateRange();
  try {
    const response = await fetch(
      `https://api.nasa.gov/DONKI/FLR?startDate=${start}&endDate=${end}&api_key=${NASA_API_KEY}`
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch solar flares:', error);
    return [];
  }
};

const fetchCMEs = async (): Promise<CME[]> => {
  const { start, end } = getDateRange();
  try {
    const response = await fetch(
      `https://api.nasa.gov/DONKI/CME?startDate=${start}&endDate=${end}&api_key=${NASA_API_KEY}`
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch CMEs:', error);
    return [];
  }
};

const fetchGeomagneticStorms = async (): Promise<GeomagneticStorm[]> => {
  const { start, end } = getDateRange();
  try {
    const response = await fetch(
      `https://api.nasa.gov/DONKI/GST?startDate=${start}&endDate=${end}&api_key=${NASA_API_KEY}`
    );
    if (!response.ok) return [];
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch geomagnetic storms:', error);
    return [];
  }
};

const calculateThreatLevel = (
  flares: SolarFlare[],
  cmes: CME[],
  storms: GeomagneticStorm[]
): 'low' | 'moderate' | 'high' | 'severe' => {
  const hasXFlare = flares.some(f => f.classType?.startsWith('X'));
  const hasMFlare = flares.some(f => f.classType?.startsWith('M'));
  const hasFastCME = cmes.some(c => 
    c.cmeAnalyses?.some(a => a.speed > 1000)
  );
  const hasStrongStorm = storms.some(s => 
    s.allKpIndex?.some(k => k.kpIndex >= 7)
  );

  if (hasXFlare || hasStrongStorm) return 'severe';
  if (hasMFlare || hasFastCME) return 'high';
  if (flares.length > 3 || cmes.length > 2) return 'moderate';
  return 'low';
};

const fetchAllSolarWeather = async (): Promise<SolarWeatherData> => {
  const [flares, cmes, geomagneticStorms] = await Promise.all([
    fetchSolarFlares(),
    fetchCMEs(),
    fetchGeomagneticStorms(),
  ]);

  return {
    flares: flares || [],
    cmes: cmes || [],
    geomagneticStorms: geomagneticStorms || [],
    overallThreatLevel: calculateThreatLevel(flares || [], cmes || [], geomagneticStorms || []),
  };
};

export const useSolarWeather = () => {
  return useQuery({
    queryKey: ['solarWeather'],
    queryFn: fetchAllSolarWeather,
    refetchInterval: 10 * 60 * 1000, // Refetch every 10 minutes
    staleTime: 5 * 60 * 1000,
  });
};