'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars, Float, Environment } from '@react-three/drei'
import * as THREE from 'three'

// ─── Floating Orb ────────────────────────────────────────────────────────────

interface OrbProps {
  position: [number, number, number]
  color: string
  size: number
  speed: number
}

function FloatingOrb({ position, color, size, speed }: OrbProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * speed * 0.3
      meshRef.current.rotation.y += delta * speed * 0.2
    }
  })

  return (
    <Float floatIntensity={1.5} rotationIntensity={0.5} speed={speed}>
      <mesh ref={meshRef} position={position}>
        <sphereGeometry args={[size, 64, 64]} />
        <meshStandardMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.3}
          roughness={0}
          metalness={0.8}
          transparent
          opacity={0.85}
        />
      </mesh>
    </Float>
  )
}

// ─── Rotating Ring ────────────────────────────────────────────────────────────

interface RingProps {
  radius: number
  color: string
  thickness: number
}

function RotatingRing({ radius, color, thickness }: RingProps) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += delta * 0.15
      meshRef.current.rotation.y += delta * 0.08
    }
  })

  return (
    <mesh ref={meshRef}>
      <torusGeometry args={[radius, thickness, 16, 120]} />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.5}
        roughness={0.1}
        metalness={0.9}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

// ─── Particle Field ───────────────────────────────────────────────────────────

function ParticleField() {
  const pointsRef = useRef<THREE.Points>(null)

  const geometry = new THREE.BufferGeometry()
  const count = 200
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 20
    positions[i * 3 + 1] = (Math.random() - 0.5) * 20
    positions[i * 3 + 2] = (Math.random() - 0.5) * 20
  }
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.03
      pointsRef.current.rotation.x += delta * 0.01
    }
  })

  return (
    <points ref={pointsRef} geometry={geometry}>
      <pointsMaterial
        color="#7aaeff"
        size={0.06}
        sizeAttenuation
        transparent
        opacity={0.8}
      />
    </points>
  )
}

// ─── Main Scene ───────────────────────────────────────────────────────────────

export default function Scene3D() {
  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        onCreated={({ scene }) => {
          scene.background = new THREE.Color('#050810')
        }}
      >
        <Suspense fallback={null}>
          {/* Lighting */}
          <ambientLight intensity={0.3} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <pointLight position={[-10, -10, -10]} intensity={0.5} color="#375BD2" />

          {/* Stars */}
          <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade />

          {/* Floating Orbs */}
          <FloatingOrb position={[2,  1,  0]} color="#375BD2" size={1.5} speed={1}   />
          <FloatingOrb position={[-2, -1, 1]} color="#00e5b0" size={1}   speed={1.5} />
          <FloatingOrb position={[0,  2, -1]} color="#5b7fe8" size={0.7} speed={2}   />

          {/* Rotating Rings */}
          <RotatingRing radius={3} color="#375BD2" thickness={0.05} />
          <RotatingRing radius={4} color="#00e5b0" thickness={0.03} />

          {/* Particles */}
          <ParticleField />

          {/* Environment */}
          <Environment preset="city" />
        </Suspense>
      </Canvas>
    </div>
  )
}