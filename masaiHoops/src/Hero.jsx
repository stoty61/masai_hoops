import React, { useState, useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from "@react-three/fiber";
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text3D, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import logo from './assets/name.png';
import kawhi from './kawhi-the-shot.gif';
import Card from './Card';
import fontJson from './fonts/cool.json'; // Path to your 3D font

const Cube = ({ position, size, color }) => {
  const ref = useRef();
  useFrame((state, delta) => {
    ref.current.rotation.x += delta;
    ref.current.rotation.y += delta;
    ref.current.rotation.z += delta;
    ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2;
  });
  return (
    <mesh position={position} ref={ref}>
      <boxGeometry args={size} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

function Earth() {
  const gltf = useGLTF('src/assets/earth.glb');
  const meshRef = useRef();
  useEffect(() => {
    // Disable receiving shadows for the Earth material
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = false; // Ensure shadows are not received
        child.material.receiveShadow = false;
        child.material.needsUpdate = true;
      }
    });
  }, [gltf]);
  return <primitive object={gltf.scene} scale={[1.1, 1.1, 1.1]} position={[20, -1.2, 0]} ref={meshRef} />;
}


const Basketball = () => {
  const gltf = useGLTF('src/assets/Basketball_ball2.glb');
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 1.15;
    meshRef.current.rotation.y += isHovered ? 0.02 : 0;
  });
  return (
    <primitive
      object={gltf.scene}
      scale={[10, 10, 10]}
      ref={meshRef}
      position={[0, -2.5, 0]}
      onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
      onPointerLeave={() => setIsHovered(false)}
    />
  );
};

const Scene = () => {
  const earthLightRef = useRef();
  const ballLightRef = useRef();
  const ballLightRef2 = useRef();
  const ambientLightRef = useRef();

  const { earthLightIntensity, ballLightIntensity } = useControls({
    earthLightIntensity: {
      value: 10,
      min: 0,
      max: 20,
    },
    ballLightIntensity: {
      value: 10,
      min: 0,
      max: 20,
    },
  });

  return (
    <>
      {/* Light for illuminating the Earth */}
      <directionalLight
        position={[-10, -10, -10]}
        intensity={earthLightIntensity}
        ref={earthLightRef}
        color={"white"} // Set light color to white
      />
      {/* Light for illuminating the basketball */}
      <directionalLight
        position={[10, 10, 10]}
        intensity={ballLightIntensity}
        ref={ballLightRef}
        color={"orange"} // Set light color to orange
      />

            {/* Light for illuminating the basketball */}
        <directionalLight
        position={[-10, -10, -10]}
        intensity={ballLightIntensity}
        ref={ballLightRef2}
        color={"orange"} // Set light color to orange
      />


      {/* Ambient light */}
      <ambientLight intensity={0.5} color={"orange"} ref={ambientLightRef} />
      <Basketball />
      <Earth />
      <Text3D
        font={fontJson}
        size={1}
        height={0.5}
        bevelEnabled={true}
        bevelThickness={0.1}
        bevelSize={0.1}
        bevelOffset={0}
        bevelSegments={8}
        position={[-2.2, 1.8, 0]}
      >
        MASAI
        <meshStandardMaterial color="white" />
      </Text3D>
      <Stars
        radius={100}
        depth={50}
        count={5000}
        factor={8}
        saturation={0}
        fade
      />
      <OrbitControls
        enableZoom={true}
        enablePan={false}
        maxPolarAngle={Math.PI / 2}
        minPolarAngle={Math.PI / 2}
      />
    </>
  );
};


function Hero() {
  const [kawhiDone, setKawhiDone] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setKawhiDone(true);
    }, 5400);

    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <>
      {false && (
        <div className='d-flex justify-content-center align-items-center mt-4'>
          <img src={kawhi} height="500" alt="Kawhi" />
        </div>
      )}
      {true && (
        <>
          <div className='canvas-container extra-height'>
            <Canvas style={{ width: '100%', height: '150%', backgroundColor: '#000033' }}>
              <Suspense fallback={null}>
                <Scene />
              </Suspense>
            </Canvas>
            <Card />
          </div>
        </>
      )}
    </>
  );
}

export default Hero;
