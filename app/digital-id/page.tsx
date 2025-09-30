'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import html2canvas from 'html2canvas'

interface UserData {
  id: string
  name: string
  dob: string
  nationality: string
  sex: string
  human_robot: string
  personality_type: string
}

const personalityTypes: Record<string, any> = {
  architect: {
    name: 'The Architect',
    sigil: 'architect',
    color: 'from-blue-600 to-indigo-600'
  },
  visionary: {
    name: 'The Visionary',
    sigil: 'visionary',
    color: 'from-purple-600 to-pink-600'
  },
  artisan: {
    name: 'The Artisan',
    sigil: 'artisan',
    color: 'from-amber-600 to-orange-600'
  },
  catalyst: {
    name: 'The Catalyst',
    sigil: 'catalyst',
    color: 'from-red-600 to-rose-600'
  },
  harmonizer: {
    name: 'The Harmonizer',
    sigil: 'harmonizer',
    color: 'from-green-600 to-emerald-600'
  },
  innovator: {
    name: 'The Innovator',
    sigil: 'innovator',
    color: 'from-cyan-600 to-blue-600'
  }
}

function DigitalIDContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null)
  const [showCamera, setShowCamera] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const idCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!userId) {
      alert('No user ID found. Redirecting to home.')
      router.push('/')
      return
    }

    fetchUserData()
  }, [userId, router])

  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [stream])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      if (userId?.startsWith('local-')) {
        // Get from localStorage
        const data = localStorage.getItem(userId)
        if (data) {
          const parsedData = JSON.parse(data)
          setUserData({
            id: userId,
            name: parsedData.fullName,
            dob: parsedData.dateOfBirth,
            nationality: parsedData.nationality,
            sex: parsedData.sex,
            human_robot: parsedData.species,
            personality_type: parsedData.personalityType || 'architect'
          })
        }
      } else {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (error) {
          console.error('Error fetching user:', error)
          alert('Error loading user data')
          router.push('/')
          return
        }

        setUserData(data)
        if (data.selfie_url) {
          setSelfieUrl(data.selfie_url)
        }
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Error loading user data')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480, facingMode: 'user' }
      })
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      setShowCamera(true)
    } catch (err) {
      console.error('Error accessing camera:', err)
      alert('Could not access camera. Please check permissions.')
    }
  }

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
      setStream(null)
    }
    setShowCamera(false)
  }

  const capturePhoto = async () => {
    if (!videoRef.current || !canvasRef.current) return

    const video = videoRef.current
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')

    if (!context) return

    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    context.drawImage(video, 0, 0)

    canvas.toBlob(async (blob) => {
      if (!blob) return

      const imageUrl = URL.createObjectURL(blob)
      setSelfieUrl(imageUrl)
      stopCamera()

      // Save to Supabase storage with userId.jpg filename
      if (!userId?.startsWith('local-')) {
        try {
          const fileName = `${userId}.jpg`
          
          // Delete old file if exists
          await supabase.storage
            .from('selfies')
            .remove([fileName])
          
          // Upload new file
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('selfies')
            .upload(fileName, blob, {
              contentType: 'image/jpeg',
              upsert: true
            })

          if (!uploadError && uploadData) {
            const { data: publicUrlData } = supabase.storage
              .from('selfies')
              .getPublicUrl(fileName)

            const publicUrl = publicUrlData.publicUrl

            // Update user record with selfie URL
            await supabase
              .from('users')
              .update({ selfie_url: publicUrl })
              .eq('id', userId)

            setSelfieUrl(publicUrl)
          }
        } catch (err) {
          console.error('Error uploading selfie:', err)
          // Continue with local blob URL
        }
      }
    }, 'image/png')
  }

  const downloadDigitalID = async () => {
    if (!idCardRef.current) return

    setDownloading(true)
    try {
      const canvas = await html2canvas(idCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true
      })

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `personality-stamp-${userData?.name.replace(/\s+/g, '-')}.png`
          link.click()
          URL.revokeObjectURL(url)
        }
        setDownloading(false)
      }, 'image/png')
    } catch (err) {
      console.error('Error downloading:', err)
      alert('Error downloading Digital ID')
      setDownloading(false)
    }
  }

  const copyShareLink = async () => {
    const shareUrl = `${window.location.origin}/share/${userId}`
    
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = shareUrl
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const renderSigil = (sigil: string) => {
    return (
      <svg className="w-full h-full" viewBox="0 0 100 100" fill="currentColor">
        {sigil === 'architect' && (
          <path d="M20 80 L50 20 L80 80 M30 65 L70 65 M35 50 L65 50" stroke="currentColor" strokeWidth="4" fill="none" />
        )}
        {sigil === 'visionary' && (
          <>
            <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="4" />
            <circle cx="50" cy="50" r="20" fill="none" stroke="currentColor" strokeWidth="3" />
            <circle cx="50" cy="50" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          </>
        )}
        {sigil === 'artisan' && (
          <path d="M50 20 L80 50 L50 80 L20 50 Z M50 35 L65 50 L50 65 L35 50 Z" />
        )}
        {sigil === 'catalyst' && (
          <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" />
        )}
        {sigil === 'harmonizer' && (
          <path d="M50 20 Q70 30 70 50 Q70 70 50 80 Q30 70 30 50 Q30 30 50 20 M50 35 Q60 40 60 50 Q60 60 50 65 Q40 60 40 50 Q40 40 50 35" />
        )}
        {sigil === 'innovator' && (
          <g>
            <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="15" x2="50" y2="35" stroke="currentColor" strokeWidth="4" />
            <line x1="50" y1="65" x2="50" y2="85" stroke="currentColor" strokeWidth="4" />
            <line x1="15" y1="50" x2="35" y2="50" stroke="currentColor" strokeWidth="4" />
            <line x1="65" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="4" />
          </g>
        )}
      </svg>
    )
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center relative cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-blue-950/30 to-black/70 pointer-events-none"></div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-xl text-cyan-200">Loading your Digital ID...</p>
        </div>
      </main>
    )
  }

  if (!userData) {
    return null
  }

  const personality = personalityTypes[userData.personality_type] || personalityTypes.architect

  return (
    <main className="min-h-screen relative py-12 px-4 cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-blue-950/30 to-black/70 pointer-events-none"></div>
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text uppercase tracking-wider">
            Your Digital ID
          </h1>
          <p className="text-cyan-300">
            Your unique personality stamp
          </p>
        </div>

        {/* Digital ID Card */}
        <div ref={idCardRef} className="neon-border rounded-3xl overflow-hidden mb-8 bg-black/70 backdrop-blur-sm">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${personality.color} p-6 text-white shadow-[0_0_20px_rgba(77,124,255,0.5)]`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1 tracking-widest">PERSONALITY STAMP</h2>
                <p className="text-sm opacity-90 font-mono">Official Digital Identity</p>
              </div>
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                <span className="text-2xl font-bold">ID</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="p-8">
            <div className="grid md:grid-cols-3 gap-8">
              {/* Left: Photo */}
              <div className="md:col-span-1">
                <div className="aspect-square bg-gradient-to-br from-blue-900/40 to-cyan-900/20 rounded-2xl overflow-hidden flex items-center justify-center border border-cyan-700/40">
                  {selfieUrl ? (
                    <img src={selfieUrl} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <svg className="w-20 h-20 mx-auto text-cyan-400/60 mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-cyan-300">No photo</p>
                    </div>
                  )}
                </div>

                {!selfieUrl && !showCamera && (
                  <button
                    onClick={startCamera}
                    className="w-full mt-4 cyber-button font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    📷 Take Selfie
                  </button>
                )}
              </div>

              {/* Middle: Personal Info */}
              <div className="md:col-span-1 space-y-4 text-cyan-100">
                <div>
                  <label className="text-xs text-cyan-400 uppercase tracking-wider">Full Name</label>
                  <p className="text-lg font-semibold">{userData.name}</p>
                </div>

                <div>
                  <label className="text-xs text-cyan-400 uppercase tracking-wider">Date of Birth</label>
                  <p className="text-cyan-200">{formatDate(userData.dob)}</p>
                </div>

                <div>
                  <label className="text-xs text-cyan-400 uppercase tracking-wider">Nationality</label>
                  <p className="text-cyan-200">{userData.nationality}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-cyan-400 uppercase tracking-wider">Sex</label>
                    <p className="text-cyan-200 capitalize">{userData.sex}</p>
                  </div>
                  <div>
                    <label className="text-xs text-cyan-400 uppercase tracking-wider">Human/Robot</label>
                    <p className="text-cyan-200 capitalize">{userData.human_robot}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs text-cyan-400 uppercase tracking-wider">ID Number</label>
                  <p className="text-xs font-mono text-cyan-300">{userData.id.substring(0, 16).toUpperCase()}</p>
                </div>
              </div>

              {/* Right: Personality & Sigil */}
              <div className="md:col-span-1">
                <div className="text-center">
                  <label className="text-xs text-cyan-400 uppercase tracking-wider block mb-3">Personality Type</label>
                  
                  {/* Sigil */}
                  <div className={`w-32 h-32 mx-auto mb-4 bg-gradient-to-br ${personality.color} rounded-full flex items-center justify-center text-white shadow-lg animate-pulse-glow`}>
                    <div className="w-20 h-20">
                      {renderSigil(personality.sigil)}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-cyan-100 mb-2">
                    {personality.name}
                  </h3>

                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${personality.color} bg-opacity-10 rounded-full border border-white/20`}>
                    <span className={`text-sm font-medium bg-gradient-to-r ${personality.color} bg-clip-text text-transparent`}>Verified Stamp</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-cyan-700/40">
              <div className="flex justify-between items-center text-xs text-cyan-300">
                <span>Issued: {new Date().toLocaleDateString()}</span>
                <span className="font-mono">PS-2025-OFFICIAL</span>
              </div>
            </div>
          </div>
        </div>

        {/* Camera Modal */}
        {showCamera && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
            <div className="bg-black/80 backdrop-blur-md border border-cyan-700/40 rounded-2xl p-6 max-w-2xl w-full">
              <h3 className="text-2xl font-bold mb-4 text-cyan-100">Take Your Selfie</h3>
              
              <div className="relative aspect-video bg-black rounded-lg overflow-hidden mb-4">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-full object-cover"
                />
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-4">
                <button
                  onClick={capturePhoto}
                  className="flex-1 cyber-button font-bold py-3 px-6 rounded-lg transition-all"
                >
                  📸 Capture Photo
                </button>
                <button
                  onClick={stopCamera}
                  className="px-6 py-3 border-2 border-cyan-700/40 rounded-lg font-medium text-cyan-200 hover:bg-blue-900/30 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
          <button
            onClick={downloadDigitalID}
            disabled={downloading}
            className="cyber-button font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {downloading ? 'Generating...' : '⬇️ Download Digital ID'}
          </button>

          <button
            onClick={copyShareLink}
            className="border-2 border-cyan-500 text-cyan-300 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:bg-blue-900/30 transform hover:scale-105"
          >
            {copied ? '✓ Link Copied!' : '🔗 Copy Share Link'}
          </button>

          {selfieUrl && (
            <button
              onClick={() => {
                setSelfieUrl(null)
                startCamera()
              }}
              className="border-2 border-cyan-500 text-cyan-300 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:bg-blue-900/30"
            >
              📷 Retake Selfie
            </button>
          )}
        </div>

        {/* Share URL Display */}
        {copied && (
          <div className="bg-blue-900/30 border-2 border-cyan-600 rounded-xl p-4 mb-6 text-center animate-fade-in">
            <p className="text-cyan-200 font-medium mb-2">
              ✓ Shareable link copied to clipboard!
            </p>
            <p className="text-sm text-cyan-300 font-mono break-all">
              {window.location.origin}/share/{userId}
            </p>
          </div>
        )}

        {/* Back to home */}
        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="text-cyan-400 hover:text-cyan-300 font-mono hover:underline"
          >
            ← Start over
          </button>
        </div>
      </div>
    </main>
  )
}

export default function DigitalID() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </main>
    }>
      <DigitalIDContent />
    </Suspense>
  )
}
