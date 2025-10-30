import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { storage, db } from '../firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { setDoc, doc } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'
import { generateInitialsImage } from '../utils/generateInitials'
import SEO from '../components/SEO'

interface FormData {
  name: string
  email: string
  password: string
  role: 'builder' | 'marketer' | ''
  experience: string
  skills: string[]
  bio: string
  profileImage: File | null
  profileImagePreview: string
  customSkill: string
  
  // Builder-specific fields
  projects: Array<{
    name: string
    description: string
    stage: string
    link: string
    logo: File | null
    logoPreview: string
  }>
  partnershipPreference: string[]
  
  // Marketer-specific fields
  marketingExperience: string
  portfolioLinks: string
  preferredArrangement: string[]
  industries: string[]
}

const SignupPage = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    role: '',
    experience: '',
    skills: [],
    bio: '',
    profileImage: null,
    profileImagePreview: '',
    customSkill: '',
    
    // Builder-specific
    projects: [],
    partnershipPreference: [],
    
    // Marketer-specific
    marketingExperience: '',
    portfolioLinks: '',
    preferredArrangement: [],
    industries: []
  })
  const [uploading, setUploading] = useState(false)
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [isEditingProject, setIsEditingProject] = useState(true)

  const totalSteps = 7 // Adjusted for new flow with projects

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
      
      // Create Firebase Auth account
      const user = await signUp(formData.email, formData.password)
      
      let profileImageUrl = ''

      // Upload profile image if exists, otherwise use initials
      if (formData.profileImage) {
        const imageRef = ref(storage, `profile-images/${Date.now()}_${formData.profileImage.name}`)
        await uploadBytes(imageRef, formData.profileImage)
        profileImageUrl = await getDownloadURL(imageRef)
      } else {
        // Generate initials image as data URL
        profileImageUrl = generateInitialsImage(formData.name)
      }

      // Upload project logos for builders
      const projectsWithLogos = await Promise.all(
        formData.projects.map(async (project) => {
          let logoUrl = ''
          if (project.logo) {
            const logoRef = ref(storage, `project-logos/${Date.now()}_${project.logo.name}`)
            await uploadBytes(logoRef, project.logo)
            logoUrl = await getDownloadURL(logoRef)
          }
          return {
            name: project.name,
            description: project.description,
            stage: project.stage,
            link: project.link,
            logoUrl: logoUrl
          }
        })
      )

      // Save user profile to Firestore with the same ID as auth user
      await setDoc(doc(db, 'users', user.uid), {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        experience: formData.experience,
        skills: formData.skills,
        bio: formData.bio,
        profileImageUrl: profileImageUrl,
        
        // Builder-specific
        ...(formData.role === 'builder' && {
          projects: projectsWithLogos,
          partnershipPreference: formData.partnershipPreference
        }),
        
        // Marketer-specific
        ...(formData.role === 'marketer' && {
          marketingExperience: formData.marketingExperience,
          portfolioLinks: formData.portfolioLinks,
          preferredArrangement: formData.preferredArrangement,
          industries: formData.industries
        }),
        
        approved: false,
        createdAt: new Date()
      })

      setUploading(false)
      navigate('/waiting')
    } catch (error: any) {
      console.error('Error submitting form:', error)
      setUploading(false)
      if (error.code === 'auth/email-already-in-use') {
        alert('This email is already registered. Please sign in instead.')
      } else if (error.code === 'auth/weak-password') {
        alert('Password should be at least 6 characters.')
      } else {
        alert('Error submitting application. Please try again.')
      }
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

  const addCustomSkill = () => {
    if (formData.customSkill.trim()) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, formData.customSkill.trim().toLowerCase()],
        customSkill: ''
      }))
      setShowCustomSkillInput(false)
    }
  }

  const removeSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }))
  }

  const builderSkills = [
    'react', 'node.js', 'python', 'ios', 'android',
    'ai/ml', 'blockchain', 'devops', 'ui/ux', 'full stack',
    'cursor', 'claude code', 'windsurf', 'github copilot', 'v0', 'replit agent', "lovable", "codex"
  ]

  const marketerSkills = [
    'paid ads', 'content creation', 'seo',
    'social media', 'copywriting', 'email marketing',
    'growth hacking', 'analytics', 'influencer marketing', 'community building'
  ]

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  return (
    <>
      <SEO
        title="Apply to Join GrowMyApp — Turn Your Shelf Projects Into Revenue"
        description="Join our curated community of builders and marketers. Get matched with your ideal partner and launch your projects together."
        keywords="apply GrowMyApp, startup application, find marketer, find builder, project matching"
        canonicalUrl="https://GrowMyApp.com/signup"
        noindex={true}
      />
      <div className="min-h-screen bg-white">
        {/* Minimal Navigation - Same as Landing Page */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-warm-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => navigate('/')}
          >
            <img src="/logo-bg.png" alt="GrowMyApp Logo" className="w-10 h-10" />
            <span className="text-xl font-bold tracking-tight text-forest" style={{ color: '#456456' }}>
              GrowMyApp
            </span>
          </motion.div>
          <div className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans font-semibold">
            step {step} of {totalSteps}
          </div>
        </div>
      </nav>

      {/* Subtle Progress Bar */}
      <div className="fixed top-[73px] w-full h-px bg-warm-gray-200 z-40">
        <motion.div
          className="h-full bg-mint"
          style={{ backgroundColor: '#7FB685' }}
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
                  <p className="text-xs uppercase tracking-loose text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                    Introduction
                  </p>
                  <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                    Let's Begin
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                    First, tell us who you are
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans font-semibold">
                      name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-xl text-forest font-normal"
                      style={{ borderColor: formData.name ? '#456456' : undefined }}
                      placeholder="Jane Doe"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans font-semibold">
                      email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-xl text-forest font-normal"
                      style={{ borderColor: formData.email ? '#456456' : undefined }}
                      placeholder="jane@example.com"
                    />
                  </div>

                  <div className="pt-6">
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-6 font-sans font-semibold">
                      I am a...
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <button
                        onClick={() => setFormData({ ...formData, role: 'builder' })}
                        className={`p-8 rounded-xl border-2 transition-all text-left shadow-md hover:shadow-lg ${
                          formData.role === 'builder'
                            ? 'border-forest bg-light-mint'
                            : 'border-warm-gray-200 hover:border-mint bg-white'
                        }`}
                        style={formData.role === 'builder' ? { borderColor: '#456456', backgroundColor: '#E8F4EA' } : {}}
                      >
                        <div className="text-4xl mb-4">⚙️</div>
                        <div className="font-sans font-bold text-2xl mb-2 text-forest" style={{ color: '#456456' }}>Builder</div>
                        <div className="text-sm text-warm-gray-600 font-normal">
                          I build products and have shelf projects
                        </div>
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, role: 'marketer' })}
                        className={`p-8 rounded-xl border-2 transition-all text-left shadow-md hover:shadow-lg ${
                          formData.role === 'marketer'
                            ? 'border-bright-orange bg-peach/20'
                            : 'border-warm-gray-200 hover:border-bright-orange bg-white'
                        }`}
                        style={formData.role === 'marketer' ? { borderColor: '#F5A65B', backgroundColor: 'rgba(245, 166, 91, 0.1)' } : {}}
                      >
                        <div className="text-4xl mb-4">📈</div>
                        <div className="font-sans font-bold text-2xl mb-2 text-forest" style={{ color: '#456456' }}>Marketer</div>
                        <div className="text-sm text-warm-gray-600 font-normal">
                          I market products and can help launch projects
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Password */}
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
                  <p className="text-xs uppercase tracking-loose text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                    Security
                  </p>
                  <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                    Create Password
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                    Secure your account
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans font-semibold">
                      password (minimum 6 characters)
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-xl text-forest font-normal"
                      style={{ borderColor: formData.password ? '#456456' : undefined }}
                      placeholder="••••••••"
                      minLength={6}
                    />
                    <p className="mt-2 text-sm text-warm-gray-600 font-normal">
                      You'll use this to sign in and access your matches
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Professional Background */}
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
                  <p className="text-xs uppercase tracking-loose text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                    Background
                  </p>
                  <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                    Your Experience
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                    What have you built or grown?
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans font-semibold">
                      professional background
                    </label>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-lg text-forest resize-none font-normal"
                      style={{ borderColor: formData.experience ? '#456456' : undefined }}
                      rows={5}
                      placeholder="Share your journey..."
                      required
                    />
                    <p className="mt-2 text-sm text-warm-gray-500 font-normal italic">
                      Fill this in to continue
                    </p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Skills & Expertise */}
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
                  <p className="text-xs uppercase tracking-loose text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                    Expertise
                  </p>
                  <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                    Your Skills
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                    Select at least one skill to continue
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                      skills & expertise
                    </label>
                    
                    {/* Predefined Skills */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      {(formData.role === 'builder' ? builderSkills : marketerSkills).map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-5 py-2.5 rounded-lg transition-all text-sm font-sans font-medium shadow-sm hover:shadow-md ${
                            formData.skills.includes(skill)
                              ? 'bg-forest text-white'
                              : 'bg-white text-warm-gray-700 border border-warm-gray-300 hover:border-mint'
                          }`}
                          style={formData.skills.includes(skill) ? { backgroundColor: '#456456', color: '#FFFFFF' } : {}}
                        >
                          {skill}
                        </button>
                      ))}
                    </div>

                    {/* Custom Skills Added */}
                    {formData.skills.filter(skill => 
                      !(formData.role === 'builder' ? builderSkills : marketerSkills).includes(skill)
                    ).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs uppercase tracking-loose text-warm-gray-500 mb-2 font-sans font-semibold">
                          custom skills
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {formData.skills
                            .filter(skill => !(formData.role === 'builder' ? builderSkills : marketerSkills).includes(skill))
                            .map(skill => (
                              <div
                                key={skill}
                                className="px-5 py-2.5 rounded-lg bg-bright-orange/10 text-forest border border-bright-orange/30 text-sm font-sans font-medium flex items-center gap-2 shadow-sm"
                                style={{ color: '#456456' }}
                              >
                                {skill}
                                <button
                                  onClick={() => removeSkill(skill)}
                                  className="text-bright-orange hover:text-forest transition-colors"
                                  style={{ color: '#F5A65B' }}
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                        </div>
                      </div>
                    )}

                    {/* Add Custom Skill */}
                    {!showCustomSkillInput ? (
                      <button
                        onClick={() => setShowCustomSkillInput(true)}
                        className="px-5 py-2.5 rounded-lg bg-white text-warm-gray-700 border border-warm-gray-300 hover:border-mint transition-all text-sm font-sans font-medium shadow-sm hover:shadow-md"
                      >
                        + Add Other Skill
                      </button>
                    ) : (
                      <div className="flex gap-3 items-center">
                        <input
                          type="text"
                          value={formData.customSkill}
                          onChange={(e) => setFormData({ ...formData, customSkill: e.target.value })}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault()
                              addCustomSkill()
                            }
                          }}
                          className="px-4 py-2.5 bg-white border border-warm-gray-300 focus:border-forest focus:outline-none rounded-lg text-sm text-forest font-sans font-medium flex-1"
                          placeholder="Type your skill..."
                          autoFocus
                        />
                        <button
                          onClick={addCustomSkill}
                          className="px-5 py-2.5 rounded-lg bg-forest text-white hover:bg-dark-green transition-all text-sm font-sans font-medium shadow-md"
                          style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowCustomSkillInput(false)
                            setFormData({ ...formData, customSkill: '' })
                          }}
                          className="px-5 py-2.5 rounded-lg bg-white text-warm-gray-700 border border-warm-gray-300 hover:border-forest transition-all text-sm font-sans font-medium"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 5: Add Projects (Builders) or Marketing Experience (Marketers) */}
            {step === 5 && (
              <motion.div
                key="step5"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                {formData.role === 'builder' ? (
                  <>
                    <div className="space-y-4">
                      <p className="text-xs uppercase tracking-loose text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                        Your Projects
                      </p>
                      <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                        Add Your Projects
                      </h1>
                      <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                        Add at least one project. You can add more later.
                      </p>
                    </div>

                    {/* Current Project Form */}
                      {isEditingProject && (
                       <div className="space-y-8 p-8 bg-white rounded-xl border-2 border-mint shadow-md" style={{ borderColor: '#7FB685' }}>
                         <h3 className="font-sans font-bold text-2xl text-forest" style={{ color: '#456456' }}>
                            Project {currentProjectIndex + 1}
                          </h3>

                        {/* Project Name */}
                        <div>
                          <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans font-semibold">
                            project name <span className="text-bright-orange" style={{ color: '#F5A65B' }}>*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.projects[currentProjectIndex]?.name || ''}
                            onChange={(e) => {
                              const newProjects = [...formData.projects]
                              if (!newProjects[currentProjectIndex]) {
                                newProjects[currentProjectIndex] = { name: '', description: '', stage: '', link: '', logo: null, logoPreview: '' }
                              }
                              newProjects[currentProjectIndex].name = e.target.value
                              setFormData({ ...formData, projects: newProjects })
                            }}
                            className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-xl text-forest font-normal"
                            style={{ borderColor: formData.projects[currentProjectIndex]?.name ? '#456456' : undefined }}
                            placeholder="My Awesome App"
                          />
                        </div>

                        {/* Project Description */}
                        <div>
                          <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans font-semibold">
                            description <span className="text-bright-orange" style={{ color: '#F5A65B' }}>*</span>
                          </label>
                          <textarea
                            value={formData.projects[currentProjectIndex]?.description || ''}
                            onChange={(e) => {
                              const newProjects = [...formData.projects]
                              if (!newProjects[currentProjectIndex]) {
                                newProjects[currentProjectIndex] = { name: '', description: '', stage: '', link: '', logo: null, logoPreview: '' }
                              }
                              newProjects[currentProjectIndex].description = e.target.value
                              setFormData({ ...formData, projects: newProjects })
                            }}
                            className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-lg text-forest resize-none font-normal"
                            style={{ borderColor: formData.projects[currentProjectIndex]?.description ? '#456456' : undefined }}
                            rows={4}
                            placeholder="What does it do? Who is it for?"
                          />
                        </div>

                        {/* Project Stage */}
                        <div>
                          <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                            project stage <span className="text-bright-orange" style={{ color: '#F5A65B' }}>*</span>
                          </label>
                          <div className="space-y-3">
                            {['💡 Idea / Concept', '🔨 In Development', '🚀 MVP Launched', '📈 Early Traction (<100 users)', '🎯 Growing (100-1K users)', '💪 Established (1K+ users)'].map(stage => (
                              <button
                                key={stage}
                                onClick={() => {
                                  const newProjects = [...formData.projects]
                                  if (!newProjects[currentProjectIndex]) {
                                    newProjects[currentProjectIndex] = { name: '', description: '', stage: '', link: '', logo: null, logoPreview: '' }
                                  }
                                  newProjects[currentProjectIndex].stage = stage
                                  setFormData({ ...formData, projects: newProjects })
                                }}
                                className={`w-full p-4 rounded-lg border-2 transition-all text-left shadow-sm hover:shadow-md ${
                                  formData.projects[currentProjectIndex]?.stage === stage
                                    ? 'border-forest bg-white'
                                    : 'border-warm-gray-200 hover:border-mint bg-white/50'
                                }`}
                                style={formData.projects[currentProjectIndex]?.stage === stage ? { borderColor: '#456456' } : {}}
                              >
                                <div className="text-sm text-forest font-sans font-medium" style={{ color: '#456456' }}>{stage}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Project Link */}
                        <div>
                          <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans font-semibold">
                            project link <span className="text-bright-orange" style={{ color: '#F5A65B' }}>*</span>
                          </label>
                          <input
                            type="url"
                            value={formData.projects[currentProjectIndex]?.link || ''}
                            onChange={(e) => {
                              const newProjects = [...formData.projects]
                              if (!newProjects[currentProjectIndex]) {
                                newProjects[currentProjectIndex] = { name: '', description: '', stage: '', link: '', logo: null, logoPreview: '' }
                              }
                              newProjects[currentProjectIndex].link = e.target.value
                              setFormData({ ...formData, projects: newProjects })
                            }}
                            className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-lg text-forest font-normal"
                            style={{ borderColor: formData.projects[currentProjectIndex]?.link ? '#456456' : undefined }}
                            placeholder="https://..."
                          />
                          <p className="text-sm text-warm-gray-500 mt-2 font-normal">
                            Website, app store, GitHub, etc.
                          </p>
                        </div>

                        {/* Project Logo */}
                        <div>
                          <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                            project logo <span className="text-warm-gray-400">(optional)</span>
                          </label>
                          
                          {formData.projects[currentProjectIndex]?.logoPreview && (
                            <div className="mb-4">
                              <img
                                src={formData.projects[currentProjectIndex].logoPreview}
                                alt="Logo preview"
                                className="w-24 h-24 object-cover rounded-lg border-2 border-warm-gray-200 shadow-md"
                              />
                            </div>
                          )}

                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) {
                                  const newProjects = [...formData.projects]
                                  if (!newProjects[currentProjectIndex]) {
                                    newProjects[currentProjectIndex] = { name: '', description: '', stage: '', link: '', logo: null, logoPreview: '' }
                                  }
                                  newProjects[currentProjectIndex].logo = file
                                  newProjects[currentProjectIndex].logoPreview = URL.createObjectURL(file)
                                  setFormData({ ...formData, projects: newProjects })
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              id="project-logo"
                            />
                            <label
                              htmlFor="project-logo"
                              className="px-8 py-3 bg-white text-forest border-2 border-mint hover:border-forest rounded-lg transition-all font-sans font-medium shadow-md hover:shadow-lg cursor-pointer inline-block"
                              style={{ color: '#456456', borderColor: '#7FB685' }}
                            >
                              {formData.projects[currentProjectIndex]?.logo ? 'Change Logo' : 'Upload Logo'}
                            </label>
                          </div>
                        </div>

                        {/* Save Project Button */}
                        <div className="pt-6 border-t-2 border-warm-gray-200">
                          <button
                            onClick={() => {
                              const currentProject = formData.projects[currentProjectIndex]
                              if (currentProject && currentProject.name && currentProject.description && currentProject.stage && currentProject.link) {
                                // Project is complete, hide the form and show the list
                                setIsEditingProject(false)
                              } else {
                                alert('Please complete all required fields before saving.')
                              }
                            }}
                            disabled={
                              !formData.projects[currentProjectIndex]?.name ||
                              !formData.projects[currentProjectIndex]?.description ||
                              !formData.projects[currentProjectIndex]?.stage ||
                              !formData.projects[currentProjectIndex]?.link
                            }
                            className="px-8 py-3 bg-forest text-white rounded-lg hover:bg-dark-green transition-all font-sans font-medium shadow-md hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
                            style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
                          >
                            Save Project
                          </button>
                        </div>
                      </div>
                    )}

                    {/* List of Added Projects */}
                    {formData.projects.length > 0 && !isEditingProject && (
                      <div className="space-y-4">
                        <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans font-semibold">
                          Added Projects ({formData.projects.length})
                        </p>
                        {formData.projects.map((project, index) => (
                          <div key={index} className="p-5 bg-white rounded-xl border-2 border-warm-gray-200 flex items-center justify-between shadow-md hover:shadow-lg transition-shadow">
                            <div className="flex items-center gap-3">
                              {project.logoPreview && (
                                <img src={project.logoPreview} alt={project.name} className="w-12 h-12 object-cover rounded-lg border border-warm-gray-200" />
                              )}
                              <div>
                                <p className="font-sans font-bold text-lg text-forest" style={{ color: '#456456' }}>{project.name}</p>
                                <p className="text-xs text-warm-gray-600 font-normal">{project.stage}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const newProjects = formData.projects.filter((_, i) => i !== index)
                                setFormData({ ...formData, projects: newProjects })
                                if (currentProjectIndex >= newProjects.length && newProjects.length > 0) {
                                  setCurrentProjectIndex(newProjects.length - 1)
                                } else if (newProjects.length === 0) {
                                  setCurrentProjectIndex(0)
                                  setIsEditingProject(true)
                                }
                              }}
                              className="text-warm-gray-500 hover:text-bright-orange transition-colors font-sans font-medium text-sm"
                              style={{ color: '#9CA3AF' }}
                            >
                              Remove
                            </button>
                          </div>
                        ))}
                        
                        {/* Add Another Project Button */}
                        <button
                          onClick={() => {
                            setCurrentProjectIndex(formData.projects.length)
                            setIsEditingProject(true)
                          }}
                          className="w-full py-4 rounded-xl border-2 border-dashed border-mint hover:border-forest hover:bg-light-mint transition-all text-forest font-sans font-medium"
                          style={{ borderColor: '#7FB685', color: '#456456' }}
                        >
                          + Add Another Project
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  // Marketer Experience
                  <>
                    <div className="space-y-4">
                      <p className="text-xs uppercase tracking-loose text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                        Your Experience
                      </p>
                      <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                        Your Marketing Background
                      </h1>
                      <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                        What marketing experience do you have?
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* For Marketers: Marketing Experience */}
                      <div>
                        <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans font-semibold">
                          describe your marketing experience
                        </label>
                        <textarea
                          value={formData.marketingExperience}
                          onChange={(e) => setFormData({ ...formData, marketingExperience: e.target.value })}
                          className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-lg text-forest resize-none font-normal"
                          style={{ borderColor: formData.marketingExperience ? '#456456' : undefined }}
                          rows={5}
                          placeholder="What have you marketed? What results did you achieve? Include numbers if possible..."
                          required
                        />
                      </div>

                      {/* Portfolio Links */}
                      <div>
                        <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans font-semibold">
                          portfolio & work samples
                        </label>
                        <textarea
                          value={formData.portfolioLinks}
                          onChange={(e) => setFormData({ ...formData, portfolioLinks: e.target.value })}
                          className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-lg text-forest resize-none font-normal"
                          style={{ borderColor: formData.portfolioLinks ? '#456456' : undefined }}
                          rows={5}
                          placeholder="Share links to your best work...&#10;&#10;Campaigns, content, case studies, social media accounts, etc."
                        />
                        <p className="text-sm text-warm-gray-500 mt-2 font-normal">
                          Paste links (one per line)
                        </p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Step 6: Partnership Preferences */}
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
                  <p className="text-xs uppercase tracking-loose text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                    Arrangements
                  </p>
                  <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                    Partnership Terms
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                    {formData.role === 'builder' 
                      ? 'What arrangement are you open to with marketers?'
                      : 'What arrangement are you looking for?'
                    }
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                      select all that apply
                    </label>
                    <div className="space-y-3">
                      {formData.role === 'builder' ? (
                        <>
                          {['Co-founder / Equity Partner', 'Revenue Share', 'Pay for Marketing Services', 'Open to Discussion'].map(option => (
                            <button
                              key={option}
                              onClick={() => setFormData({ 
                                ...formData, 
                                partnershipPreference: toggleArrayItem(formData.partnershipPreference, option)
                              })}
                              className={`w-full p-5 rounded-xl border-2 transition-all text-left shadow-md hover:shadow-lg ${
                                formData.partnershipPreference.includes(option)
                                  ? 'border-forest bg-light-mint'
                                  : 'border-warm-gray-200 hover:border-mint bg-white'
                              }`}
                              style={formData.partnershipPreference.includes(option) ? { borderColor: '#456456', backgroundColor: '#E8F4EA' } : {}}
                            >
                              <div className="text-base text-forest font-sans font-medium" style={{ color: '#456456' }}>{option}</div>
                            </button>
                          ))}
                        </>
                      ) : (
                        <>
                          {['Seeking Co-founder / Equity Position', 'Revenue Share', 'Paid Marketing Work', 'Open to Any Arrangement'].map(option => (
                            <button
                              key={option}
                              onClick={() => setFormData({ 
                                ...formData, 
                                preferredArrangement: toggleArrayItem(formData.preferredArrangement, option)
                              })}
                              className={`w-full p-5 rounded-xl border-2 transition-all text-left shadow-md hover:shadow-lg ${
                                formData.preferredArrangement.includes(option)
                                  ? 'border-forest bg-light-mint'
                                  : 'border-warm-gray-200 hover:border-mint bg-white'
                              }`}
                              style={formData.preferredArrangement.includes(option) ? { borderColor: '#456456', backgroundColor: '#E8F4EA' } : {}}
                            >
                              <div className="text-base text-forest font-sans font-medium" style={{ color: '#456456' }}>{option}</div>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Industries for Marketers */}
                  {formData.role === 'marketer' && (
                    <div>
                      <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans font-semibold">
                        what industries interest you? (optional)
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {['Fintech', 'Health & Wellness', 'Productivity', 'Social', 'AI/ML', 'E-commerce', 'Education', 'Gaming', 'Any'].map(industry => (
                          <button
                            key={industry}
                            onClick={() => setFormData({ 
                              ...formData, 
                              industries: toggleArrayItem(formData.industries, industry)
                            })}
                            className={`px-5 py-2.5 rounded-lg transition-all text-sm font-sans font-medium shadow-sm hover:shadow-md ${
                              formData.industries.includes(industry)
                                ? 'bg-forest text-white'
                                : 'bg-white text-warm-gray-700 border border-warm-gray-300 hover:border-mint'
                            }`}
                            style={formData.industries.includes(industry) ? { backgroundColor: '#456456', color: '#FFFFFF' } : {}}
                          >
                            {industry}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 7: Bio */}
            {step === 7 && (
              <motion.div
                key="step7"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-loose text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                    Final step
                  </p>
                  <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                    Tell Your Story
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                    {formData.role === 'builder' 
                      ? 'This is what marketers will see when browsing your projects'
                      : 'This is what builders will see when you reach out'
                    }
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans font-semibold">
                      your bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-forest focus:outline-none transition-colors text-lg text-forest resize-none font-normal"
                      style={{ borderColor: formData.bio ? '#456456' : undefined }}
                      rows={6}
                      placeholder="Make it compelling. Make it you."
                    />
                  </div>

                  <div className="p-6 rounded-xl bg-light-mint border-l-4 border-mint shadow-md" style={{ backgroundColor: '#E8F4EA', borderColor: '#7FB685' }}>
                    <p className="text-sm text-forest font-normal" style={{ color: '#456456' }}>
                      Be authentic. Be specific. Be human. The best connections come from real stories.
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
                className="px-8 py-3.5 rounded-xl border-2 border-mint text-forest hover:border-forest transition-all font-sans font-semibold shadow-md hover:shadow-lg"
                style={{ color: '#456456', borderColor: '#7FB685' }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 px-8 py-3.5 bg-forest text-white rounded-xl hover:bg-dark-green transition-all font-sans font-semibold shadow-lg hover:shadow-xl disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
              disabled={
                uploading ||
                (step === 1 && (!formData.name || !formData.email || !formData.role)) ||
                (step === 2 && (!formData.password || formData.password.length < 6)) ||
                (step === 3 && !formData.experience) ||
                (step === 4 && formData.skills.length === 0) ||
                (step === 5 && formData.role === 'builder' && formData.projects.length === 0) ||
                (step === 5 && formData.role === 'marketer' && (!formData.marketingExperience || !formData.portfolioLinks)) ||
                (step === 6 && formData.role === 'builder' && formData.partnershipPreference.length === 0) ||
                (step === 6 && formData.role === 'marketer' && formData.preferredArrangement.length === 0) ||
                (step === 7 && !formData.bio)
              }
            >
              {uploading ? 'Uploading...' : step === totalSteps ? 'Submit Application' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default SignupPage
