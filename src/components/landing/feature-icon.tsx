'use client'

import { Canvas } from '@react-three/fiber'
import { Float } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'

const featureIcons: Record<string, { color: string; geo: string }> = {
  'Capture Every Lead': { color: '#4361ee', geo: 'box' },
  'Smart Follow-up Scheduler': { color: '#10b981', geo: 'ring' },
  'Status Pipeline': { color: '#a78bfa', geo: 'octahedron' },
  'Activity History': { color: '#f25f66', geo: 'sphere' },
  'Team Roles': { color: '#f59e0b', geo: 'cylinder' },
  'Secure by Design': { color: '#ef4444', geo: 'torus' },
}

function Icon3D({
  geo,
  color,
}: {
  geo: string
  color: string
}) {
  const meshRef = useRef<THREE.Mesh>(null!)

  return (
    <Float speed={1.5} rotationIntensity={0.4} floatIntensity={0.4}>
      <mesh ref={meshRef}>
        {geo === 'box' && <boxGeometry args={[0.8, 0.8, 0.8]} />}
        {geo === 'ring' && <ringGeometry args={[0.3, 0.4, 32]} />}
        {geo === 'octahedron' && <octahedronGeometry args={[0.7]} />}
        {geo === 'sphere' && <sphereGeometry args={[0.5, 32, 32]} />}
        {geo === 'cylinder' && <cylinderGeometry args={[0.3, 0.3, 0.8, 32]} />}
        {geo === 'torus' && <torusGeometry args={[0.4, 0.15, 16, 100]} />}
        <meshStandardMaterial
          color={color}
          metalness={0.4}
          roughness={0.2}
          emissive={color}
          emissiveIntensity={0.2}
          transparent
          opacity={0.9}
        />
      </mesh>
    </Float>
  )
}

export default function FeatureIcon3D({
  title,
}: {
  title: string
}) {
  const config = featureIcons[title] || { color: '#4361ee', geo: 'sphere' }

  return (
    <div className="relative mx-auto mb-6 h-24 w-24">
      <Canvas
        camera={{ position: [0, 0, 2.5], fov: 45 }}
        gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true }}
        className="h-full w-full"
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-3, -3, 3]} intensity={0.5} color={config.color} />
        <Icon3D geo={config.geo} color={config.color} />
      </Canvas>
    </div>
  )
}
