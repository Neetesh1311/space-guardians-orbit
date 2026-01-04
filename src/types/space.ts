export interface Satellite {
  id: string;
  name: string;
  orbitType: 'LEO' | 'MEO' | 'GEO' | 'HEO';
  altitude: number; // km
  inclination: number; // degrees
  velocity: number; // km/s
  riskLevel: 'safe' | 'warning' | 'critical';
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export interface Asteroid {
  id: string;
  name: string;
  estimatedDiameter: {
    min: number;
    max: number;
  };
  isPotentiallyHazardous: boolean;
  closeApproachDate: string;
  missDistance: number; // km
  relativeVelocity: number; // km/s
  orbitingBody: string;
}

export interface NEOApiResponse {
  element_count: number;
  near_earth_objects: {
    [date: string]: NasaNEO[];
  };
}

export interface NasaNEO {
  id: string;
  name: string;
  estimated_diameter: {
    kilometers: {
      estimated_diameter_min: number;
      estimated_diameter_max: number;
    };
  };
  is_potentially_hazardous_asteroid: boolean;
  close_approach_data: {
    close_approach_date: string;
    miss_distance: {
      kilometers: string;
    };
    relative_velocity: {
      kilometers_per_second: string;
    };
    orbiting_body: string;
  }[];
}

export interface SpaceDebris {
  id: string;
  size: 'small' | 'medium' | 'large';
  altitude: number;
  velocity: number;
  position: {
    x: number;
    y: number;
    z: number;
  };
}

export interface CollisionRisk {
  object1: string;
  object2: string;
  probability: number;
  timeToClosestApproach: number; // seconds
  minimumDistance: number; // km
}

export interface SystemStats {
  activeSatellites: number;
  trackedDebris: number;
  nearEarthAsteroids: number;
  activeAlerts: number;
  collisionRisks: number;
}
