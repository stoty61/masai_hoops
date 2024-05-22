import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

const LineConnectingObjects = ({ object1, object2 }) => {
  const lineRef = useRef();
  const { camera } = useThree();

  useEffect(() => {
    lineRef.current.computeLineDistances(); // Ensure the line is dashed
  }, []);

  useFrame(() => {
    if (lineRef.current) {
      const pos1 = new THREE.Vector3();
      const pos2 = new THREE.Vector3();

      object1.getWorldPosition(pos1);
      object2.getWorldPosition(pos2);

      lineRef.current.geometry.vertices[0].copy(pos1);
      lineRef.current.geometry.vertices[1].copy(pos2);
      lineRef.current.geometry.verticesNeedUpdate = true;
    }
  });

  return (
    <line ref={lineRef}>
      <bufferGeometry attach="geometry">
        <bufferAttribute
          attachObject={['attributes', 'position']}
          count={2}
          array={new Float32Array([0, 0, 0, 0, 0, 0])}
          itemSize={3}
        />
      </bufferGeometry>
      <lineBasicMaterial attach="material" color="white" />
    </line>
  );
};

export default LineConnectingObjects;
