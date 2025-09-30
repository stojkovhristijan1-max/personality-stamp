'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 relative cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-950/20 to-black/50 pointer-events-none"></div>
      
      <div className="text-center max-w-3xl mx-auto relative z-10 animate-fade-in">
        {/* Floating decorative elements */}
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse-glow"></div>
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl animate-pulse-glow" style={{animationDelay: '1s'}}></div>
        
        {/* Main heading with neon effect */}
        <div className="mb-8 relative">
          <h1 className="text-6xl md:text-7xl font-bold mb-6 neon-text tracking-wider uppercase" style={{fontFamily: 'Orbitron, sans-serif'}}>
            Discover Your
          </h1>
          <h1 className="text-7xl md:text-8xl font-black neon-text tracking-wider uppercase holographic animate-float" style={{fontFamily: 'Orbitron, sans-serif'}}>
            Personality
          </h1>
          <h1 className="text-6xl md:text-7xl font-bold neon-text tracking-wider uppercase" style={{fontFamily: 'Orbitron, sans-serif'}}>
            Stamp
          </h1>
        </div>

        {/* Subtitle with cyber styling */}
        <div className="mb-12 relative">
          <div className="inline-block neon-border rounded-lg px-6 py-4 bg-black/50 backdrop-blur-sm">
            <p className="text-xl md:text-2xl text-cyan-200 font-light tracking-wide" style={{fontFamily: 'Rajdhani, sans-serif'}}>
              <span className="text-blue-400 font-semibold">///</span> Take the test, get your personality type,
            </p>
            <p className="text-xl md:text-2xl text-cyan-200 font-light tracking-wide" style={{fontFamily: 'Rajdhani, sans-serif'}}>
              and generate your <span className="neon-text font-bold">DIGITAL ID</span>
            </p>
          </div>
        </div>

        {/* Cyber button */}
        <button 
          onClick={() => router.push('/personal-info')}
          className="cyber-button font-bold py-5 px-12 rounded-lg text-xl transition-all duration-300 transform hover:scale-110 uppercase tracking-widest relative overflow-hidden group"
          style={{fontFamily: 'Orbitron, sans-serif'}}
        >
          <span className="relative z-10 flex items-center gap-3">
            <span className="text-2xl animate-pulse">▶</span>
            Get Your Personality Stamp
            <span className="text-2xl animate-pulse">◀</span>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-400/50 to-blue-600/0 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
        </button>

        {/* Decorative tech elements */}
        <div className="mt-16 flex justify-center gap-8 text-cyan-400/50 text-sm font-mono">
          <div className="animate-pulse">[SYSTEM:ONLINE]</div>
          <div className="animate-pulse" style={{animationDelay: '0.5s'}}>[STATUS:READY]</div>
          <div className="animate-pulse" style={{animationDelay: '1s'}}>[ID:GEN_v2.0]</div>
        </div>

        {/* Corner brackets decoration */}
        <div className="absolute top-0 left-0 w-20 h-20 border-l-4 border-t-4 border-cyan-500/50"></div>
        <div className="absolute top-0 right-0 w-20 h-20 border-r-4 border-t-4 border-cyan-500/50"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 border-l-4 border-b-4 border-cyan-500/50"></div>
        <div className="absolute bottom-0 right-0 w-20 h-20 border-r-4 border-b-4 border-cyan-500/50"></div>
      </div>
    </main>
  )
}
