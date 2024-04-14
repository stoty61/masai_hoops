import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from "@react-three/fiber"
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useHelper } from "@react-three/drei"
import { useControls } from "leva"
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import logo from './assets/name.png';
import kawhi from './kawhi-the-shot.gif';
import Card from './Card';


const Cube = ({position, size, color}) => {

    const ref = useRef() 
    useFrame((state, delta) => {
      ref.current.rotation.x += delta;
      ref.current.rotation.y += delta;
      ref.current.rotation.z += delta;

      ref.current.position.z = Math.sin(state.clock.elapsedTime) * 2;

      

    })
    return ( 
      <mesh position={position} ref={ref}>
        <boxGeometry args={size}/>
        <meshStandardMaterial color={color}/> 
      </mesh>
    )
}

const Basketball = () => {
  const gltf = useLoader(GLTFLoader, 'src/assets/Basketball_ball2.glb');
  const meshRef = useRef();

  const [isHovered, setIsHovered] = useState(false);

  useFrame((state, delta) => {

      meshRef.current.rotation.y += delta * 1.15;
      meshRef.current.rotation.y += isHovered ? 0.02 : 0;
      
    
  });

  return <primitive 
  object={gltf.scene} 
  scale={[20,20,20]}
  ref={meshRef}
  position={[0,-2,0]}
  onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
  onPointerLeave={() => setIsHovered(false)}
  />;
};


const Sphere = ({position, size, color}) => {

  const ref = useRef() 

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.2
  })

  return ( 
    <mesh position={position} ref={ref} 
    onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
    onPointerLeave={() => setIsHovered(false)}
    onClick={() => setIsClicked(!isClicked)}
    scale={isClicked ? 1.5: 1}
    >
      <sphereGeometry args={size}/>
      <meshStandardMaterial color={isHovered ? color : "blue"} wireframe/> 
    </mesh>
  )

}

const Scene = () => {

  const directionalLightRef = useRef()

  const {dLightColor, dLightIntensity} = useControls({
    dLightColor: "orange",
    dLightIntensity: {
      value: 1,
      min: 0,
      max: 2
    }
  })

  const ambientLightRef = useRef()

  const {aLightColor, aLightIntensity} = useControls({
    aLightColor: "orange",
    aLightIntensity: {
      value: 0.5,
      min: 0,
      max: 5
    }
  })


  // useHelper(directionalLightRef, THREE.DirectionalLightHelper, 0.5, "black")


  return (
    <>
      <directionalLight 
      position={[2,2,2]}
      intensity={dLightIntensity}
      ref={directionalLightRef}
      color={dLightColor}/>
      
      <ambientLight intensity={aLightIntensity} color={aLightColor}
      ref={ambientLightRef}/>

      {/* <Sphere position={[0,0,0]} color={"orange"}/>  */}
      <Basketball />
      <OrbitControls enabled={false}/>
    </>
  );

}

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
      <div className='d-flex justify-content-center align-items-center mt-4'>
          <img src={logo} height="50" alt="Logo" />
      </div>

      { !kawhiDone && (
        <div className='d-flex justify-content-center align-items-center mt-4'>
            <img src={kawhi} height="500" alt="Kawhi" />
        </div> 
        )
      } 

      { kawhiDone && 
      (
      <>
      <div className='canvas-container'>
        <Canvas>
          <Scene />
        </Canvas> 
        <Card />
      </div>
      </>
      )
      }
    </>
  );
}

export default Hero;
