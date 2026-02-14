import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, Text, ContactShadows, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { getMoodColor } from '@/lib/mood-mapping';

interface MirrorSceneProps {
  mood?: string;
  intensity?: number;
}

function AmbientOrb({ color, position, speed = 1 }: { color: string; position: [number, number, number]; speed?: number }) {
  const mesh = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (mesh.current) {
      const t = state.clock.getElapsedTime() * speed;
      mesh.current.position.y = position[1] + Math.sin(t) * 0.2;
      mesh.current.rotation.x = t * 0.2;
      mesh.current.rotation.z = t * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Sphere args={[1.5, 64, 64]} position={position} ref={mesh}>
        <MeshDistortMaterial
          color={color}
          envMapIntensity={0.4}
          clearcoat={0.8}
          clearcoatRoughness={0}
          metalness={0.1}
          distort={0.4}
          speed={2}
        />
      </Sphere>
    </Float>
  );
}

function Particles({ count = 50, color }: { count?: number; color: string }) {
  const points = useMemo(() => {
    const p = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      p[i * 3] = (Math.random() - 0.5) * 10;
      p[i * 3 + 1] = (Math.random() - 0.5) * 10;
      p[i * 3 + 2] = (Math.random() - 0.5) * 5;
    }
    return p;
  }, [count]);

  return (
    <points>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={points.length / 3}
          array={points}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color={color}
        sizeAttenuation
        transparent
        opacity={0.6}
      />
    </points>
  );
}

export function MirrorScene({ mood = "neutral" }: MirrorSceneProps) {
  const moodColor = getMoodColor(mood);

  return (
    <div className="absolute inset-0 -z-10 bg-gradient-to-b from-gray-50 to-white">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color={moodColor} />
        <spotLight position={[-10, -10, -10]} intensity={0.5} />
        
        <Environment preset="studio" />

        {/* The central 'Mirror' orbs representing mood */}
        <group position={[0, 0, 0]}>
          <AmbientOrb color={moodColor} position={[0, 0, 0]} />
          <AmbientOrb color="#ffffff" position={[-2, 1, -2]} speed={0.8} />
          <AmbientOrb color={moodColor} position={[2, -1, -2]} speed={1.2} />
        </group>

        <Particles color={moodColor} count={100} />

        <ContactShadows
          resolution={1024}
          scale={20}
          blur={2}
          opacity={0.25}
          far={10}
          color="#000000"
        />
      </Canvas>
      
      {/* Overlay gradient for UI readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-white/50 pointer-events-none" />
    </div>
  );
}
