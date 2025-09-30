'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Question {
  id: number
  text: string
  options: string[]
}

const questions: Question[] = [
  {
    id: 1,
    text: "When starting a new project, you prefer to:",
    options: [
      "Plan everything in detail before starting",
      "Dive in and figure it out as you go",
      "Gather inspiration from various sources first",
      "Collaborate with others to brainstorm ideas"
    ]
  },
  {
    id: 2,
    text: "Your workspace is usually:",
    options: [
      "Organized and minimalist",
      "Creative chaos with inspiration everywhere",
      "Functional and practical",
      "Constantly evolving and changing"
    ]
  },
  {
    id: 3,
    text: "When solving a problem, you tend to:",
    options: [
      "Use logical analysis and data",
      "Trust your intuition and feelings",
      "Look for innovative and unconventional solutions",
      "Consider how it affects people involved"
    ]
  },
  {
    id: 4,
    text: "Your ideal creative process involves:",
    options: [
      "Following a structured methodology",
      "Experimenting freely without constraints",
      "Iterating and refining constantly",
      "Working in bursts of intense inspiration"
    ]
  },
  {
    id: 5,
    text: "When receiving feedback, you:",
    options: [
      "Appreciate detailed, constructive criticism",
      "Prefer positive reinforcement and encouragement",
      "Want honest, direct opinions",
      "Like to discuss and debate different perspectives"
    ]
  },
  {
    id: 6,
    text: "Your approach to deadlines is:",
    options: [
      "Complete tasks well in advance",
      "Work best under pressure at the last minute",
      "Maintain steady progress throughout",
      "Flexible, depends on the project"
    ]
  },
  {
    id: 7,
    text: "When learning something new, you prefer:",
    options: [
      "Step-by-step tutorials and guides",
      "Hands-on experimentation",
      "Understanding the big picture first",
      "Learning from others' experiences"
    ]
  },
  {
    id: 8,
    text: "Your creative inspiration comes from:",
    options: [
      "Nature and the physical world",
      "Emotions and human experiences",
      "Technology and innovation",
      "Art, culture, and history"
    ]
  },
  {
    id: 9,
    text: "In a team setting, you usually:",
    options: [
      "Take charge and lead the project",
      "Support others and help execute ideas",
      "Generate creative concepts and ideas",
      "Ensure everything stays organized"
    ]
  },
  {
    id: 10,
    text: "Your definition of success in a creative project is:",
    options: [
      "Achieving the planned objectives efficiently",
      "Creating something emotionally impactful",
      "Pushing boundaries and innovating",
      "Making something useful and functional"
    ]
  }
]

const personalityTypes = [
  {
    id: 'architect',
    name: 'The Architect',
    description: 'You are methodical, structured, and detail-oriented. You excel at planning and executing complex projects with precision.',
    traits: ['Organized', 'Analytical', 'Strategic', 'Systematic'],
    sigil: 'architect'
  },
  {
    id: 'visionary',
    name: 'The Visionary',
    description: 'You are innovative, intuitive, and future-focused. You see possibilities others miss and thrive on creative experimentation.',
    traits: ['Innovative', 'Intuitive', 'Bold', 'Experimental'],
    sigil: 'visionary'
  },
  {
    id: 'artisan',
    name: 'The Artisan',
    description: 'You are hands-on, practical, and skilled. You create with your hands and heart, blending craft with creativity.',
    traits: ['Practical', 'Skillful', 'Detail-focused', 'Patient'],
    sigil: 'artisan'
  },
  {
    id: 'catalyst',
    name: 'The Catalyst',
    description: 'You are energetic, spontaneous, and inspiring. You spark creativity in others and thrive in dynamic environments.',
    traits: ['Energetic', 'Spontaneous', 'Inspiring', 'Adaptable'],
    sigil: 'catalyst'
  },
  {
    id: 'harmonizer',
    name: 'The Harmonizer',
    description: 'You are empathetic, collaborative, and people-focused. You create work that connects deeply with human emotions.',
    traits: ['Empathetic', 'Collaborative', 'Emotional', 'Supportive'],
    sigil: 'harmonizer'
  },
  {
    id: 'innovator',
    name: 'The Innovator',
    description: 'You are tech-savvy, forward-thinking, and problem-solving. You use creativity to solve complex challenges.',
    traits: ['Tech-savvy', 'Problem-solver', 'Forward-thinking', 'Logical'],
    sigil: 'innovator'
  }
]

function PersonalityTestContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userId = searchParams.get('userId')
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<number[]>([])
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [personalityResult, setPersonalityResult] = useState<typeof personalityTypes[0] | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!userId) {
      alert('No user ID found. Redirecting to personal info page.')
      router.push('/personal-info')
    }
  }, [userId, router])

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex)
  }

  const handleNext = () => {
    if (selectedAnswer === null) {
      alert('Please select an answer')
      return
    }

    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)
    setSelectedAnswer(null)

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      calculatePersonalityType(newAnswers)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
      const previousAnswers = [...answers]
      setSelectedAnswer(previousAnswers.pop() || null)
      setAnswers(previousAnswers)
    }
  }

  const calculatePersonalityType = async (finalAnswers: number[]) => {
    setLoading(true)

    // Calculate scores for each personality type
    // Each answer maps to different personality traits
    const scores = {
      architect: 0,    // Option 0: structured, planned
      visionary: 0,    // Option 1: intuitive, experimental
      artisan: 0,      // Option 2: practical, hands-on
      catalyst: 0,     // Option 3: energetic, dynamic
      harmonizer: 0,   // People-focused, emotional
      innovator: 0     // Tech-focused, problem-solving
    }

    finalAnswers.forEach((answer, index) => {
      switch (answer) {
        case 0:
          scores.architect += 2
          scores.innovator += 1
          break
        case 1:
          scores.visionary += 2
          scores.catalyst += 1
          break
        case 2:
          scores.artisan += 2
          scores.innovator += 1
          break
        case 3:
          scores.catalyst += 2
          scores.harmonizer += 1
          break
      }
    })

    // Special scoring for specific questions
    if (finalAnswers[2] === 3) scores.harmonizer += 2
    if (finalAnswers[7] === 2) scores.innovator += 2
    if (finalAnswers[4] === 1) scores.harmonizer += 1

    // Find the personality type with highest score
    const maxScore = Math.max(...Object.values(scores))
    const personalityKey = Object.keys(scores).find(
      key => scores[key as keyof typeof scores] === maxScore
    ) as string

    const result = personalityTypes.find(p => p.id === personalityKey) || personalityTypes[0]
    setPersonalityResult(result)

    // Save to Supabase
    try {
      if (userId?.startsWith('local-')) {
        // Save to localStorage
        const userData = localStorage.getItem(userId)
        if (userData) {
          const user = JSON.parse(userData)
          user.personalityType = result.id
          user.sigil = result.sigil
          localStorage.setItem(userId, JSON.stringify(user))
        }
      } else {
        // Save to Supabase
        const { error } = await supabase
          .from('users')
          .update({
            personality_type: result.id,
            updated_at: new Date().toISOString()
          })
          .eq('id', userId)

        // Also save quiz results
        await supabase
          .from('quiz_results')
          .insert({
            user_id: userId,
            personality_type: result.id,
            answers: finalAnswers
          })

        if (error) {
          console.error('Error saving personality type:', error)
        }
      }
    } catch (err) {
      console.error('Error:', err)
    }

    setLoading(false)
    setShowResult(true)
  }

  if (!userId) {
    return null
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center relative cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-blue-950/30 to-black/70 pointer-events-none"></div>
        <div className="text-center relative z-10">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-xl text-cyan-200">Analyzing your personality...</p>
        </div>
      </main>
    )
  }

  if (showResult && personalityResult) {
    return (
      <main className="min-h-screen relative py-12 px-4 cyber-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-blue-950/30 to-black/70 pointer-events-none"></div>
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4 neon-text uppercase tracking-wider">
              Your Personality Type
            </h1>
          </div>

          <div className="neon-border rounded-2xl p-8 md:p-12 bg-black/70 backdrop-blur-sm">
            {/* Sigil */}
            <div className="flex justify-center mb-8">
              <div className="w-48 h-48 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse-glow">
                <svg className="w-32 h-32" viewBox="0 0 100 100" fill="currentColor">
                  {personalityResult.sigil === 'architect' && (
                    <path d="M20 80 L50 20 L80 80 M30 65 L70 65 M35 50 L65 50" stroke="currentColor" strokeWidth="4" fill="none" />
                  )}
                  {personalityResult.sigil === 'visionary' && (
                    <circle cx="50" cy="50" r="30" fill="none" stroke="currentColor" strokeWidth="4">
                      <animate attributeName="r" values="25;35;25" dur="2s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {personalityResult.sigil === 'artisan' && (
                    <path d="M50 20 L80 50 L50 80 L20 50 Z M50 35 L65 50 L50 65 L35 50 Z" />
                  )}
                  {personalityResult.sigil === 'catalyst' && (
                    <path d="M50 10 L60 40 L90 40 L65 60 L75 90 L50 70 L25 90 L35 60 L10 40 L40 40 Z" />
                  )}
                  {personalityResult.sigil === 'harmonizer' && (
                    <path d="M50 20 Q70 30 70 50 Q70 70 50 80 Q30 70 30 50 Q30 30 50 20 M50 35 Q60 40 60 50 Q60 60 50 65 Q40 60 40 50 Q40 40 50 35" />
                  )}
                  {personalityResult.sigil === 'innovator' && (
                    <g>
                      <circle cx="50" cy="50" r="25" fill="none" stroke="currentColor" strokeWidth="4" />
                      <line x1="50" y1="15" x2="50" y2="35" stroke="currentColor" strokeWidth="4" />
                      <line x1="50" y1="65" x2="50" y2="85" stroke="currentColor" strokeWidth="4" />
                      <line x1="15" y1="50" x2="35" y2="50" stroke="currentColor" strokeWidth="4" />
                      <line x1="65" y1="50" x2="85" y2="50" stroke="currentColor" strokeWidth="4" />
                    </g>
                  )}
                </svg>
              </div>
            </div>

            {/* Type Name */}
            <h2 className="text-4xl font-bold text-center mb-4 text-cyan-100">
              {personalityResult.name}
            </h2>

            {/* Description */}
            <p className="text-xl text-center text-cyan-200 mb-8">
              {personalityResult.description}
            </p>

            {/* Traits */}
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {personalityResult.traits.map((trait, index) => (
                <span
                  key={index}
                  className="px-4 py-2 rounded-full font-medium text-cyan-100 bg-blue-900/40 border border-cyan-500/40"
                >
                  {trait}
                </span>
              ))}
            </div>

            {/* Generate Digital ID Button */}
            <div className="text-center">
              <button
                onClick={() => router.push(`/digital-id?userId=${userId}`)}
                className="cyber-button font-bold py-4 px-10 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 uppercase tracking-widest relative overflow-hidden group"
              >
                <span className="relative z-10">Generate Digital ID</span>
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 via-cyan-400/50 to-cyan-600/0 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen relative py-12 px-4 cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-blue-950/30 to-black/70 pointer-events-none"></div>
      <div className="max-w-3xl mx-auto relative z-10">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-cyan-300 mb-2 font-mono">
            <span>[Q {currentQuestion + 1}/{questions.length}]</span>
            <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-blue-950/50 rounded-full h-3 border border-cyan-600/30">
            <div
              className="bg-gradient-to-r from-blue-600 to-cyan-600 h-3 rounded-full transition-all duration-300 shadow-[0_0_10px_rgba(77,124,255,0.6)]"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="neon-border rounded-2xl p-8 mb-6 bg-black/70 backdrop-blur-sm">
          <h2 className="text-2xl md:text-3xl font-bold mb-8 text-cyan-100">
            {questions[currentQuestion].text}
          </h2>

          <div className="space-y-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all duration-200 ${
                  selectedAnswer === index
                    ? 'border-cyan-500 bg-blue-900/40 shadow-[0_0_10px_rgba(77,124,255,0.6)]'
                    : 'border-cyan-700/30 hover:border-cyan-500/60'
                } bg-black/60 text-cyan-100`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                      selectedAnswer === index
                        ? 'border-cyan-500 bg-cyan-500'
                        : 'border-cyan-700/50'
                    }`}
                  >
                    {selectedAnswer === index && (
                      <div className="w-3 h-3 bg-black rounded-full"></div>
                    )}
                  </div>
                  <span className="text-lg text-cyan-100">{option}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePrevious}
            disabled={currentQuestion === 0}
            className="px-6 py-3 rounded-lg font-medium text-cyan-300 hover:bg-blue-900/40 border border-cyan-700/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>

          <button
            onClick={handleNext}
            disabled={selectedAnswer === null}
            className="cyber-button font-bold py-3 px-8 rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest relative overflow-hidden group"
          >
            <span className="relative z-10">{currentQuestion === questions.length - 1 ? 'Finish' : 'Next →'}</span>
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 via-cyan-400/50 to-cyan-600/0 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
          </button>
        </div>
      </div>
    </main>
  )
}

export default function PersonalityTest() {
  return (
    <Suspense fallback={
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-purple-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-700 dark:text-gray-300">Loading quiz...</p>
        </div>
      </main>
    }>
      <PersonalityTestContent />
    </Suspense>
  )
}
