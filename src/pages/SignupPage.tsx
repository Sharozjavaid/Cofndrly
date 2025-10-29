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
    'ai/ml', 'blockchain', 'devops', 'ui/ux', 'full stack'
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
        title="Apply to Join cofndrly — Find Your Co-Founder"
        description="Apply to join our curated community of builders and storytellers. Get matched with your ideal co-founder and launch your next startup together."
        keywords="apply co-founder, startup application, join cofndrly, find co-founder, co-founder matching"
        canonicalUrl="https://cofndrly.com/signup"
        noindex={true}
      />
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
                        onClick={() => setFormData({ ...formData, role: 'builder' })}
                        className={`p-8 rounded-sm border-2 transition-all text-left ${
                          formData.role === 'builder'
                            ? 'border-charcoal bg-white'
                            : 'border-warm-gray-200 hover:border-warm-gray-400 bg-white/50'
                        }`}
                      >
                        <div className="text-4xl mb-4">⚙️</div>
                        <div className="font-serif text-2xl mb-2 lowercase text-charcoal">builder</div>
                        <div className="text-sm text-warm-gray-600 font-light">
                          i build products and have shelf projects
                        </div>
                      </button>
                      <button
                        onClick={() => setFormData({ ...formData, role: 'marketer' })}
                        className={`p-8 rounded-sm border-2 transition-all text-left ${
                          formData.role === 'marketer'
                            ? 'border-charcoal bg-white'
                            : 'border-warm-gray-200 hover:border-warm-gray-400 bg-white/50'
                        }`}
                      >
                        <div className="text-4xl mb-4">📈</div>
                        <div className="font-serif text-2xl mb-2 lowercase text-charcoal">marketer</div>
                        <div className="text-sm text-warm-gray-600 font-light">
                          i market products and can help launch projects
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
                  <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                    Security
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    create password
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    secure your account
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                      password (minimum 6 characters)
                    </label>
                    <input
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-xl text-charcoal font-light"
                      placeholder="••••••••"
                      minLength={6}
                    />
                    <p className="mt-2 text-sm text-warm-gray-600 font-light">
                      you'll use this to sign in and access your matches
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
                      rows={5}
                      placeholder="share your journey..."
                      required
                    />
                    <p className="mt-2 text-sm text-warm-gray-500 font-light italic">
                      fill this in to continue
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
                  <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                    Expertise
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    your skills
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    select at least one skill to continue
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                      skills & expertise
                    </label>
                    
                    {/* Predefined Skills */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      {(formData.role === 'builder' ? builderSkills : marketerSkills).map(skill => (
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

                    {/* Custom Skills Added */}
                    {formData.skills.filter(skill => 
                      !(formData.role === 'builder' ? builderSkills : marketerSkills).includes(skill)
                    ).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs uppercase tracking-loose text-warm-gray-500 mb-2 font-sans">
                          custom skills
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {formData.skills
                            .filter(skill => !(formData.role === 'builder' ? builderSkills : marketerSkills).includes(skill))
                            .map(skill => (
                              <div
                                key={skill}
                                className="px-5 py-2.5 rounded-sm bg-rust/10 text-charcoal border border-rust/30 text-sm lowercase flex items-center gap-2"
                              >
                                {skill}
                                <button
                                  onClick={() => removeSkill(skill)}
                                  className="text-rust hover:text-charcoal transition-colors"
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
                        className="px-5 py-2.5 rounded-sm bg-sand text-warm-gray-700 border border-warm-gray-300 hover:border-charcoal transition-all text-sm lowercase"
                      >
                        + add other skill
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
                          className="px-4 py-2.5 bg-white border border-warm-gray-300 focus:border-charcoal focus:outline-none rounded-sm text-sm text-charcoal lowercase flex-1"
                          placeholder="type your skill..."
                          autoFocus
                        />
                        <button
                          onClick={addCustomSkill}
                          className="px-5 py-2.5 rounded-sm bg-charcoal text-cream hover:bg-warm-gray-900 transition-all text-sm lowercase"
                        >
                          add
                        </button>
                        <button
                          onClick={() => {
                            setShowCustomSkillInput(false)
                            setFormData({ ...formData, customSkill: '' })
                          }}
                          className="px-5 py-2.5 rounded-sm bg-white text-warm-gray-700 border border-warm-gray-300 hover:border-charcoal transition-all text-sm lowercase"
                        >
                          cancel
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
                      <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                        Your Projects
                      </p>
                      <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                        add your projects
                      </h1>
                      <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                        add at least one project. you can add more later.
                      </p>
                    </div>

                    {/* Current Project Form */}
                    {currentProjectIndex < formData.projects.length || formData.projects.length === 0 ? (
                      <div className="space-y-8 p-8 bg-white rounded-sm border border-warm-gray-200">
                        <h3 className="font-serif text-2xl text-charcoal lowercase">
                          Project {formData.projects.length + 1}
                        </h3>

                        {/* Project Name */}
                        <div>
                          <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                            project name <span className="text-rust">*</span>
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
                            className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-xl text-charcoal font-light"
                            placeholder="my awesome app"
                          />
                        </div>

                        {/* Project Description */}
                        <div>
                          <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                            description <span className="text-rust">*</span>
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
                            className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal resize-none font-light"
                            rows={4}
                            placeholder="what does it do? who is it for?"
                          />
                        </div>

                        {/* Project Stage */}
                        <div>
                          <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                            project stage <span className="text-rust">*</span>
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
                                className={`w-full p-4 rounded-sm border-2 transition-all text-left ${
                                  formData.projects[currentProjectIndex]?.stage === stage
                                    ? 'border-charcoal bg-white'
                                    : 'border-warm-gray-200 hover:border-warm-gray-400 bg-white/50'
                                }`}
                              >
                                <div className="text-sm lowercase text-charcoal font-light">{stage}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Project Link */}
                        <div>
                          <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                            project link <span className="text-rust">*</span>
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
                            className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal font-light"
                            placeholder="https://..."
                          />
                          <p className="text-sm text-warm-gray-500 mt-2 font-light">
                            website, app store, github, etc.
                          </p>
                        </div>

                        {/* Project Logo */}
                        <div>
                          <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                            project logo <span className="text-warm-gray-400">(optional)</span>
                          </label>
                          
                          {formData.projects[currentProjectIndex]?.logoPreview && (
                            <div className="mb-4">
                              <img
                                src={formData.projects[currentProjectIndex].logoPreview}
                                alt="Logo preview"
                                className="w-24 h-24 object-cover rounded-sm border border-warm-gray-200"
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
                              className="px-8 py-3 bg-white text-charcoal border border-warm-gray-300 hover:border-charcoal rounded-sm transition-all font-sans tracking-relaxed lowercase cursor-pointer inline-block"
                            >
                              {formData.projects[currentProjectIndex]?.logo ? 'change logo' : 'upload logo'}
                            </label>
                          </div>
                        </div>

                        {/* Add Another Project Button */}
                        <div className="pt-6 border-t border-warm-gray-200">
                          <button
                            onClick={() => {
                              const currentProject = formData.projects[currentProjectIndex]
                              if (currentProject && currentProject.name && currentProject.description && currentProject.stage && currentProject.link) {
                                setCurrentProjectIndex(currentProjectIndex + 1)
                              } else {
                                alert('Please complete the current project before adding another.')
                              }
                            }}
                            className="text-sm text-rust hover:text-charcoal transition-colors lowercase"
                          >
                            + add another project (optional)
                          </button>
                        </div>
                      </div>
                    ) : null}

                    {/* List of Added Projects */}
                    {formData.projects.length > 0 && (
                      <div className="space-y-4">
                        <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                          Added Projects ({formData.projects.length})
                        </p>
                        {formData.projects.map((project, index) => (
                          <div key={index} className="p-4 bg-sand rounded-sm border border-warm-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {project.logoPreview && (
                                <img src={project.logoPreview} alt={project.name} className="w-12 h-12 object-cover rounded-sm" />
                              )}
                              <div>
                                <p className="font-serif text-lg text-charcoal lowercase">{project.name}</p>
                                <p className="text-xs text-warm-gray-600">{project.stage}</p>
                              </div>
                            </div>
                            <button
                              onClick={() => {
                                const newProjects = formData.projects.filter((_, i) => i !== index)
                                setFormData({ ...formData, projects: newProjects })
                                if (currentProjectIndex > newProjects.length) {
                                  setCurrentProjectIndex(newProjects.length)
                                }
                              }}
                              className="text-warm-gray-500 hover:text-rust transition-colors"
                            >
                              remove
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Marketer Experience (same as before)
                  <>
                    <div className="space-y-4">
                      <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                        Your Experience
                      </p>
                      <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                        your marketing background
                      </h1>
                      <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                        what marketing experience do you have?
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* For Marketers: Marketing Experience */}
                      <div>
                        <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                          describe your marketing experience
                        </label>
                        <textarea
                          value={formData.marketingExperience}
                          onChange={(e) => setFormData({ ...formData, marketingExperience: e.target.value })}
                          className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal resize-none font-light"
                          rows={5}
                          placeholder="what have you marketed? what results did you achieve? include numbers if possible..."
                          required
                        />
                      </div>

                      {/* Portfolio Links */}
                      <div>
                        <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                          portfolio & work samples
                        </label>
                        <textarea
                          value={formData.portfolioLinks}
                          onChange={(e) => setFormData({ ...formData, portfolioLinks: e.target.value })}
                          className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal resize-none font-light"
                          rows={5}
                          placeholder="share links to your best work...&#10;&#10;campaigns, content, case studies, social media accounts, etc."
                        />
                        <p className="text-sm text-warm-gray-500 mt-2 font-light">
                          paste links (one per line)
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
                  <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                    Arrangements
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    partnership terms
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    {formData.role === 'builder' 
                      ? 'what arrangement are you open to with marketers?'
                      : 'what arrangement are you looking for?'
                    }
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                      select all that apply
                    </label>
                    <div className="space-y-3">
                      {formData.role === 'builder' ? (
                        <>
                          {['co-founder / equity partner', 'revenue share', 'pay for marketing services', 'open to discussion'].map(option => (
                            <button
                              key={option}
                              onClick={() => setFormData({ 
                                ...formData, 
                                partnershipPreference: toggleArrayItem(formData.partnershipPreference, option)
                              })}
                              className={`w-full p-4 rounded-sm border-2 transition-all text-left ${
                                formData.partnershipPreference.includes(option)
                                  ? 'border-charcoal bg-white'
                                  : 'border-warm-gray-200 hover:border-warm-gray-400 bg-white/50'
                              }`}
                            >
                              <div className="text-sm lowercase text-charcoal font-light">{option}</div>
                            </button>
                          ))}
                        </>
                      ) : (
                        <>
                          {['seeking co-founder / equity position', 'revenue share', 'paid marketing work', 'open to any arrangement'].map(option => (
                            <button
                              key={option}
                              onClick={() => setFormData({ 
                                ...formData, 
                                preferredArrangement: toggleArrayItem(formData.preferredArrangement, option)
                              })}
                              className={`w-full p-4 rounded-sm border-2 transition-all text-left ${
                                formData.preferredArrangement.includes(option)
                                  ? 'border-charcoal bg-white'
                                  : 'border-warm-gray-200 hover:border-warm-gray-400 bg-white/50'
                              }`}
                            >
                              <div className="text-sm lowercase text-charcoal font-light">{option}</div>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Industries for Marketers */}
                  {formData.role === 'marketer' && (
                    <div>
                      <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                        what industries interest you? (optional)
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {['fintech', 'health & wellness', 'productivity', 'social', 'ai/ml', 'e-commerce', 'education', 'gaming', 'any'].map(industry => (
                          <button
                            key={industry}
                            onClick={() => setFormData({ 
                              ...formData, 
                              industries: toggleArrayItem(formData.industries, industry)
                            })}
                            className={`px-5 py-2.5 rounded-sm transition-all text-sm lowercase ${
                              formData.industries.includes(industry)
                                ? 'bg-charcoal text-cream'
                                : 'bg-white text-warm-gray-700 border border-warm-gray-300 hover:border-charcoal'
                            }`}
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
                  <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                    Final step
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    tell your story
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    {formData.role === 'builder' 
                      ? 'this is what marketers will see when browsing your projects'
                      : 'this is what builders will see when you reach out'
                    }
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
                      be authentic. be specific. be human. the best connections come from real stories.
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
              {uploading ? 'uploading...' : step === totalSteps ? 'submit application' : 'continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default SignupPage
