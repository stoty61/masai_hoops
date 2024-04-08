import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Canvas } from "@react-three/fiber"
import { useFrame } from '@react-three/fiber';

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


const Sphere = ({position, size, color}) => {

  const ref = useRef() 

  const [isHovered, setIsHovered] = useState(false);

  useFrame((state, delta) => {
    ref.current.rotation.y += delta * 0.2
  })

  return ( 
    <mesh position={position} ref={ref}>
      <sphereGeometry args={size}/>
      <meshStandardMaterial color={color} wireframe/> 
    </mesh>
  )



}

function Hero() {

  return (
    <Canvas>
      <directionalLight position={[2,2,2]}/>
      <ambientLight intensity={0.1} />

      {/* <group position={[0, 1, 0]}>
        <Cube position={[1,-1,0]} color={"green"} size={[1,1,1]}/>
        <Cube position={[-1,-1,0]} color={"red"} size={[1,1,1]}/>
        <Cube position={[-1,1,0]} color={"yellow"} size={[1,1,1]}/>
        <Cube position={[1,1,0]} color={"blue"} size={[1,1,1]}/>
      </group>  */}

      {/* <Cube position={[0, 0, 0]} size={[1,1,1]} color={"orange"} />  */}

      <Sphere position={[0,0,0]} color={"orange"}/> 

    </Canvas>
  );
}

export default Hero;
