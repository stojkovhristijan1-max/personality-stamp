'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function PersonalInfo() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    nationality: '',
    sex: '',
    species: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Name must be at least 2 characters'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    } else {
      const dob = new Date(formData.dateOfBirth)
      const today = new Date()
      const age = today.getFullYear() - dob.getFullYear()
      if (age < 0 || age > 150) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth'
      }
    }

    if (!formData.nationality.trim()) {
      newErrors.nationality = 'Nationality is required'
    }

    if (!formData.sex) {
      newErrors.sex = 'Please select your sex'
    }

    if (!formData.species) {
      newErrors.species = 'Please select human or robot'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Insert user data into Supabase
      const { data, error } = await supabase
        .from('users')
        .insert([
          {
            name: formData.fullName,
            dob: formData.dateOfBirth,
            nationality: formData.nationality,
            sex: formData.sex,
            human_robot: formData.species,
            created_at: new Date().toISOString()
          }
        ])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        alert('Error saving data. The app will continue without saving to database.')
        // Continue without database - store in localStorage as fallback
        const userId = `local-${Date.now()}`
        localStorage.setItem(userId, JSON.stringify(formData))
        router.push(`/personality-test?userId=${userId}`)
        return
      }

      if (data && data[0]) {
        const userId = data[0].id
        router.push(`/personality-test?userId=${userId}`)
      }
    } catch (err) {
      console.error('Error:', err)
      alert('Error saving data. The app will continue without saving to database.')
      // Fallback to localStorage
      const userId = `local-${Date.now()}`
      localStorage.setItem(userId, JSON.stringify(formData))
      router.push(`/personality-test?userId=${userId}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative cyber-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-blue-950/30 to-black/70 pointer-events-none"></div>
      
      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-block mb-4">
            <div className="text-cyan-400 font-mono text-sm mb-2">[STEP 1/3]</div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 neon-text uppercase tracking-wider" style={{fontFamily: 'Orbitron, sans-serif'}}>
            Personal Information
          </h1>
          <div className="inline-block neon-border rounded px-4 py-2 bg-black/50">
            <p className="text-cyan-200 tracking-wide" style={{fontFamily: 'Rajdhani, sans-serif'}}>
              <span className="text-blue-400">///</span> Tell us about yourself to get started
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="neon-border rounded-2xl p-8 space-y-6 bg-black/70 backdrop-blur-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-cyan-300 mb-2 uppercase tracking-wider" style={{fontFamily: 'Rajdhani, sans-serif'}}>
              <span className="text-blue-400">▶</span> Full Name *
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.fullName ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-cyan-500/50 focus:border-cyan-400'
              } bg-black/50 text-cyan-100 placeholder-cyan-700 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none transition-all duration-300`}
              placeholder="ENTER YOUR FULL NAME"
              style={{fontFamily: 'Rajdhani, sans-serif'}}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-400 font-mono">⚠ {errors.fullName}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div>
            <label htmlFor="dateOfBirth" className="block text-sm font-medium text-cyan-300 mb-2 uppercase tracking-wider" style={{fontFamily: 'Rajdhani, sans-serif'}}>
              <span className="text-blue-400">▶</span> Date of Birth *
            </label>
            <input
              type="date"
              id="dateOfBirth"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.dateOfBirth ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-cyan-500/50 focus:border-cyan-400'
              } bg-black/50 text-cyan-100 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none transition-all duration-300`}
              style={{fontFamily: 'Rajdhani, sans-serif'}}
            />
            {errors.dateOfBirth && (
              <p className="mt-1 text-sm text-red-400 font-mono">⚠ {errors.dateOfBirth}</p>
            )}
          </div>

          {/* Nationality */}
          <div>
            <label htmlFor="nationality" className="block text-sm font-medium text-cyan-300 mb-2 uppercase tracking-wider" style={{fontFamily: 'Rajdhani, sans-serif'}}>
              <span className="text-blue-400">▶</span> Nationality *
            </label>
            <input
              type="text"
              id="nationality"
              name="nationality"
              value={formData.nationality}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.nationality ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-cyan-500/50 focus:border-cyan-400'
              } bg-black/50 text-cyan-100 placeholder-cyan-700 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none transition-all duration-300`}
              placeholder="ENTER YOUR NATIONALITY"
              style={{fontFamily: 'Rajdhani, sans-serif'}}
            />
            {errors.nationality && (
              <p className="mt-1 text-sm text-red-400 font-mono">⚠ {errors.nationality}</p>
            )}
          </div>

          {/* Sex */}
          <div>
            <label htmlFor="sex" className="block text-sm font-medium text-cyan-300 mb-2 uppercase tracking-wider" style={{fontFamily: 'Rajdhani, sans-serif'}}>
              <span className="text-blue-400">▶</span> Sex *
            </label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.sex ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-cyan-500/50 focus:border-cyan-400'
              } bg-black/50 text-cyan-100 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none transition-all duration-300 cursor-pointer`}
              style={{fontFamily: 'Rajdhani, sans-serif'}}
            >
              <option value="" className="bg-black">SELECT...</option>
              <option value="male" className="bg-black">MALE</option>
              <option value="female" className="bg-black">FEMALE</option>
              <option value="non-binary" className="bg-black">NON-BINARY</option>
            </select>
            {errors.sex && (
              <p className="mt-1 text-sm text-red-400 font-mono">⚠ {errors.sex}</p>
            )}
          </div>

          {/* Human/Robot */}
          <div>
            <label htmlFor="species" className="block text-sm font-medium text-cyan-300 mb-2 uppercase tracking-wider" style={{fontFamily: 'Rajdhani, sans-serif'}}>
              <span className="text-blue-400">▶</span> Human/Robot *
            </label>
            <select
              id="species"
              name="species"
              value={formData.species}
              onChange={handleChange}
              className={`w-full px-4 py-3 rounded-lg border-2 ${
                errors.species ? 'border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'border-cyan-500/50 focus:border-cyan-400'
              } bg-black/50 text-cyan-100 focus:ring-2 focus:ring-cyan-500/50 focus:outline-none transition-all duration-300 cursor-pointer`}
              style={{fontFamily: 'Rajdhani, sans-serif'}}
            >
              <option value="" className="bg-black">SELECT...</option>
              <option value="human" className="bg-black">👤 HUMAN</option>
              <option value="robot" className="bg-black">🤖 ROBOT</option>
            </select>
            {errors.species && (
              <p className="mt-1 text-sm text-red-400 font-mono">⚠ {errors.species}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="w-full cyber-button font-bold py-4 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-widest relative overflow-hidden group"
              style={{fontFamily: 'Orbitron, sans-serif'}}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <span className="animate-spin">⚙</span>
                    Processing Data...
                  </>
                ) : (
                  <>
                    Next Step
                    <span className="text-xl">→</span>
                  </>
                )}
              </span>
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/0 via-cyan-400/50 to-cyan-600/0 transform translate-x-full group-hover:translate-x-0 transition-transform duration-1000"></div>
              )}
            </button>
          </div>
        </form>

        {/* Back button */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/')}
            className="text-cyan-400 hover:text-cyan-300 font-mono text-sm hover:underline transition-colors flex items-center gap-2 mx-auto"
          >
            <span>←</span> [RETURN TO HOME]
          </button>
        </div>
      </div>
    </main>
  )
}
