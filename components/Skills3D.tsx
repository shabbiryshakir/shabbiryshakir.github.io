"use client";

import { Text } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const skills = [
  "Premiere Pro", 
  "Illustrator", 
  "After Effects", 
  "Photoshop", 
  "Web Design", 
  "Photography"
];

export default function Skills3D() {
  const groupRef = useRef<THREE.Group>(null);

// Inside components/Skills3D.tsx
  useFrame((state, delta) => {
    if (groupRef.current) {
      // Normal rotation
      groupRef.current.rotation.y += delta * 0.15;
      
      // SCROLL MAGIC: Tilts the ring as you scroll down
      const scrollY = window.scrollY;
      groupRef.current.rotation.x = scrollY * 0.001;
      groupRef.current.position.y = scrollY * 0.002;
    }
  });

  return (
    // We position the ring at the exact same spot as your Glowing Sphere [3, 0, -3]
    <group ref={groupRef} position={[3, 0, -3]}>
      {skills.map((skill, i) => {
        // Some math to arrange the text in a perfect circle
        const angle = (i / skills.length) * Math.PI * 2;
        const radius = 3.8; // How wide the ring is
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <Text
            key={i}
            position={[x, 0, z]}
            // This rotation math makes the text always face outward from the circle
            rotation={[0, -angle + Math.PI / 2, 0]} 
            fontSize={0.25}
            color="#4da6ff"
            anchorX="center"
            anchorY="middle"
            fillOpacity={0.8}
          >
            {skill.toUpperCase()}
          </Text>
        );
      })}
    </group>
  );
}