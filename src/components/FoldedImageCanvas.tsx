'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useRef, useState, useEffect, useMemo } from 'react';

const FoldedPlane = ({ image, progress }: { image: string; progress: number }) => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const texture = useMemo(() => new THREE.TextureLoader().load(image), [image]);

  useFrame(() => {
    if (!meshRef.current) return;

    const geometry = meshRef.current.geometry as THREE.PlaneGeometry;
    const pos = geometry.attributes.position;

    const radius = 0.5;
    const foldStartX = 1.5;
    const foldStartY = -1.0;
    const foldArea = 1.5;
    const maxTheta = Math.PI / 2 * progress;

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i);

      if (x > foldStartX && y < foldStartY) {
        const dx = x - foldStartX;
        const dy = foldStartY - y;
        const d = Math.sqrt(dx * dx + dy * dy);
        const t = Math.min(d / foldArea, 1);

        const theta = t * maxTheta;
        const curvedX = radius * Math.sin(theta);
        const curvedZ = radius * (1 - Math.cos(theta));

        pos.setX(i, foldStartX + curvedX * (dx / (d + 0.001)));
        pos.setZ(i, curvedZ);
      } else {
        pos.setZ(i, 0);
      }
    }

    pos.needsUpdate = true;
  });

  return (
    <mesh ref={meshRef}>
      <planeGeometry args={[5, 3, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
};

const FoldedImageCanvas = ({ image }: { image: string }) => {
  const [hovered, setHovered] = useState(false);
  const progressRef = useRef(0);
  const [progress, setProgress] = useState(0);

  const lerpProgress = () => {
    const target = hovered ? 1 : 0;
    progressRef.current = THREE.MathUtils.lerp(progressRef.current, target, 0.05);
    setProgress(progressRef.current);
  };

  return (
    <div
      style={{ width: '100%', height: '100%' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Canvas camera={{ position: [0, 0, 6] }}>
        <ambientLight />
        <LerpUpdater onUpdate={lerpProgress} />
        <FoldedPlane image={image} progress={progress} />
      </Canvas>
    </div>
  );
};

const LerpUpdater = ({ onUpdate }: { onUpdate: () => void }) => {
  useFrame(() => onUpdate());
  return null;
};

export default FoldedImageCanvas;
