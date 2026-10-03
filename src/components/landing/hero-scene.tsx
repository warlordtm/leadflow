'use client'

import { Canvas, useFrame } from '@react-three/fiber'
import { Float, OrbitControls } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'

function AnimatedGroup({
  position,
  rotation,
  scale = 1,
  color = '#4361ee',
  geometry = 'box',
}: {
  position: [number, number, number]
  rotation?: [number, number, number]
  scale?: number
  color?: string
  geometry?: 'box' | 'sphere' | 'cylinder' | 'octahedron'
}) {
  const groupRef = useRef<THREE.Group>(null!)

  useFrame((state) => {
    if (!groupRef.current) return
    groupRef.current.rotation.x = state.clock.elapsedTime * 0.2
    groupRef.current.rotation.y = state.clock.elapsedTime * 0.3
  })

  const geometryEl = (() => {
    switch (geometry) {
      case 'box':
        return <boxGeometry args={[0.8, 0.8, 0.8]} />
      case 'sphere':
        return <sphereGeometry args={[0.5, 32, 32]} />
      case 'cylinder':
        return <cylinderGeometry args={[0.3, 0.3, 1.2, 32]} />
      case 'octahedron':
        return <octahedronGeometry args={[0.5]} />
      default:
        return <boxGeometry args={[0.8, 0.8, 0.8]} />
    }
  })()

  return (
    <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4}>
        <mesh>
          {geometryEl}
          <meshStandardMaterial
            color={color}
            metalness={0.4}
            roughness={0.2}
            transparent
            opacity={0.85}
            emissive={color}
            emissiveIntensity={0.15}
          />
        </mesh>
      </Float>
    </group>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['transparent']} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} />
      <pointLight position={[-5, -5, 5]} intensity={0.4} color="#4361ee" />
      <pointLight position={[5, 5, 5]} intensity={0.4} color="#f25f66" />

      <AnimatedGroup
        position={[-2.5, 0.5, 0]}
        color="#4361ee"
        geometry="box"
      />

      <AnimatedGroup
        position={[2.5, -0.3, 1.5]}
        color="#10b981"
        geometry="cylinder"
      />

      <AnimatedGroup
        position={[0, -1.2, -0.5]}
        color="#a78bfa"
        geometry="sphere"
      />

      <AnimatedGroup
        position={[-2, -1.5, 0.5]}
        color="#f25f66"
        geometry="octahedron"
      />

      <AnimatedGroup
        position={[3, 1, 0]}
        color="#4361ee"
        geometry="box"
        scale={0.6}
      />
    </>
  )
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 50 }}
      gl={{ antialias: true, alpha: true }}
      className="absolute inset-0 -z-10 h-full w-full"
      style={{ height: '100vh' }}
    >
      <Scene />
    </Canvas>
  )
}
