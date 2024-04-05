import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import Sphere from './Sphere';
import { Canvas } from "@react-three/fiber"

const Cube = ({position, size, color}) => {
    return ( 
      <mesh position={position}>
        <boxGeometry args={size}/>
        <meshStandardMaterial color={color}/> 
      </mesh>
    )
}

function Hero() {

  return (
    <Canvas>
      <directionalLight position={[2,2,2]}/>
      <ambientLight intensity={0.1} />

      <group position={[0, 1, 0]}>
        <Cube position={[1,-1,0]} color={"green"} size={[1,1,1]}/>
        <Cube position={[-1,-1,0]} color={"red"} size={[1,1,1]}/>
        <Cube position={[-1,1,0]} color={"yellow"} size={[1,1,1]}/>
        <Cube position={[1,1,0]} color={"blue"} size={[1,1,1]}/>
      </group> 

    </Canvas>
  );
}

export default Hero;
