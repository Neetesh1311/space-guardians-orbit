import { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { TextureLoader } from 'three';
import earthTexture from '@/assets/earth-texture.jpg';
import type { Satellite } from '@/types/space';
import { Globe } from 'lucide-react';

interface EarthProps {
  satellites: Satellite[];
}

const Earth = () => {
  const earthRef = useRef<THREE.Mesh>(null);
  const texture = useLoader(TextureLoader, earthTexture);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={earthRef} args={[1, 64, 64]}>
      <meshStandardMaterial map={texture} />
    </Sphere>
  );
};

const AtmosphereGlow = () => {
  return (
    <Sphere args={[1.02, 64, 64]}>
      <meshBasicMaterial
        color="#4fc3f7"
        transparent
        opacity={0.15}
        side={THREE.BackSide}
      />
    </Sphere>
  );
};

interface SatellitePointsProps {
  satellites: Satellite[];
}

const SatellitePoints = ({ satellites }: SatellitePointsProps) => {
  const pointsRef = useRef<THREE.Points>(null);

  const { positions, colors } = useMemo(() => {
    const positions = new Float32Array(satellites.length * 3);
    const colors = new Float32Array(satellites.length * 3);

    satellites.forEach((sat, i) => {
      positions[i * 3] = sat.position.x;
      positions[i * 3 + 1] = sat.position.y;
      positions[i * 3 + 2] = sat.position.z;

      let color: [number, number, number];
      switch (sat.riskLevel) {
        case 'critical':
          color = [1, 0.2, 0.2];
          break;
        case 'warning':
          color = [1, 0.8, 0.2];
          break;
        default:
          color = [0.2, 1, 0.6];
      }
      colors[i * 3] = color[0];
      colors[i * 3 + 1] = color[1];
      colors[i * 3 + 2] = color[2];
    });

    return { positions, colors };
  }, [satellites]);

  useFrame(() => {
    if (pointsRef.current) {
      const positionAttr = pointsRef.current.geometry.attributes.position;
      satellites.forEach((sat, i) => {
        positionAttr.setXYZ(i, sat.position.x, sat.position.y, sat.position.z);
      });
      positionAttr.needsUpdate = true;
    }
  });

  if (satellites.length === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={satellites.length}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={satellites.length}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        vertexColors
        transparent
        opacity={0.9}
        sizeAttenuation
      />
    </points>
  );
};

const OrbitalRings = () => {
  const ringColors = ['#4fc3f7', '#81c784', '#ffb74d'];
  const radii = [1.15, 1.5, 2.0];

  return (
    <>
      {radii.map((radius, i) => (
        <mesh key={i} rotation={[Math.PI / 2 + (i * 0.1), 0, 0]}>
          <ringGeometry args={[radius - 0.005, radius + 0.005, 128]} />
          <meshBasicMaterial
            color={ringColors[i]}
            transparent
            opacity={0.2}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </>
  );
};

const Scene = ({ satellites }: EarthProps) => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 3, 5]} intensity={1.5} />
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#4fc3f7" />
      
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
      <AtmosphereGlow />
      <OrbitalRings />
      <SatellitePoints satellites={satellites} />
      
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        minDistance={1.5}
        maxDistance={10}
        autoRotate
        autoRotateSpeed={0.3}
      />
    </>
  );
};

const LoadingFallback = () => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-radial from-secondary/20 to-background">
    <div className="text-center">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/30 blur-2xl rounded-full animate-pulse" />
        <Globe className="h-16 w-16 text-primary relative animate-spin-slow" />
      </div>
      <p className="mt-4 text-sm text-muted-foreground">Loading Earth View...</p>
    </div>
  </div>
);

export const EarthScene = ({ satellites }: EarthProps) => {
  return (
    <div className="w-full h-full relative">
      <Suspense fallback={<LoadingFallback />}>
        <Canvas
          camera={{ position: [0, 0, 3], fov: 45 }}
          gl={{ antialias: true, alpha: true }}
        >
          <Scene satellites={satellites} />
        </Canvas>
      </Suspense>
    </div>
  );
};
