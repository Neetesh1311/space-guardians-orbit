import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface RealisticSunProps {
  position?: [number, number, number];
  size?: number;
}

/**
 * Multi-layer Sun:
 *  - core sphere with procedural noise emissive shader (animated)
 *  - inner corona (additive)
 *  - outer corona (additive, low opacity)
 *  - lens-flare-like billboard glow
 *  - point light for scene illumination
 */
export const RealisticSun = ({ position = [-15, 2, -20], size = 3 }: RealisticSunProps) => {
  const coreRef = useRef<THREE.Mesh>(null);
  const corona1Ref = useRef<THREE.Mesh>(null);
  const corona2Ref = useRef<THREE.Mesh>(null);
  const flareRef = useRef<THREE.Mesh>(null);

  // Procedural noise shader for the sun surface
  const sunMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
      },
      vertexShader: `
        varying vec3 vPos;
        varying vec3 vNormal;
        void main() {
          vPos = position;
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        varying vec3 vPos;
        varying vec3 vNormal;

        // hash + noise (cheap)
        float hash(vec3 p) { return fract(sin(dot(p, vec3(127.1,311.7,74.7))) * 43758.5453); }
        float noise(vec3 p) {
          vec3 i = floor(p); vec3 f = fract(p);
          f = f*f*(3.0-2.0*f);
          float n = mix(mix(mix(hash(i+vec3(0,0,0)), hash(i+vec3(1,0,0)), f.x),
                            mix(hash(i+vec3(0,1,0)), hash(i+vec3(1,1,0)), f.x), f.y),
                        mix(mix(hash(i+vec3(0,0,1)), hash(i+vec3(1,0,1)), f.x),
                            mix(hash(i+vec3(0,1,1)), hash(i+vec3(1,1,1)), f.x), f.y), f.z);
          return n;
        }
        float fbm(vec3 p) {
          float v = 0.0; float a = 0.5;
          for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
          return v;
        }

        void main() {
          vec3 p = normalize(vPos) * 2.0;
          float n = fbm(p + vec3(uTime * 0.15));
          float n2 = fbm(p * 3.0 - vec3(uTime * 0.3));
          float granules = pow(n2, 1.5);
          // hot core color → fiery edge
          vec3 hot = vec3(1.0, 0.95, 0.55);
          vec3 mid = vec3(1.0, 0.55, 0.1);
          vec3 cool = vec3(0.7, 0.18, 0.0);
          vec3 col = mix(cool, mid, n);
          col = mix(col, hot, granules);

          // limb darkening (fake, brighter at center)
          float fres = pow(1.0 - max(dot(vNormal, vec3(0.0,0.0,1.0)), 0.0), 2.0);
          col += hot * 0.4 * (1.0 - fres);

          gl_FragColor = vec4(col, 1.0);
        }
      `,
    });
  }, []);

  useFrame(({ clock }) => {
    sunMaterial.uniforms.uTime.value = clock.getElapsedTime();
    if (coreRef.current) coreRef.current.rotation.y += 0.0008;
    if (corona1Ref.current) corona1Ref.current.rotation.z += 0.0006;
    if (corona2Ref.current) corona2Ref.current.rotation.z -= 0.0004;
    if (flareRef.current) {
      const s = 1 + Math.sin(clock.getElapsedTime() * 1.5) * 0.04;
      flareRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={position}>
      <pointLight position={[0, 0, 0]} intensity={3} color="#ffd27a" distance={80} decay={2} />
      <pointLight position={[0, 0, 0]} intensity={1.2} color="#ff7a18" distance={40} decay={2} />

      {/* Animated core */}
      <mesh ref={coreRef}>
        <sphereGeometry args={[size, 96, 96]} />
        <primitive object={sunMaterial} attach="material" />
      </mesh>

      {/* Inner corona */}
      <mesh ref={corona1Ref}>
        <sphereGeometry args={[size * 1.15, 64, 64]} />
        <meshBasicMaterial color="#ffb347" transparent opacity={0.35} blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {/* Outer corona */}
      <mesh ref={corona2Ref}>
        <sphereGeometry args={[size * 1.4, 64, 64]} />
        <meshBasicMaterial color="#ff6b1a" transparent opacity={0.18} blending={THREE.AdditiveBlending} side={THREE.BackSide} depthWrite={false} />
      </mesh>

      {/* Diffuse halo */}
      <mesh ref={flareRef}>
        <sphereGeometry args={[size * 1.8, 32, 32]} />
        <meshBasicMaterial color="#ff4500" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  );
};
