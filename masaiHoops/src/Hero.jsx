import React, { useState, useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from "@react-three/fiber";
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Stars, Text3D, useGLTF } from "@react-three/drei";
import { useControls } from "leva";
import { DirectionalLightHelper } from 'three';
import logo from './assets/name.png';
import kawhi from './kawhi-the-shot.gif';
import Card from './Card';
import fontJson from './fonts/cool.json'; // Path to your 3D font
import { BufferGeometry } from 'three';


// Define the function for camera animation
function animateCamera(cameraRef) {
  const startPosition = new THREE.Vector3(0, 0, 150);
  const endPosition = new THREE.Vector3(0, 0, 5);
  const duration = 5; // in seconds
  let currentTime = 0;

  function updateCamera() {
    currentTime += 1 / 60; // Assuming 60 fps

    const t = Math.min(currentTime / duration, 1);
    const newPosition = new THREE.Vector3().lerpVectors(startPosition, endPosition, t);
    cameraRef.current.position.copy(newPosition);

    if (t < 1) {
      requestAnimationFrame(updateCamera);
    }
  }

  updateCamera();
}

function Earth({ earthRef }) {
  const gltf = useGLTF('src/assets/earth.glb');
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

  useFrame((state, delta) => {
    earthRef.current.rotation.y += delta * 1.03;

  });


  return <primitive object={gltf.scene} scale={[1.1, 1.1, 1.1]} position={[20, -1.2, 0]} ref={earthRef} />;
}


function Mars() {
  const marsRef = useRef(); // Create a ref for Mars

  // Load the GLTF model for Mars
  const gltf = useGLTF('src/assets/lava_planet.glb');

  useEffect(() => {
    // Disable receiving shadows for the Mars material
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = false;
        child.material.receiveShadow = false;
        child.material.needsUpdate = true;
      }
    });
  }, [gltf]);

  useFrame((state, delta) => {
    marsRef.current.rotation.y += delta * 1.03;
  });

  return (
    <primitive
      object={gltf.scene}
      scale={[1.1, 1.1, 1.1]}
      position={[-20, -1.2, 0]}
      ref={marsRef} // Assign the ref to the Mars primitive
    />
  );
}

function Net() {
  const netRef = useRef(); // Create a ref for Mars

  // Load the GLTF model for Mars
  const gltf = useGLTF('src/assets/net.glb');

  useEffect(() => {
    // Disable receiving shadows for the Mars material
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.receiveShadow = false;
        child.material.receiveShadow = false;
        child.material.needsUpdate = true;
      }
    });
  }, [gltf]);


  return (
    <primitive
      object={gltf.scene}
      scale={[1.1, 1.1, 1.1]}
      position={[0, 38, -250]}
      ref={netRef} // Assign the ref to the Mars primitive
    />
  );
}


const Basketball = () => {
  const gltf = useGLTF('src/assets/Basketball_ball2.glb');
  const meshRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Ensure the basketball material is set to orange
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material.color.set('orange'); // Set material color to orange
      }
    });
  }, [gltf]);


  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 1.15  + isHovered ? 0.02 : 0;
  });
  return (
    <primitive
      object={gltf.scene}
      scale={[9, 9, 9]}
      ref={meshRef}
      position={[0, -3.3, 0]}
      onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
      onPointerLeave={() => setIsHovered(false)}
    />
  );
};




const Scene = () => {
  const earthLightRef = useRef();
  const ballLightRef = useRef();
  const basketBallRef = useRef();
  const textLightRef = useRef();
  const ambientLightRef = useRef();
  const earthRef = useRef();
  const earthTargetRef = useRef(new THREE.Object3D());
  const textRef = useRef(new THREE.Object3D());
  const marsRef = useRef();
  const marsLightRef = useRef();

  // const { earthLightIntensity, ballLightIntensity } = useControls({
  //   earthLightIntensity: {
  //     value: 7,
  //     min: 0,
  //     max: 20,
  //   },
  //   ballLightIntensity: {
  //     value: 9,
  //     min: 0,
  //     max: 20,
  //   }
  // });


  useEffect(() => {
    if (earthLightRef.current && earthRef.current) {
      earthLightRef.current.target = earthRef.current;
      // const earthLightHelper = new DirectionalLightHelper(earthLightRef.current);
      // earthLightRef.current.parent.add(earthLightHelper);
    }

    if (marsLightRef.current && marsRef.current) {
      marsLightRef.current.target = marsRef.current;
      // const earthLightHelper = new DirectionalLightHelper(earthLightRef.current);
      // earthLightRef.current.parent.add(earthLightHelper);
    }

    if (ballLightRef.current) {
      // const ballLightHelper = new DirectionalLightHelper(ballLightRef.current);
      // ballLightRef.current.parent.add(ballLightHelper);
    }

    if (textLightRef.current  && textRef.current) {
      textLightRef.current.target = textRef.current;
      // const textLightHelper = new DirectionalLightHelper(textLightRef.current);
      // textLightRef.current.parent.add(textLightHelper);
    }
  }, []);

  return (
    <>
      <primitive object={earthTargetRef.current} />

      {/* Ball below */}
      <directionalLight
        position={[0, -10, 0]} // Set position directly above the basketball
        intensity={0.7}
        ref={ballLightRef}
        color={"white"} // Set light color to orange
      />

      {/* Ball above */}
      <directionalLight
        position={[0, 10, 0]} // Set position directly above the basketball
        intensity={0.35}
        ref={ballLightRef}
        color={"white"} // Set light color to orange
      />

      <directionalLight
        position={[0, 10, 5]} // focus light on text
        intensity={1.5}
        ref={textLightRef}
        color={"white"} // Set light color to orange
      />

      <directionalLight
        position={[0, 10, -5]} // focus light on text
        intensity={1}
        ref={textLightRef}
        color={"orange"} // Set light color to orange
      />


      {/* Light for illuminating the Earth */}
      <directionalLight
        position={[10, 2.2, 0]}
        intensity={1.2}
        ref={earthLightRef}
        color={"white"} // Set light color to white
      />

            {/* Light for illuminating the Earth */}
        <directionalLight
        position={[10, -5, 0]}
        intensity={1.2}
        ref={earthLightRef}
        color={"white"} // Set light color to white
      />

            {/* Light for illuminating the Earth */}
            <directionalLight
        position={[10, 2.2, 0]}
        intensity={1.2}
        ref={marsLightRef}
        color={"white"} // Set light color to white
      />

            {/* Light for illuminating the Earth */}
        <directionalLight
        position={[10, -5, 0]}
        intensity={1.2}
        ref={marsRef}
        color={"white"} // Set light color to white
      />



      {/* Ambient light */}
      <ambientLight intensity={0.5} color={"orange"} ref={ambientLightRef} />
      <Basketball basketballef={basketBallRef}/>
      <Earth earthRef={earthRef} />

      <Mars />
      <Net />

      <Text3D
        font={fontJson}
        size={0.95}
        height={0.5}
        bevelEnabled={true}
        bevelThickness={0.1}
        bevelSize={0.1}
        bevelOffset={0}
        bevelSegments={8}
        position={[-2, 2.3, 0]}
        ref={textRef}
      >
        MASAI
        <meshStandardMaterial color="orange" />
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
          <div className='canvas-container extra-height' style={{ width: '100vw', height: '74vh'}}>
            <Canvas style={{ backgroundColor: '#000033' }} camera={{ position: [0, 0, 5] }}>
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
