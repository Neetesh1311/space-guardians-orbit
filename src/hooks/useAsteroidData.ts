import { useQuery } from '@tanstack/react-query';
import type { Asteroid, NEOApiResponse, NasaNEO } from '@/types/space';

const NASA_API_KEY = 'PVMAF11BDXNn4RrwlWNkdQgrhdikm4ImVi2PYNTu';

const transformNEOData = (neo: NasaNEO): Asteroid => {
  const closeApproach = neo.close_approach_data[0];
  return {
    id: neo.id,
    name: neo.name.replace(/[()]/g, ''),
    estimatedDiameter: {
      min: neo.estimated_diameter.kilometers.estimated_diameter_min,
      max: neo.estimated_diameter.kilometers.estimated_diameter_max,
    },
    isPotentiallyHazardous: neo.is_potentially_hazardous_asteroid,
    closeApproachDate: closeApproach?.close_approach_date || 'Unknown',
    missDistance: parseFloat(closeApproach?.miss_distance.kilometers || '0'),
    relativeVelocity: parseFloat(closeApproach?.relative_velocity.kilometers_per_second || '0'),
    orbitingBody: closeApproach?.orbiting_body || 'Earth',
  };
};

const fetchNEOData = async (): Promise<Asteroid[]> => {
  const today = new Date();
  const endDate = new Date(today);
  endDate.setDate(today.getDate() + 7);

  const startDateStr = today.toISOString().split('T')[0];
  const endDateStr = endDate.toISOString().split('T')[0];

  const response = await fetch(
    `https://api.nasa.gov/neo/rest/v1/feed?start_date=${startDateStr}&end_date=${endDateStr}&api_key=${NASA_API_KEY}`
  );

  if (!response.ok) {
    throw new Error('Failed to fetch NEO data');
  }

  const data: NEOApiResponse = await response.json();
  
  const allAsteroids: Asteroid[] = [];
  Object.values(data.near_earth_objects).forEach((neos) => {
    neos.forEach((neo) => {
      allAsteroids.push(transformNEOData(neo));
    });
  });

  // Sort by closest approach distance
  return allAsteroids.sort((a, b) => a.missDistance - b.missDistance);
};

export const useAsteroidData = () => {
  return useQuery({
    queryKey: ['asteroids'],
    queryFn: fetchNEOData,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 4 * 60 * 1000,
  });
};
