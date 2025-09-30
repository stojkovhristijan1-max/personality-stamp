'use client'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useRouter, useParams } from 'next/navigation'
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
  selfie_url?: string
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

function SharePageContent() {
  const router = useRouter()
  const params = useParams()
  const userId = params.userId as string

  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  const idCardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!userId) {
      router.push('/')
      return
    }

    fetchUserData()
  }, [userId, router])

  const fetchUserData = async () => {
    setLoading(true)
    try {
      if (userId?.startsWith('local-')) {
        // Try to get from localStorage
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
            personality_type: parsedData.personalityType || 'architect',
            selfie_url: undefined
          })
        } else {
          alert('ID not found. This link may have expired.')
          router.push('/')
        }
      } else {
        // Fetch from Supabase
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', userId)
          .single()

        if (error || !data) {
          console.error('Error fetching user:', error)
          alert('Digital ID not found.')
          router.push('/')
          return
        }

        setUserData(data)
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Error loading Digital ID')
      router.push('/')
    } finally {
      setLoading(false)
    }
  }

  const downloadDigitalID = async () => {
    if (!idCardRef.current) return

    setDownloading(true)
    try {
      const canvas = await html2canvas(idCardRef.current, {
        backgroundColor: '#ffffff',
        scale: 2,
        logging: false,
        useCORS: true
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
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading Digital ID...</p>
        </div>
      </main>
    )
  }

  if (!userData) {
    return null
  }

  const personality = personalityTypes[userData.personality_type] || personalityTypes.architect

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            Personality Stamp - Digital ID
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Read-only view
          </p>
        </div>

        {/* Digital ID Card */}
        <div ref={idCardRef} className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden mb-8">
          {/* Header with gradient */}
          <div className={`bg-gradient-to-r ${personality.color} p-6 text-white`}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-1">PERSONALITY STAMP</h2>
                <p className="text-sm opacity-90">Official Digital Identity</p>
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
                <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl overflow-hidden flex items-center justify-center">
                  {userData.selfie_url ? (
                    <img src={userData.selfie_url} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-center p-6">
                      <svg className="w-20 h-20 mx-auto text-gray-400 mb-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-gray-500 dark:text-gray-400">No photo</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Middle: Personal Info */}
              <div className="md:col-span-1 space-y-4">
                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Full Name</label>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{userData.name}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date of Birth</label>
                  <p className="text-gray-700 dark:text-gray-300">{formatDate(userData.dob)}</p>
                </div>

                <div>
                  <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Nationality</label>
                  <p className="text-gray-700 dark:text-gray-300">{userData.nationality}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Sex</label>
                    <p className="text-gray-700 dark:text-gray-300 capitalize">{userData.sex}</p>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Human/Robot</label>
                    <p className="text-gray-700 dark:text-gray-300 capitalize">{userData.human_robot}</p>
                  </div>
                </div>

                <div className="pt-2">
                  <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">ID Number</label>
                  <p className="text-xs font-mono text-gray-600 dark:text-gray-400">{userData.id.substring(0, 16).toUpperCase()}</p>
                </div>
              </div>

              {/* Right: Personality & Sigil */}
              <div className="md:col-span-1">
                <div className="text-center">
                  <label className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider block mb-3">Personality Type</label>
                  
                  {/* Sigil */}
                  <div className={`w-32 h-32 mx-auto mb-4 bg-gradient-to-br ${personality.color} rounded-full flex items-center justify-center text-white shadow-lg`}>
                    <div className="w-20 h-20">
                      {renderSigil(personality.sigil)}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                    {personality.name}
                  </h3>

                  <div className={`inline-block px-4 py-2 bg-gradient-to-r ${personality.color} bg-opacity-10 rounded-full`}>
                    <span className={`text-sm font-medium bg-gradient-to-r ${personality.color} bg-clip-text text-transparent`}>
                      Verified Stamp
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                <span>Official Personality Stamp ID</span>
                <span className="font-mono">PS-2025-VERIFIED</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={downloadDigitalID}
            disabled={downloading}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {downloading ? 'Generating...' : '⬇️ Download Digital ID'}
          </button>

          <button
            onClick={() => router.push('/')}
            className="border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 hover:bg-purple-50 dark:hover:bg-purple-900/20"
          >
            🎭 Get Your Own
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            🔒 This is a read-only view of this Digital ID
          </p>
        </div>
      </div>
    </main>
  )
}

export default function SharePage() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading...</p>
        </div>
      </main>
    }>
      <SharePageContent />
    </Suspense>
  )
}

