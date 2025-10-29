import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { storage, db } from '../firebase/config'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { doc, updateDoc } from 'firebase/firestore'
import { useAuth } from '../contexts/AuthContext'

interface FormData {
  name: string
  bio: string
  skills: string[]
  experience: string
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
    logoUrl?: string // existing logo URL
  }>
  partnershipPreference: string[]
  
  // Marketer-specific fields
  marketingExperience: string
  portfolioLinks: string
  preferredArrangement: string[]
  industries: string[]
}

const EditProfilePage = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    name: '',
    bio: '',
    skills: [],
    experience: '',
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

  const totalSteps = userProfile?.role === 'builder' ? 5 : 4

  // Load existing profile data
  useEffect(() => {
    if (!currentUser || !userProfile) {
      navigate('/login')
      return
    }

    setFormData({
      name: userProfile.name || '',
      bio: userProfile.bio || '',
      skills: userProfile.skills || [],
      experience: userProfile.experience || '',
      profileImage: null,
      profileImagePreview: userProfile.profileImageUrl || '',
      customSkill: '',
      
      // Builder-specific
      projects: userProfile.projects?.map((p: any) => ({
        ...p,
        logo: null,
        logoPreview: p.logoUrl || ''
      })) || [],
      partnershipPreference: userProfile.partnershipPreference || [],
      
      // Marketer-specific
      marketingExperience: userProfile.marketingExperience || '',
      portfolioLinks: userProfile.portfolioLinks || '',
      preferredArrangement: userProfile.preferredArrangement || [],
      industries: userProfile.industries || []
    })
  }, [currentUser, userProfile, navigate])

  const handleNext = async () => {
    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      await handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!currentUser) return

    try {
      setUploading(true)
      
      let profileImageUrl = formData.profileImagePreview

      // Upload new profile image if changed
      if (formData.profileImage) {
        const imageRef = ref(storage, `profile-images/${Date.now()}_${formData.profileImage.name}`)
        await uploadBytes(imageRef, formData.profileImage)
        profileImageUrl = await getDownloadURL(imageRef)
      }

      // Upload project logos for builders
      const projectsWithLogos = await Promise.all(
        formData.projects.map(async (project) => {
          let logoUrl = project.logoUrl || project.logoPreview
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

      // Update user profile in Firestore
      const updateData: any = {
        name: formData.name,
        bio: formData.bio,
        skills: formData.skills,
        experience: formData.experience,
        profileImageUrl: profileImageUrl,
      }

      // Add role-specific fields
      if (userProfile?.role === 'builder') {
        updateData.projects = projectsWithLogos
        updateData.partnershipPreference = formData.partnershipPreference
      } else if (userProfile?.role === 'marketer') {
        updateData.marketingExperience = formData.marketingExperience
        updateData.portfolioLinks = formData.portfolioLinks
        updateData.preferredArrangement = formData.preferredArrangement
        updateData.industries = formData.industries
      }

      await updateDoc(doc(db, 'users', currentUser.uid), updateData)

      setUploading(false)
      alert('✅ Profile updated successfully!')
      navigate('/profile')
    } catch (error: any) {
      console.error('Error updating profile:', error)
      setUploading(false)
      alert('Error updating profile. Please try again.')
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

  if (!currentUser || !userProfile) {
    return null
  }

  return (
    <div className="min-h-screen bg-cream grain">
      {/* Minimal Navigation */}
      <nav className="fixed top-0 w-full bg-cream/80 backdrop-blur-md border-b border-warm-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div 
            className="text-xl font-serif tracking-tight lowercase text-charcoal cursor-pointer" 
            onClick={() => navigate('/dashboard')}
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
            {/* Step 1: Basic Info & Experience */}
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
                    Basic Info
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    edit your profile
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    update your information
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
                  </div>

                  {/* Profile Image */}
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                      profile photo
                    </label>
                    
                    {formData.profileImagePreview && (
                      <div className="mb-4">
                        <img
                          src={formData.profileImagePreview}
                          alt="Profile preview"
                          className="w-32 h-32 object-cover rounded-full border-2 border-warm-gray-200"
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
                            setFormData({
                              ...formData,
                              profileImage: file,
                              profileImagePreview: URL.createObjectURL(file)
                            })
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="profile-image"
                      />
                      <label
                        htmlFor="profile-image"
                        className="px-8 py-3 bg-white text-charcoal border border-warm-gray-300 hover:border-charcoal rounded-sm transition-all font-sans tracking-relaxed lowercase cursor-pointer inline-block"
                      >
                        {formData.profileImage ? 'change photo' : 'upload new photo'}
                      </label>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 2: Skills & Expertise */}
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
                    Expertise
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    your skills
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    update your skills
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                      skills & expertise
                    </label>
                    
                    {/* Predefined Skills */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      {(userProfile?.role === 'builder' ? builderSkills : marketerSkills).map(skill => (
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
                      !(userProfile?.role === 'builder' ? builderSkills : marketerSkills).includes(skill)
                    ).length > 0 && (
                      <div className="mb-4">
                        <p className="text-xs uppercase tracking-loose text-warm-gray-500 mb-2 font-sans">
                          custom skills
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {formData.skills
                            .filter(skill => !(userProfile?.role === 'builder' ? builderSkills : marketerSkills).includes(skill))
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

            {/* Step 3: Projects (Builders) or Marketing Experience (Marketers) */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                {userProfile?.role === 'builder' ? (
                  <>
                    <div className="space-y-4">
                      <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                        Your Projects
                      </p>
                      <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                        manage projects
                      </h1>
                      <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                        add, edit, or remove your projects
                      </p>
                    </div>

                    {/* Current Project Form */}
                    {currentProjectIndex <= formData.projects.length && (
                      <div className="space-y-8 p-8 bg-white rounded-sm border border-warm-gray-200">
                        <h3 className="font-serif text-2xl text-charcoal lowercase">
                          {currentProjectIndex < formData.projects.length 
                            ? `Edit Project ${currentProjectIndex + 1}` 
                            : `Add New Project`}
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
                          
                          {(formData.projects[currentProjectIndex]?.logoPreview || formData.projects[currentProjectIndex]?.logoUrl) && (
                            <div className="mb-4">
                              <img
                                src={formData.projects[currentProjectIndex]?.logoPreview || formData.projects[currentProjectIndex]?.logoUrl}
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

                        {/* Save or Add Another Project */}
                        <div className="pt-6 border-t border-warm-gray-200 flex gap-3">
                          {currentProjectIndex < formData.projects.length && (
                            <button
                              onClick={() => {
                                if (currentProjectIndex < formData.projects.length - 1) {
                                  setCurrentProjectIndex(currentProjectIndex + 1)
                                } else {
                                  setCurrentProjectIndex(formData.projects.length)
                                }
                              }}
                              className="text-sm text-charcoal hover:text-rust transition-colors lowercase"
                            >
                              → next project
                            </button>
                          )}
                          <button
                            onClick={() => {
                              const currentProject = formData.projects[currentProjectIndex]
                              if (currentProject && currentProject.name && currentProject.description && currentProject.stage && currentProject.link) {
                                setCurrentProjectIndex(formData.projects.length)
                              } else {
                                alert('Please complete the current project before adding another.')
                              }
                            }}
                            className="text-sm text-rust hover:text-charcoal transition-colors lowercase"
                          >
                            + add another project
                          </button>
                        </div>
                      </div>
                    )}

                    {/* List of Projects */}
                    {formData.projects.length > 0 && (
                      <div className="space-y-4">
                        <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                          Your Projects ({formData.projects.length})
                        </p>
                        {formData.projects.map((project, index) => (
                          <div key={index} className="p-4 bg-sand rounded-sm border border-warm-gray-200 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {(project.logoPreview || project.logoUrl) && (
                                <img src={project.logoPreview || project.logoUrl} alt={project.name} className="w-12 h-12 object-cover rounded-sm" />
                              )}
                              <div>
                                <p className="font-serif text-lg text-charcoal lowercase">{project.name}</p>
                                <p className="text-xs text-warm-gray-600">{project.stage}</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => setCurrentProjectIndex(index)}
                                className="text-sm text-charcoal hover:text-rust transition-colors lowercase"
                              >
                                edit
                              </button>
                              <button
                                onClick={() => {
                                  const newProjects = formData.projects.filter((_, i) => i !== index)
                                  setFormData({ ...formData, projects: newProjects })
                                  if (currentProjectIndex >= newProjects.length) {
                                    setCurrentProjectIndex(Math.max(0, newProjects.length - 1))
                                  }
                                }}
                                className="text-sm text-warm-gray-500 hover:text-rust transition-colors lowercase"
                              >
                                remove
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  // Marketer Experience
                  <>
                    <div className="space-y-4">
                      <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                        Your Experience
                      </p>
                      <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                        your marketing background
                      </h1>
                      <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                        update your marketing experience
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

            {/* Step 4: Partnership Preferences (Builders) or Step 4: Industries (Marketers) */}
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
                    Arrangements
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    partnership terms
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    {userProfile?.role === 'builder' 
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
                      {userProfile?.role === 'builder' ? (
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
                  {userProfile?.role === 'marketer' && (
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

            {/* Step 5: Bio (Builders only) */}
            {step === 5 && userProfile?.role === 'builder' && (
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
                    Final step
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    tell your story
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    this is what marketers will see when browsing your projects
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

            {/* Bio step for Marketers (step 4 becomes final) */}
            {step === 4 && userProfile?.role === 'marketer' && (
              <motion.div
                key="step4-marketer-bio"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-loose text-warm-gray-600 font-sans">
                    Bio
                  </p>
                  <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight">
                    your bio
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-light max-w-lg">
                    this is what builders will see when you reach out
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                      tell your story
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
                (step === 1 && (!formData.name || !formData.experience)) ||
                (step === 2 && formData.skills.length === 0) ||
                (step === 3 && userProfile?.role === 'builder' && formData.projects.length === 0) ||
                (step === 3 && userProfile?.role === 'marketer' && (!formData.marketingExperience || !formData.portfolioLinks)) ||
                (step === 4 && userProfile?.role === 'builder' && formData.partnershipPreference.length === 0) ||
                (step === 4 && userProfile?.role === 'marketer' && (!formData.preferredArrangement.length || !formData.bio)) ||
                (step === 5 && userProfile?.role === 'builder' && !formData.bio)
              }
            >
              {uploading ? 'saving...' : step === totalSteps ? 'save changes' : 'continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage

