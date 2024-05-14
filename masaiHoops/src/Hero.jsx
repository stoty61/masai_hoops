import React, { useState, useEffect, useRef, Suspense } from 'react';
import * as THREE from 'three';
import { Canvas } from "@react-three/fiber"
import { useFrame } from '@react-three/fiber';
import { OrbitControls, useHelper, Stars, Html, Text3D, useGLTF  } from "@react-three/drei"
import { useControls } from "leva"
import { useLoader } from '@react-three/fiber';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import logo from './assets/name.png';
import kawhi from './kawhi-the-shot.gif';
import Card from './Card';
import fontJson from './fonts/cool.json'; // Path to your 3D font
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader';

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
function Model({ url }) {
  const fbx = useLoader(FBXLoader, "src/assets/earth_tut.fbx");
  return <primitive object={fbx} 
  scale={[10,10,10]}
  />;
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
  scale={[10,10,10]}
  ref={meshRef}
  position={[0,-2.5, 0]}
  onPointerEnter={(event) => (event.stopPropagation(), setIsHovered(true))}
  onPointerLeave={() => setIsHovered(false)}
  />;
};

// hello 
const Earth = () => {
  const gltf = useLoader(FBXLoader, "src/assets/earth_tut.fbx");

  return <primitive 
  object={gltf.scene} 
  scale={[2,2,2]}
  position={[0,1, 0]}
  />;
};


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
      position={[-2,-2,-2]}
      intensity={dLightIntensity}
      ref={directionalLightRef}
      color={dLightColor}/>

<directionalLight 
      position={[2,2,2]}
      intensity={dLightIntensity}
      ref={directionalLightRef}
      color={dLightColor}/>   
      
      <ambientLight intensity={aLightIntensity} color={aLightColor}
      ref={ambientLightRef}/>

      {/* <Sphere position={[0,0,0]} color={"orange"}/>  */}
    
      <Basketball />

          {/* Add the Earth model to the right of the basketball */}
          <Model /> 

      <Text3D
              font={fontJson} // Load the 3D font
              size={1}        // Adjust size
              height={0.5}    // Extrusion depth
              bevelEnabled={true} // Add a bevel for a smoother look
              bevelThickness={0.1} // Bevel thickness
              bevelSize={0.1}      // Bevel size
              bevelOffset={0}      // Bevel offset
              bevelSegments={8}    // Number of bevel segments
              position={[-2.2, 1.8, 0]} // Adjust position
            >
              MASAI
              {/* Material for the text */}
              <meshStandardMaterial color="white" />
      </Text3D>

        
      {/* Create a starry background */}
      <Stars
        radius={100} // Radius of the starry sphere
        depth={50}   // Depth into which stars appear
        count={5000} // Number of stars
        factor={8}   // Star intensity and size factor
        saturation={0} // Grayscale
        fade // If you want a fading effect towards the edges
      />



    <OrbitControls
        enableZoom={true}   // Disable zooming
        enablePan={false}    // Disable panning
        maxPolarAngle={Math.PI / 2} // Limit vertical rotation to horizontal plane
        minPolarAngle={Math.PI / 2} // Limit vertical rotation to horizontal plane
      />


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


      { false && (
        <div className='d-flex justify-content-center align-items-center mt-4'>
            <img src={kawhi} height="500" alt="Kawhi" />
        </div> 
        )
      } 

      { true && 
      (
      <>
      <div className='canvas-container extra-height'>
        <Canvas style={{  width: '100%', height: '150%', backgroundColor: '#000033' }}>
    
          <Suspense fallback={null}>
            <Scene />
                    {/* Static text within the Canvas */}
                                {/* Render 3D bubble text */}

          </Suspense>
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
