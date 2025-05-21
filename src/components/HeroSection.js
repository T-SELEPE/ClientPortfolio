import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useTexture, Html, Text } from '@react-three/drei';
import styled from 'styled-components';

// Styled wrapper for the hero section
const HeroWrapper = styled.div`
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background: #111;
`;

// The image is placed as a background
const HeroImage = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  object-fit: cover;
  z-index: 1;
  filter: brightness(0.3);
  transition: filter 0.3s;
`;

// Overlay for dynamic lighting
const LightingOverlay = styled.canvas`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 2;
  pointer-events: none;
`;

// Canvas for 3D lightbulb
const BulbCanvas = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 3;
  pointer-events: none;
`;

// Add this styled component for the overlay text
const ReflectionText = styled.div`
  position: absolute;
  top: 28vh;
  left: 0;
  width: 100vw;
  text-align: center;
  pointer-events: none;
  z-index: 4;
  font-size: 2.2rem;
  font-weight: bold;
  color: #111;
  font-family: 'Poppins', sans-serif;
  text-shadow: 0 0 18px #fffbe6, 0 0 32px #fffbe6, 0 0 48px #fffbe6;
  opacity: 0.92;
  transition: left 0.2s, filter 0.2s;
  will-change: left, filter;
`;

// 3D Lightbulb component
function LightBulb({ swing = true, onLightMove }) {
  const bulbRef = useRef();
  const stringRef = useRef();
  // Animate the swinging
  useFrame(({ clock }) => {
    if (bulbRef.current && swing) {
      // Swing from -0.7 to 0.7 radians
      const t = clock.getElapsedTime();
      const angle = Math.sin(t * 1.2) * 0.7;
      bulbRef.current.position.x = Math.sin(angle) * 2.5;
      bulbRef.current.position.y = -1 + Math.abs(Math.cos(angle)) * 0.2;
      bulbRef.current.rotation.z = angle;
      if (onLightMove) {
        // Map x from -2.5 to 2.5 to 0 to 1
        onLightMove((bulbRef.current.position.x + 2.5) / 5);
      }
      if (stringRef.current) {
        stringRef.current.position.x = bulbRef.current.position.x;
        stringRef.current.rotation.z = angle;
      }
    }
  });
  return (
    <group>
      {/* String */}
      <mesh ref={stringRef} position={[0, 2, 0]}>
        <cylinderGeometry args={[0.025, 0.025, 3.2, 16]} />
        <meshStandardMaterial color="#aaa" />
      </mesh>
      {/* Bulb */}
      <group ref={bulbRef} position={[0, -1, 0]}>
        {/* Bulb glass */}
        <mesh castShadow receiveShadow>
          <sphereGeometry args={[0.25, 32, 32]} />
          <meshPhysicalMaterial
            color="#fffbe6"
            transmission={0.95}
            roughness={0.1}
            thickness={0.2}
            ior={1.5}
            clearcoat={1}
            clearcoatRoughness={0.1}
            opacity={0.85}
            transparent
          />
        </mesh>
      
        {/* Bulb base */}
        <mesh position={[0, -0.32, 0]}>
          <cylinderGeometry args={[0.09, 0.11, 0.18, 16]} />
          <meshStandardMaterial color="#888" metalness={0.7} roughness={0.3} />
        </mesh>
        {/* Light source */}
        <pointLight
          position={[0, 0, 0]}
          intensity={2.5}
          distance={5}
          color="#fffbe6"
          castShadow
        />
      </group>
    </group>
  );
}

// Main HeroSection
export default function HeroSection() {
  // We'll use a canvas overlay for the lighting effect
  const overlayRef = React.useRef();
  const [lightX, setLightX] = React.useState(0.5); // 0 (left) to 1 (right)

  // Draw the lighting effect on the overlay canvas
  React.useEffect(() => {
    const canvas = overlayRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w;
    canvas.height = h;
    ctx.clearRect(0, 0, w, h);
    // Draw a radial gradient for the light
    const bulbX = w * (0.18 + 0.64 * lightX); // keep bulb in center 64% of width
    const bulbY = h * 0.32;
    const grad = ctx.createRadialGradient(bulbX, bulbY, 60, bulbX, bulbY, 350);
    grad.addColorStop(0, 'rgba(255,250,220,0.95)');
    grad.addColorStop(0.18, 'rgba(255,250,220,0.7)');
    grad.addColorStop(0.32, 'rgba(255,250,220,0.25)');
    grad.addColorStop(0.5, 'rgba(76, 72, 72, 0.7)');
    grad.addColorStop(1, 'rgba(0,0,0,0.98)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  }, [lightX]);

  // Calculate the horizontal position for the text based on lightX
  const [windowWidth, setWindowWidth] = React.useState(window.innerWidth);
  React.useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const textX = windowWidth * (0.18 + 0.64 * lightX) - windowWidth * 0.5;

  return (
    <HeroWrapper>
      <HeroImage src={process.env.PUBLIC_URL + '/thando5.jpg'} alt="Thando" />
      <LightingOverlay ref={overlayRef} />
      <ReflectionText style={{ transform: `translateX(${textX}px)` }}>
        I am Thando Mtungwa
      </ReflectionText>
      <BulbCanvas>
        <Canvas
          shadows
          camera={{ position: [0, 0.5, 4.5], fov: 40 }}
          style={{ width: '100vw', height: '100vh', background: 'transparent' }}
        >
          <ambientLight intensity={0.15} />
          <LightBulb swing={true} onLightMove={setLightX} />
        </Canvas>
      </BulbCanvas>
    </HeroWrapper>
  );
} 