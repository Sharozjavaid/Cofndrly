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
  currentProject?: string
  
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
    currentProject: '',
    
    // Marketer-specific
    marketingExperience: '',
    portfolioLinks: '',
    preferredArrangement: [],
    industries: []
  })
  const [uploading, setUploading] = useState(false)
  const [showCustomSkillInput, setShowCustomSkillInput] = useState(false)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [isEditingProject, setIsEditingProject] = useState(false)

  const totalSteps = userProfile?.role === 'builder' ? 6 : 4

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
      currentProject: userProfile.currentProject || '',
      
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
        updateData.currentProject = formData.currentProject || ''
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
    <div className="min-h-screen bg-white">
      {/* Modern Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b-2 border-mint z-50 shadow-sm" style={{ borderColor: '#7FB685' }}>
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div 
            className="text-2xl font-sans font-bold tracking-tight text-forest cursor-pointer" 
            onClick={() => navigate('/dashboard')}
            style={{ color: '#456456' }}
          >
            GrowMyApp
          </div>
          <div className="text-sm font-sans font-semibold text-mint" style={{ color: '#7FB685' }}>
            Step {step} of {totalSteps}
          </div>
        </div>
      </nav>

      {/* Modern Progress Bar */}
      <div className="fixed top-[73px] w-full h-1 bg-warm-gray-200 z-40">
        <motion.div
          className="h-full bg-gradient-to-r from-forest to-mint"
          style={{ background: 'linear-gradient(90deg, #456456 0%, #7FB685 100%)' }}
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
                  <p className="text-xs uppercase tracking-wider text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                    Basic Info
                  </p>
                  <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                    Edit Your Profile
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                    Update your information to stay connected
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-3 font-sans font-semibold">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-mint focus:outline-none transition-colors text-lg text-forest rounded-lg font-normal shadow-sm"
                      style={{ borderColor: formData.name ? '#7FB685' : undefined }}
                      placeholder="Your full name"
                    />
                  </div>

                  <div>
                    <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-3 font-sans font-semibold">
                      Professional Background
                    </label>
                    <textarea
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-mint focus:outline-none transition-colors text-lg text-forest resize-none rounded-lg font-normal shadow-sm"
                      style={{ borderColor: formData.experience ? '#7FB685' : undefined }}
                      rows={5}
                      placeholder="Share your journey and expertise..."
                      required
                    />
                  </div>

                  {/* Profile Image */}
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-4 font-sans font-semibold">
                      Profile Photo
                    </label>
                    
                    {formData.profileImagePreview && (
                      <div className="mb-4">
                        {formData.profileImagePreview.startsWith('data:image') ? (
                          <div className="w-32 h-32 rounded-full bg-gradient-to-br from-forest to-mint flex items-center justify-center text-5xl font-bold text-white border-4 border-mint shadow-lg" style={{ background: 'linear-gradient(135deg, #456456 0%, #7FB685 100%)', borderColor: '#7FB685' }}>
                            {formData.name.charAt(0).toUpperCase()}
                          </div>
                        ) : (
                          <img
                            src={formData.profileImagePreview}
                            alt="Profile preview"
                            className="w-32 h-32 object-cover rounded-full border-4 border-mint shadow-lg"
                            style={{ borderColor: '#7FB685' }}
                          />
                        )}
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
                        className="px-8 py-3 bg-forest text-white border-2 border-forest hover:bg-dark-green rounded-lg transition-all font-sans font-medium cursor-pointer inline-block shadow-md hover:shadow-lg"
                        style={{ backgroundColor: '#456456', borderColor: '#456456' }}
                      >
                        {formData.profileImage ? 'Change Photo' : 'Upload New Photo'}
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
                  <p className="text-xs uppercase tracking-wider text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                    Expertise
                  </p>
                  <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                    Your Skills
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                    Select your areas of expertise
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-4 font-sans font-semibold">
                      Skills & Expertise
                    </label>
                    
                    {/* Predefined Skills */}
                    <div className="flex flex-wrap gap-3 mb-4">
                      {(userProfile?.role === 'builder' ? builderSkills : marketerSkills).map(skill => (
                        <button
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`px-5 py-2.5 rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg ${
                            formData.skills.includes(skill)
                              ? 'bg-forest text-white'
                              : 'bg-white text-forest border-2 border-mint hover:border-forest'
                          }`}
                          style={{
                            backgroundColor: formData.skills.includes(skill) ? '#456456' : undefined,
                            borderColor: formData.skills.includes(skill) ? undefined : '#7FB685'
                          }}
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
                        <p className="text-xs uppercase tracking-wider text-warm-gray-500 mb-2 font-sans font-semibold">
                          Custom Skills
                        </p>
                        <div className="flex flex-wrap gap-3">
                          {formData.skills
                            .filter(skill => !(userProfile?.role === 'builder' ? builderSkills : marketerSkills).includes(skill))
                            .map(skill => (
                              <div
                                key={skill}
                                className="px-5 py-2.5 rounded-lg bg-light-mint text-forest border-2 border-mint text-sm font-medium flex items-center gap-2 shadow-md"
                                style={{ backgroundColor: '#EFF7F1', borderColor: '#7FB685', color: '#456456' }}
                              >
                                {skill}
                                <button
                                  onClick={() => removeSkill(skill)}
                                  className="text-orange-500 hover:text-forest transition-colors font-bold text-lg"
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
                        className="px-5 py-2.5 rounded-lg bg-light-mint text-forest border-2 border-mint hover:border-forest transition-all text-sm font-medium shadow-md hover:shadow-lg"
                        style={{ backgroundColor: '#EFF7F1', borderColor: '#7FB685', color: '#456456' }}
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
                          className="px-4 py-2.5 bg-white border-2 border-mint focus:border-forest focus:outline-none rounded-lg text-sm text-forest font-normal flex-1 shadow-sm"
                          style={{ borderColor: '#7FB685' }}
                          placeholder="Type your skill..."
                          autoFocus
                        />
                        <button
                          onClick={addCustomSkill}
                          className="px-5 py-2.5 rounded-lg bg-forest text-white hover:bg-dark-green transition-all text-sm font-medium shadow-md hover:shadow-lg"
                          style={{ backgroundColor: '#456456' }}
                        >
                          Add
                        </button>
                        <button
                          onClick={() => {
                            setShowCustomSkillInput(false)
                            setFormData({ ...formData, customSkill: '' })
                          }}
                          className="px-5 py-2.5 rounded-lg bg-white text-forest border-2 border-mint hover:border-forest transition-all text-sm font-medium shadow-md hover:shadow-lg"
                          style={{ borderColor: '#7FB685', color: '#456456' }}
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 3: Current Project (Builders only) */}
            {step === 3 && userProfile?.role === 'builder' && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-wider text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                    Current Focus
                  </p>
                  <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                    What You're Building
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                    What project are you currently working on?
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-3 font-sans font-semibold">
                      Current Project <span className="text-warm-gray-400">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      value={formData.currentProject || ''}
                      onChange={(e) => setFormData({ ...formData, currentProject: e.target.value })}
                      className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-mint focus:outline-none transition-colors text-lg text-forest rounded-lg font-normal shadow-sm"
                      style={{ borderColor: formData.currentProject ? '#7FB685' : undefined }}
                      placeholder="e.g., Building an AI-powered task manager"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Projects (Builders) or Step 3: Marketing Experience (Marketers) */}
            {((step === 4 && userProfile?.role === 'builder') || (step === 3 && userProfile?.role === 'marketer')) && (
              <motion.div
                key={userProfile?.role === 'builder' ? 'step4-builder' : 'step3-marketer'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                {userProfile?.role === 'builder' ? (
                  <>
                    <div className="space-y-4">
                      <p className="text-xs uppercase tracking-wider text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                        Your Projects
                      </p>
                      <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                        Manage Projects
                      </h1>
                      <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                        Add, edit, or remove your projects
                      </p>
                    </div>

                    {/* Current Project Form */}
                    {isEditingProject && (
                      <div className="space-y-8 p-8 bg-white rounded-xl border-2 border-mint shadow-md" style={{ borderColor: '#7FB685' }}>
                        <h3 className="font-sans font-bold text-2xl text-forest" style={{ color: '#456456' }}>
                          {currentProjectIndex < formData.projects.length 
                            ? `Edit Project ${currentProjectIndex + 1}` 
                            : `Add New Project`}
                        </h3>

                        {/* Project Name */}
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-3 font-sans font-semibold">
                            Project Name <span className="text-orange-500">*</span>
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
                            className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-mint focus:outline-none transition-colors text-lg text-forest rounded-lg font-normal shadow-sm"
                            placeholder="My Awesome App"
                          />
                        </div>

                        {/* Project Description */}
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-3 font-sans font-semibold">
                            Description <span className="text-orange-500">*</span>
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
                            className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-mint focus:outline-none transition-colors text-lg text-forest resize-none rounded-lg font-normal shadow-sm"
                            rows={4}
                            placeholder="What does it do? Who is it for?"
                          />
                        </div>

                        {/* Project Stage */}
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-4 font-sans font-semibold">
                            Project Stage <span className="text-orange-500">*</span>
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
                                className={`w-full p-4 rounded-lg border-2 transition-all text-left shadow-md hover:shadow-lg ${
                                  formData.projects[currentProjectIndex]?.stage === stage
                                    ? 'border-mint bg-light-mint'
                                    : 'border-warm-gray-200 hover:border-mint bg-white'
                                }`}
                                style={{
                                  borderColor: formData.projects[currentProjectIndex]?.stage === stage ? '#7FB685' : undefined,
                                  backgroundColor: formData.projects[currentProjectIndex]?.stage === stage ? '#EFF7F1' : undefined
                                }}
                              >
                                <div className="text-sm text-forest font-normal" style={{ color: '#456456' }}>{stage}</div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Project Link */}
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-3 font-sans font-semibold">
                            Project Link <span className="text-orange-500">*</span>
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
                            className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-mint focus:outline-none transition-colors text-lg text-forest rounded-lg font-normal shadow-sm"
                            placeholder="https://..."
                          />
                          <p className="text-sm text-warm-gray-500 mt-2 font-normal">
                            Website, app store, GitHub, etc.
                          </p>
                        </div>

                        {/* Project Logo */}
                        <div>
                          <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-4 font-sans font-semibold">
                            Project Logo <span className="text-warm-gray-400">(Optional)</span>
                          </label>
                          
                          {(formData.projects[currentProjectIndex]?.logoPreview || formData.projects[currentProjectIndex]?.logoUrl) && (
                            <div className="mb-4">
                              <img
                                src={formData.projects[currentProjectIndex]?.logoPreview || formData.projects[currentProjectIndex]?.logoUrl}
                                alt="Logo preview"
                                className="w-24 h-24 object-cover rounded-lg border-2 border-mint shadow-md"
                                style={{ borderColor: '#7FB685' }}
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
                              id={`project-logo-${currentProjectIndex}`}
                            />
                            <label
                              htmlFor={`project-logo-${currentProjectIndex}`}
                              className="px-8 py-3 bg-white text-forest border-2 border-mint hover:border-forest rounded-lg transition-all font-sans font-medium cursor-pointer inline-block shadow-md hover:shadow-lg"
                              style={{ borderColor: '#7FB685', color: '#456456' }}
                            >
                              {formData.projects[currentProjectIndex]?.logo ? 'Change Logo' : 'Upload Logo'}
                            </label>
                          </div>
                        </div>

                        {/* Save Project Button */}
                        <div className="pt-6 border-t-2 border-warm-gray-200 flex gap-3">
                          <button
                            onClick={() => {
                              const currentProject = formData.projects[currentProjectIndex]
                              if (currentProject && currentProject.name && currentProject.description && currentProject.stage && currentProject.link) {
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
                          <button
                            onClick={() => {
                              setIsEditingProject(false)
                              if (currentProjectIndex >= formData.projects.length) {
                                // Remove the empty project if canceling a new project
                                const newProjects = formData.projects.filter((_, i) => i !== currentProjectIndex)
                                setFormData({ ...formData, projects: newProjects })
                              }
                            }}
                            className="px-8 py-3 bg-white text-forest border-2 border-mint hover:border-forest rounded-lg transition-all font-sans font-medium shadow-md hover:shadow-lg"
                            style={{ borderColor: '#7FB685', color: '#456456' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}

                    {/* List of Projects */}
                    {formData.projects.length > 0 && !isEditingProject && (
                      <div className="space-y-4">
                        <p className="text-xs uppercase tracking-wider text-warm-gray-600 font-sans font-semibold">
                          Your Projects ({formData.projects.length})
                        </p>
                        {formData.projects.map((project, index) => (
                          <div key={index} className="p-6 bg-white rounded-xl border-2 border-mint flex items-center justify-between shadow-md hover:shadow-lg transition-all" style={{ borderColor: '#7FB685' }}>
                            <div className="flex items-center gap-4">
                              {(project.logoPreview || project.logoUrl) && (
                                <img src={project.logoPreview || project.logoUrl} alt={project.name} className="w-16 h-16 object-cover rounded-lg border-2 border-mint" style={{ borderColor: '#7FB685' }} />
                              )}
                              <div>
                                <p className="font-sans font-bold text-lg text-forest" style={{ color: '#456456' }}>{project.name}</p>
                                <p className="text-xs text-mint font-medium" style={{ color: '#7FB685' }}>{project.stage}</p>
                              </div>
                            </div>
                            <div className="flex gap-3">
                              <button
                                onClick={() => {
                                  setCurrentProjectIndex(index)
                                  setIsEditingProject(true)
                                }}
                                className="text-sm text-forest hover:text-mint transition-colors font-medium"
                                style={{ color: '#456456' }}
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => {
                                  const newProjects = formData.projects.filter((_, i) => i !== index)
                                  setFormData({ ...formData, projects: newProjects })
                                  if (currentProjectIndex >= newProjects.length) {
                                    setCurrentProjectIndex(Math.max(0, newProjects.length - 1))
                                  }
                                }}
                                className="text-sm text-warm-gray-500 hover:text-orange-500 transition-colors font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {/* Add Another Project Button */}
                        <button
                          onClick={() => {
                            setCurrentProjectIndex(formData.projects.length)
                            setIsEditingProject(true)
                          }}
                          className="w-full py-4 rounded-xl border-2 border-dashed border-mint hover:border-forest hover:bg-light-mint transition-all text-forest font-sans font-medium shadow-md hover:shadow-lg"
                          style={{ borderColor: '#7FB685', color: '#456456' }}
                        >
                          + Add Another Project
                        </button>
                      </div>
                    )}

                    {/* If no projects, show add button */}
                    {formData.projects.length === 0 && !isEditingProject && (
                      <button
                        onClick={() => {
                          setCurrentProjectIndex(0)
                          setIsEditingProject(true)
                        }}
                        className="w-full py-8 rounded-xl border-2 border-dashed border-mint hover:border-forest hover:bg-light-mint transition-all text-forest font-sans font-medium shadow-md hover:shadow-lg"
                        style={{ borderColor: '#7FB685', color: '#456456', backgroundColor: '#EFF7F1' }}
                      >
                        + Add Your First Project
                      </button>
                    )}
                  </>
                ) : (
                  // Marketer Experience
                  <>
                    <div className="space-y-4">
                      <p className="text-xs uppercase tracking-wider text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                        Your Experience
                      </p>
                      <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                        Marketing Background
                      </h1>
                      <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                        Share your marketing experience and results
                      </p>
                    </div>

                    <div className="space-y-8">
                      {/* For Marketers: Marketing Experience */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-3 font-sans font-semibold">
                          Describe Your Marketing Experience
                        </label>
                        <textarea
                          value={formData.marketingExperience}
                          onChange={(e) => setFormData({ ...formData, marketingExperience: e.target.value })}
                          className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-mint focus:outline-none transition-colors text-lg text-forest resize-none rounded-lg font-normal shadow-sm"
                          style={{ borderColor: formData.marketingExperience ? '#7FB685' : undefined }}
                          rows={5}
                          placeholder="What have you marketed? What results did you achieve? Include numbers if possible..."
                          required
                        />
                      </div>

                      {/* Portfolio Links */}
                      <div>
                        <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-3 font-sans font-semibold">
                          Portfolio & Work Samples
                        </label>
                        <textarea
                          value={formData.portfolioLinks}
                          onChange={(e) => setFormData({ ...formData, portfolioLinks: e.target.value })}
                          className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-mint focus:outline-none transition-colors text-lg text-forest resize-none rounded-lg font-normal shadow-sm"
                          style={{ borderColor: formData.portfolioLinks ? '#7FB685' : undefined }}
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

            {/* Step 5: Partnership Preferences (Builders) or Step 4: Arrangement (Marketers) */}
            {((step === 5 && userProfile?.role === 'builder') || (step === 4 && userProfile?.role === 'marketer')) && (
              <motion.div
                key={userProfile?.role === 'builder' ? 'step5-builder' : 'step4-marketer'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-wider text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                    Arrangements
                  </p>
                  <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                    Partnership Terms
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                    {userProfile?.role === 'builder' 
                      ? 'What arrangement are you open to with marketers?'
                      : 'What arrangement are you looking for?'
                    }
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-4 font-sans font-semibold">
                      Select All That Apply
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
                              className={`w-full p-4 rounded-lg border-2 transition-all text-left shadow-md hover:shadow-lg ${
                                formData.partnershipPreference.includes(option)
                                  ? 'border-mint bg-light-mint'
                                  : 'border-warm-gray-200 hover:border-mint bg-white'
                              }`}
                              style={{
                                borderColor: formData.partnershipPreference.includes(option) ? '#7FB685' : undefined,
                                backgroundColor: formData.partnershipPreference.includes(option) ? '#EFF7F1' : undefined
                              }}
                            >
                              <div className="text-sm text-forest font-normal" style={{ color: '#456456' }}>{option}</div>
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
                              className={`w-full p-4 rounded-lg border-2 transition-all text-left shadow-md hover:shadow-lg ${
                                formData.preferredArrangement.includes(option)
                                  ? 'border-mint bg-light-mint'
                                  : 'border-warm-gray-200 hover:border-mint bg-white'
                              }`}
                              style={{
                                borderColor: formData.preferredArrangement.includes(option) ? '#7FB685' : undefined,
                                backgroundColor: formData.preferredArrangement.includes(option) ? '#EFF7F1' : undefined
                              }}
                            >
                              <div className="text-sm text-forest font-normal" style={{ color: '#456456' }}>{option}</div>
                            </button>
                          ))}
                        </>
                      )}
                    </div>
                  </div>

                  {/* Industries for Marketers */}
                  {userProfile?.role === 'marketer' && (
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-4 font-sans font-semibold">
                        What Industries Interest You? <span className="text-warm-gray-400">(Optional)</span>
                      </label>
                      <div className="flex flex-wrap gap-3">
                        {['fintech', 'health & wellness', 'productivity', 'social', 'ai/ml', 'e-commerce', 'education', 'gaming', 'any'].map(industry => (
                          <button
                            key={industry}
                            onClick={() => setFormData({ 
                              ...formData, 
                              industries: toggleArrayItem(formData.industries, industry)
                            })}
                            className={`px-5 py-2.5 rounded-lg transition-all text-sm font-medium shadow-md hover:shadow-lg ${
                              formData.industries.includes(industry)
                                ? 'bg-forest text-white'
                                : 'bg-white text-forest border-2 border-mint hover:border-forest'
                            }`}
                            style={{
                              backgroundColor: formData.industries.includes(industry) ? '#456456' : undefined,
                              borderColor: formData.industries.includes(industry) ? undefined : '#7FB685',
                              color: formData.industries.includes(industry) ? '#FFFFFF' : '#456456'
                            }}
                          >
                            {industry}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Bio for Marketers on this step */}
                {userProfile?.role === 'marketer' && (
                  <div className="space-y-8 pt-8 border-t-2 border-warm-gray-200">
                    <div>
                      <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-3 font-sans font-semibold">
                        Your Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-mint focus:outline-none transition-colors text-lg text-forest resize-none rounded-lg font-normal shadow-sm"
                        style={{ borderColor: formData.bio ? '#7FB685' : undefined }}
                        rows={6}
                        placeholder="Make it compelling. Make it you."
                      />
                    </div>

                    <div className="p-6 rounded-lg bg-light-mint border-l-4 border-mint shadow-md" style={{ backgroundColor: '#EFF7F1', borderColor: '#7FB685' }}>
                      <p className="text-sm text-forest font-normal italic" style={{ color: '#456456' }}>
                        Be authentic. Be specific. Be human. The best connections come from real stories.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 6: Bio (Builders only) */}
            {step === 6 && userProfile?.role === 'builder' && (
              <motion.div
                key="step6-builder"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="space-y-12"
              >
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-wider text-mint font-sans font-semibold" style={{ color: '#7FB685' }}>
                    Final Step
                  </p>
                  <h1 className="font-sans font-extrabold text-5xl md:text-6xl text-forest leading-tight" style={{ color: '#456456' }}>
                    Tell Your Story
                  </h1>
                  <p className="text-lg text-warm-gray-700 font-normal max-w-lg">
                    This is what marketers will see when browsing your projects
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <label className="block text-xs uppercase tracking-wider text-warm-gray-600 mb-3 font-sans font-semibold">
                      Your Bio
                    </label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-4 py-4 bg-white border-2 border-warm-gray-300 focus:border-mint focus:outline-none transition-colors text-lg text-forest resize-none rounded-lg font-normal shadow-sm"
                      style={{ borderColor: formData.bio ? '#7FB685' : undefined }}
                      rows={6}
                      placeholder="Make it compelling. Make it you."
                    />
                  </div>

                  <div className="p-6 rounded-lg bg-light-mint border-l-4 border-mint shadow-md" style={{ backgroundColor: '#EFF7F1', borderColor: '#7FB685' }}>
                    <p className="text-sm text-forest font-normal italic" style={{ color: '#456456' }}>
                      Be authentic. Be specific. Be human. The best connections come from real stories.
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-16 pt-8 border-t-2 border-warm-gray-200">
            {step > 1 && (
              <button
                onClick={handleBack}
                className="px-8 py-3 rounded-lg border-2 border-mint text-forest hover:border-forest hover:bg-light-mint transition-all font-sans font-medium shadow-md hover:shadow-lg"
                style={{ borderColor: '#7FB685', color: '#456456' }}
              >
                Back
              </button>
            )}
            <button
              onClick={handleNext}
              className="flex-1 px-8 py-3 bg-forest text-white rounded-lg hover:bg-dark-green transition-all font-sans font-medium shadow-md hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#456456' }}
              disabled={
                uploading ||
                (step === 1 && (!formData.name || !formData.experience)) ||
                (step === 2 && formData.skills.length === 0) ||
                (step === 4 && userProfile?.role === 'builder' && formData.projects.length === 0) ||
                (step === 3 && userProfile?.role === 'marketer' && (!formData.marketingExperience || !formData.portfolioLinks)) ||
                (step === 5 && userProfile?.role === 'builder' && formData.partnershipPreference.length === 0) ||
                (step === 4 && userProfile?.role === 'marketer' && (!formData.preferredArrangement.length || !formData.bio)) ||
                (step === 6 && userProfile?.role === 'builder' && !formData.bio)
              }
            >
              {uploading ? 'Saving...' : step === totalSteps ? 'Save Changes' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditProfilePage
