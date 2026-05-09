import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Sphere, Html } from '@react-three/drei';
import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { SpaceDebris } from '@/hooks/useWorldSatellites';

interface DebrisDensityHeatmap3DProps {
  debris: SpaceDebris[];
  timeOffset: number;
  selectedRisk: string;
}

const riskPalette = {
  low: '#22c55e',
  medium: '#f59e0b',
  high: '#ef4444',
};

const DensityCloud = ({ debris, timeOffset, selectedRisk }: DebrisDensityHeatmap3DProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const cells = useMemo(() => {
    const filtered = selectedRisk === 'all' ? debris : debris.filter((item) => item.riskLevel === selectedRisk);
    return filtered.map((item, index) => {
      const phase = timeOffset * 0.035 + index * 0.41;
      const radius = 1.08 + item.altitude / 1400;
      const inclination = (index % 12 - 6) * 0.035;
      return {
        id: item.id,
        name: item.name,
        risk: item.riskLevel,
        size: item.size === 'large' ? 0.09 : item.size === 'medium' ? 0.065 : 0.045,
        opacity: item.riskLevel === 'high' ? 0.82 : item.riskLevel === 'medium' ? 0.58 : 0.36,
        position: new THREE.Vector3(
          Math.cos(phase) * radius,
          Math.sin(phase * 0.73) * (0.18 + Math.abs(inclination)),
          Math.sin(phase) * radius
        ),
      };
    });
  }, [debris, selectedRisk, timeOffset]);

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.025;
    }
  });

  return (
    <group ref={groupRef}>
      {cells.map((cell, index) => (
        <group key={cell.id} position={cell.position}>
          <mesh>
            <sphereGeometry args={[cell.size, 18, 18]} />
            <meshBasicMaterial color={riskPalette[cell.risk]} transparent opacity={cell.opacity} />
          </mesh>
          <mesh>
            <sphereGeometry args={[cell.size * 2.8, 18, 18]} />
            <meshBasicMaterial color={riskPalette[cell.risk]} transparent opacity={cell.opacity * 0.12} blending={THREE.AdditiveBlending} depthWrite={false} />
          </mesh>
          {cell.risk === 'high' && index % 5 === 0 && (
            <Html distanceFactor={8}>
              <div className="glass-panel px-2 py-1 text-[10px] whitespace-nowrap border-destructive/40 text-destructive">
                {cell.name}
              </div>
            </Html>
          )}
        </group>
      ))}
    </group>
  );
};

const OrbitShells = () => (
  <>
    {[1.35, 1.68, 2.0].map((radius, index) => (
      <mesh key={radius} rotation={[Math.PI / 2 + index * 0.09, 0, 0]}>
        <ringGeometry args={[radius - 0.008, radius + 0.008, 160]} />
        <meshBasicMaterial color={index === 0 ? '#22c55e' : index === 1 ? '#f59e0b' : '#ef4444'} transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
    ))}
  </>
);

export const DebrisDensityHeatmap3D = ({ debris, timeOffset, selectedRisk }: DebrisDensityHeatmap3DProps) => {
  const highCount = debris.filter((item) => item.riskLevel === 'high').length;

  return (
    <div className="w-full h-full relative rounded-xl overflow-hidden border border-border/50 bg-card/30">
      <Canvas camera={{ position: [0, 2.4, 5.2], fov: 48 }} gl={{ antialias: true, alpha: true }}>
        <ambientLight intensity={0.35} />
        <pointLight position={[3, 3, 4]} intensity={1.3} color="#67e8f9" />
        <Stars radius={80} depth={40} count={4000} factor={3} fade speed={0.5} />
        <Sphere args={[1, 64, 64]}>
          <meshStandardMaterial color="#123a5a" roughness={0.7} metalness={0.1} emissive="#061726" emissiveIntensity={0.25} />
        </Sphere>
        <Sphere args={[1.03, 64, 64]}>
          <meshBasicMaterial color="#38bdf8" transparent opacity={0.12} side={THREE.BackSide} />
        </Sphere>
        <OrbitShells />
        <DensityCloud debris={debris} timeOffset={timeOffset} selectedRisk={selectedRisk} />
        <OrbitControls enablePan enableZoom minDistance={2.5} maxDistance={9} autoRotate autoRotateSpeed={0.25} />
      </Canvas>

      <div className="absolute top-3 left-3 glass-panel px-3 py-2 text-xs">
        <p className="font-semibold">3D Debris Density Heatmap</p>
        <p className="text-muted-foreground">T+{timeOffset} min • {highCount} high-risk clusters</p>
      </div>
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 text-[11px]">
        <span className="glass-panel px-2 py-1"><span className="inline-block h-2 w-2 rounded-full bg-success mr-1" />Low</span>
        <span className="glass-panel px-2 py-1"><span className="inline-block h-2 w-2 rounded-full bg-warning mr-1" />Medium</span>
        <span className="glass-panel px-2 py-1"><span className="inline-block h-2 w-2 rounded-full bg-destructive mr-1" />High</span>
      </div>
    </div>
  );
};
