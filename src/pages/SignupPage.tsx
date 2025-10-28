import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { storage, db } from '../firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { collection, addDoc } from 'firebase/firestore'

interface FormData {
  name: string
  email: string
  role: 'technical' | 'non-technical' | ''
  experience: string
  skills: string[]
  passions: string
  currentProject: string
  lookingFor: string
  bio: string
  profileImage: File | null
  profileImagePreview: string
}

const SignupPage = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: '',
    experience: '',
    skills: [],
    passions: '',
    currentProject: '',
    lookingFor: '',
    bio: '',
    profileImage: null,
    profileImagePreview: ''
  })
  const [uploading, setUploading] = useState(false)

  const totalSteps = 6 // Increased from 5 to 6 for profile picture step

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      // Submit form with image upload
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    try {
      setUploading(true)
      let profileImageUrl = ''

      // Upload profile image if exists
      if (formData.profileImage) {
        const imageRef = ref(storage, `profile-images/${Date.now()}_${formData.profileImage.name}`)
        await uploadBytes(imageRef, formData.profileImage)
        profileImageUrl = await getDownloadURL(imageRef)
      }

      // Save user data to Firestore
      await addDoc(collection(db, 'users'), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        experience: formData.experience,
        skills: formData.skills,
        passions: formData.passions,
        currentProject: formData.currentProject,
        lookingFor: formData.lookingFor,
        bio: formData.bio,
        profileImageUrl: profileImageUrl,
        approved: false,
        createdAt: new Date()
      })

      setUploading(false)
      navigate('/waiting')
    } catch (error) {
      console.error('Error submitting form:', error)
      setUploading(false)
      alert('Error submitting application. Please try again.')
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB')
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file')
        return
      }

      setFormData({
        ...formData,
        profileImage: file,
        profileImagePreview: URL.createObjectURL(file)
      })
    }
  }

  const technicalSkills = [
    'react', 'node.js', 'python', 'ios', 'android',
    'ai/ml', 'blockchain', 'devops', 'ui/ux', 'full stack'
  ]

  const nonTechnicalSkills = [
    'tiktok growth', 'content creation', 'photography',
    'video editing', 'videography', 'brand strategy',
    'community', 'copywriting', 'social media', 'seo'
  ]

  return (
    <div className="min-h-screen bg-cream grain">
      {/* Minimal Navigation */}
      <nav className="fixed top-0 w-full bg-cream/80 backdrop-blur-md border-b border-warm-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div 
            className="text-xl font-serif tracking-tight lowercase text-charcoal cursor-pointer" 
            onClick={() => navigate('/')}
          >
            cofndrly
          </div>
          <div className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
            step {step} of {totalSteps}
          </div>
        </div>
      </nav>

      {/* Subtle Progress Bar */}
      <div className="fixed top-[73px] w-full h-px bg-warm-gray-200 z-40">
        <motion.div
          className="h-full bg-rust"
          initial={{ width: 0 }}
          animate={{ width: `${(step / totalSteps) * 100}%` }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        />
      </div>

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            {/* Step 1: Basic Info */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                    Introduction
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    let's begin
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    first, tell us who you are
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                      name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-xl text-charcoal font-light"
                      placeholder="jane doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                      email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-xl text-charcoal font-light"
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div className="pt-6">
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-6 font-sans">
                      i am a...
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button
                        onClick={() => setFormData({ ...formData, role: 'technical' })}
                        className={`p-8 rounded-sm border-2 transition-all text-left ${
                          formData.role === 'technical'
                            ? 'border-charcoal bg-white'
                            : 'border-warm-gray-200 hover:border-warm-gray-400 bg-white/50'
                        }`}
                      >
                        <div className="text-4xl mb-4">⚙️</div>
                        <div className="font-serif text-2xl mb-2 lowercase text-charcoal">builder</div>
                        <div className="text-sm text-warm-gray-600 font-light">
                          i create products and need help with growth
                        </div>
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, role: 'non-technical' })}
                        className={`p-8 rounded-sm border-2 transition-all text-left ${
                          formData.role === 'non-technical'
                            ? 'border-charcoal bg-white'
                            : 'border-warm-gray-200 hover:border-warm-gray-400 bg-white/50'
                        }`}
                      >
                        <div className="text-4xl mb-4">📈</div>
                        <div className="font-serif text-2xl mb-2 lowercase text-charcoal">storyteller</div>
                        <div className="text-sm text-warm-gray-600 font-light">
                          i grow products and need a technical partner
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Experience */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                    Background
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    your experience
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    what have you built or grown?
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                      professional background
                    </label>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal resize-none font-light"
                      rows={4}
                      placeholder="share your journey..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                      skills & expertise
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {(formData.role === 'technical' ? technicalSkills : nonTechnicalSkills).map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-5 py-2.5 rounded-sm transition-all text-sm lowercase ${
                            formData.skills.includes(skill)
                              ? 'bg-charcoal text-cream'
                              : 'bg-white text-warm-gray-700 border border-warm-gray-300 hover:border-charcoal'
                          }`}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Passions */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                    Motivation
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    what drives you?
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    the problems that keep you up at night
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                      passions & interests
                    </label>
                    <textarea
                      value={formData.passions}
                      onChange={(e) => setFormData({ ...formData, passions: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal resize-none font-light"
                      rows={4}
                      placeholder="what industries excite you? what problems do you want to solve?"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                      current project <span className="text-warm-gray-400">(optional)</span>
                    </label>
                    <textarea
                      value={formData.currentProject}
                      onChange={(e) => setFormData({ ...formData, currentProject: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal resize-none font-light"
                      rows={3}
                      placeholder="working on anything right now?"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Looking For */}
            {step === 4 && (
              <motion.div
                key="step4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                    Partnership
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    your ideal match
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    who complements you?
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                      what i'm looking for
                    </label>
                    <textarea
                      value={formData.lookingFor}
                      onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal resize-none font-light"
                      rows={5}
                      placeholder="describe your ideal co-founder. what skills? what values? what energy?"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Profile Picture */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                    Your photo
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    add a profile picture
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    help potential co-founders recognize you
                  </p>
                </div>

                <div className="space-y-8">
                  {/* Image Preview */}
                  <div className="flex flex-col items-center gap-6">
                    <div className="relative w-48 h-48 rounded-sm border-2 border-warm-gray-300 border-dashed overflow-hidden bg-sand flex items-center justify-center">
                      {formData.profileImagePreview ? (
                        <img
                          src={formData.profileImagePreview}
                          alt="Profile preview"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="text-center text-warm-gray-500">
                          <svg className="w-16 h-16 mx-auto mb-2 opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          <p className="text-sm">no photo yet</p>
                        </div>
                      )}
                    </div>

                    {/* Upload Button */}
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="profile-image"
                      />
                      <label
                        htmlFor="profile-image"
                        className="px-8 py-3 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase cursor-pointer inline-block"
                      >
                        {formData.profileImage ? 'change photo' : 'upload photo'}
                      </label>
                    </div>

                    {formData.profileImage && (
                      <button
                        onClick={() => setFormData({ ...formData, profileImage: null, profileImagePreview: '' })}
                        className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors underline underline-offset-2"
                      >
                        remove photo
                      </button>
                    )}
                  </div>

                  <div className="p-6 rounded-sm bg-sand border-l-2 border-rust">
                    <p className="text-sm text-warm-gray-700 font-light">
                      <strong className="font-medium">tip:</strong> use a clear, well-lit photo where your face is visible. square photos work best.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 6: Bio */}
            {step === 6 && (
              <motion.div
                key="step6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                    Final step
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    tell your story
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    this is what potential co-founders will see
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                      your bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal resize-none font-light"
                      rows={6}
                      placeholder="make it compelling. make it you."
                    />
                  </div>

                  <div className="p-6 rounded-sm bg-sand border-l-2 border-rust">
                    <p className="text-sm text-warm-gray-700 font-light italic">
                      be authentic. be specific. be human. the best matches come from real stories.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-16 pt-8 border-t border-warm-gray-200">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-6 py-3 rounded-sm border border-warm-gray-300 text-warm-gray-700 hover:border-charcoal hover:text-charcoal transition-all font-sans tracking-relaxed lowercase"
              >
                back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 px-6 py-3 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={
                uploading ||
                (step === 1 && (!formData.name || !formData.email || !formData.role)) ||
                (step === 2 && (!formData.experience || formData.skills.length === 0)) ||
                (step === 3 && !formData.passions) ||
                (step === 4 && !formData.lookingFor) ||
                (step === 5 && !formData.profileImage) ||
                (step === 6 && !formData.bio)
              }
            >
              {uploading ? 'uploading...' : step === totalSteps ? 'submit application' : 'continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage
