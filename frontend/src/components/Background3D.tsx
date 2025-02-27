import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { useTheme } from '../contexts/ThemeContext';
import * as THREE from 'three';

// Animated floating spheres
const FloatingSpheres = () => {
  const { theme } = useTheme();
  const groupRef = useRef<THREE.Group>(null);
  
  // Colors based on theme
  const colors = theme === 'light' 
    ? ['#6366f1', '#8b5cf6', '#ec4899', '#f43f5e']
    : ['#4338ca', '#6d28d9', '#be185d', '#e11d48'];
    
  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = clock.getElapsedTime() * 0.1;
    }
  });

  return (
    <group ref={groupRef}>
      {Array.from({ length: 20 }).map((_, i) => {
        const radius = Math.random() * 0.3 + 0.1;
        const position = [
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <Sphere key={i} args={[radius, 16, 16]} position={position as [number, number, number]}>
            <meshStandardMaterial 
              color={color} 
              roughness={0.2} 
              metalness={0.7} 
              transparent
              opacity={0.7}
            />
          </Sphere>
        );
      })}
    </group>
  );
};

const Background3D: React.FC = () => {
  const { theme } = useTheme();
  
  return (
    <div className="fixed inset-0 z-0 opacity-60">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={theme === 'light' ? 0.5 : 0.2} />
        <pointLight position={[10, 10, 10]} intensity={theme === 'light' ? 1 : 0.8} />
        <FloatingSpheres />
        <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  );
};

export default Background3D; 