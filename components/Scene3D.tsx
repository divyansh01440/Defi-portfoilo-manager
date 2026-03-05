'use client'

// CSS-only animated background — no Three.js dependency
// Replaces the Three.js Scene3D to fix Vercel build errors

export default function Scene3D() {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden',
      background: '#050810',
    }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(55,91,210,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(55,91,210,0.04) 1px, transparent 1px)',
        backgroundSize: '48px 48px',
      }} />

      {/* Orb 1 */}
      <div style={{
        position: 'absolute', top: '15%', left: '20%',
        width: 500, height: 500, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(55,91,210,0.12) 0%, transparent 70%)',
        animation: 's3d-float1 9s ease-in-out infinite',
      }} />

      {/* Orb 2 */}
      <div style={{
        position: 'absolute', top: '40%', right: '10%',
        width: 400, height: 400, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0,229,176,0.08) 0%, transparent 70%)',
        animation: 's3d-float2 11s ease-in-out infinite',
      }} />

      {/* Orb 3 */}
      <div style={{
        position: 'absolute', bottom: '10%', left: '40%',
        width: 300, height: 300, borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(91,127,232,0.1) 0%, transparent 70%)',
        animation: 's3d-float3 7s ease-in-out infinite',
      }} />

      <style suppressHydrationWarning>{`
        @keyframes s3d-float1 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(30px,-40px)} }
        @keyframes s3d-float2 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(-30px,30px)} }
        @keyframes s3d-float3 { 0%,100%{transform:translate(0,0)} 50%{transform:translate(20px,-20px)} }
      `}</style>
    </div>
  )
}