import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Personality Stamp | Futuristic ID System',
  description: 'Get your unique personality stamp and digital ID - Cyberpunk Edition',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="scanline relative z-10">
        {children}
        {/* Floating robot assistant */}
        <div className="robot-container" aria-hidden>
          <svg
            className="robot-float"
            width="72"
            height="72"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="robotGradient" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#4d7cff" />
                <stop offset="100%" stopColor="#60a5fa" />
              </linearGradient>
            </defs>
            {/* Antenna */}
            <circle cx="50" cy="10" r="4" fill="url(#robotGradient)"/>
            <rect x="48" y="10" width="4" height="10" rx="2" fill="url(#robotGradient)"/>
            {/* Head */}
            <rect x="28" y="22" width="44" height="28" rx="6" stroke="url(#robotGradient)" strokeWidth="3" fill="#0b1220"/>
            {/* Eyes */}
            <circle cx="40" cy="36" r="5" fill="#9ec1ff"/>
            <circle cx="60" cy="36" r="5" fill="#9ec1ff"/>
            {/* Mouth */}
            <rect x="42" y="44" width="16" height="3" rx="1.5" fill="#4d7cff"/>
            {/* Body */}
            <rect x="24" y="54" width="52" height="28" rx="8" stroke="url(#robotGradient)" strokeWidth="3" fill="#0b1220"/>
            {/* Chest light */}
            <circle cx="50" cy="68" r="6" fill="#1e3a8a" stroke="#60a5fa" strokeWidth="2"/>
            {/* Arms */}
            <rect x="14" y="58" width="10" height="18" rx="4" fill="#14213a" stroke="#4d7cff"/>
            <rect x="76" y="58" width="10" height="18" rx="4" fill="#14213a" stroke="#4d7cff"/>
            {/* Base glow */}
            <ellipse cx="50" cy="92" rx="18" ry="5" fill="#1f2a44" opacity="0.6"/>
          </svg>
        </div>
      </body>
    </html>
  )
}
