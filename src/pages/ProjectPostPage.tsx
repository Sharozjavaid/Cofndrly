import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { db, storage } from '../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { useAuth } from '../contexts/AuthContext'

interface ProjectFormData {
  title: string
  description: string
  techStack: string[]
  currentState: string
  category: string
  projectUrl: string
  githubUrl: string
  images: File[]
  imagePreviews: string[]
  partnershipTerms: string[]
  customTechStack: string
}

const ProjectPostPage = () => {
  const navigate = useNavigate()
  const { currentUser, userProfile } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [showCustomTech, setShowCustomTech] = useState(false)
  
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    techStack: [],
    currentState: '',
    category: '',
    projectUrl: '',
    githubUrl: '',
    images: [],
    imagePreviews: [],
    partnershipTerms: [],
    customTechStack: ''
  })

  const techStackOptions = [
    'react', 'react native', 'vue', 'angular', 'svelte',
    'node.js', 'python', 'django', 'flask', 'ruby on rails',
    'ios (swift)', 'android (kotlin)', 'flutter',
    'firebase', 'supabase', 'mongodb', 'postgresql',
    'ai/ml', 'openai', 'blockchain', 'web3'
  ]

  const projectCategories = [
    'mobile app', 'web app', 'saas', 'ai tool', 
    'chrome extension', 'api/developer tool', 'other'
  ]

  const projectStates = [
    'idea / concept', 'in development', 'mvp complete', 
    'beta / testing', 'launched (low traction)', 'launched (needs marketing)'
  ]

  const toggleArrayItem = (array: string[], item: string) => {
    return array.includes(item)
      ? array.filter(i => i !== item)
      : [...array, item]
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length + formData.images.length > 5) {
      alert('Maximum 5 images allowed')
      return
    }

    const newImages = [...formData.images, ...files]
    const newPreviews = [...formData.imagePreviews, ...files.map(file => URL.createObjectURL(file))]
    
    setFormData({
      ...formData,
      images: newImages,
      imagePreviews: newPreviews
    })
  }

  const removeImage = (index: number) => {
    const newImages = formData.images.filter((_, i) => i !== index)
    const newPreviews = formData.imagePreviews.filter((_, i) => i !== index)
    setFormData({
      ...formData,
      images: newImages,
      imagePreviews: newPreviews
    })
  }

  const addCustomTech = () => {
    if (formData.customTechStack.trim()) {
      setFormData({
        ...formData,
        techStack: [...formData.techStack, formData.customTechStack.trim().toLowerCase()],
        customTechStack: ''
      })
      setShowCustomTech(false)
    }
  }

  const handleSubmit = async () => {
    if (!currentUser || !userProfile) return

    setSubmitting(true)
    try {
      // Upload images to Firebase Storage
      const imageUrls: string[] = []
      for (const image of formData.images) {
        const imageRef = ref(storage, `project-images/${Date.now()}_${image.name}`)
        await uploadBytes(imageRef, image)
        const url = await getDownloadURL(imageRef)
        imageUrls.push(url)
      }

      // Create project document in Firestore
      await addDoc(collection(db, 'projects'), {
        userId: currentUser.uid,
        userName: userProfile.name,
        userProfileImage: userProfile.profileImageUrl,
        title: formData.title,
        description: formData.description,
        techStack: formData.techStack,
        currentState: formData.currentState,
        category: formData.category,
        projectUrl: formData.projectUrl,
        githubUrl: formData.githubUrl,
        imageUrls: imageUrls,
        partnershipTerms: formData.partnershipTerms,
        createdAt: serverTimestamp(),
        status: 'active',
        views: 0,
        interests: 0
      })

      alert('🎉 Project posted successfully!')
      navigate('/dashboard')
    } catch (error) {
      console.error('Error posting project:', error)
      alert('Error posting project. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Redirect if not a builder
  if (!currentUser || userProfile?.role !== 'builder') {
    navigate('/')
    return null
  }

  return (
    <div className="min-h-screen bg-cream grain">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-cream/80 backdrop-blur-md border-b border-warm-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <div 
            className="text-xl font-serif tracking-tight lowercase text-charcoal cursor-pointer" 
            onClick={() => navigate('/')}
          >
            cofndrly
          </div>
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm text-warm-gray-600 hover:text-charcoal transition-colors lowercase tracking-relaxed"
          >
            back to dashboard
          </button>
        </div>
      </nav>

      <div className="pt-32 pb-20 px-8">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="mb-12">
              <p className="text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                Post a Project
              </p>
              <h1 className="font-serif text-5xl md:text-6xl text-charcoal lowercase leading-tight mb-4">
                share your shelf project
              </h1>
              <p className="text-lg text-warm-gray-700 font-light max-w-2xl">
                tell marketers about what you've built and what you're looking for
              </p>
            </div>

            {/* Form */}
            <div className="space-y-12">
              {/* Project Title */}
              <div>
                <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                  project name <span className="text-rust">*</span>
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-xl text-charcoal font-light"
                  placeholder="my awesome project"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                  description <span className="text-rust">*</span>
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal resize-none font-light"
                  rows={6}
                  placeholder="what does it do? what problem does it solve? who is it for?"
                />
                <p className="text-sm text-warm-gray-500 mt-2 font-light">
                  be descriptive — this is what marketers will see first
                </p>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                  category <span className="text-rust">*</span>
                </label>
                <div className="flex flex-wrap gap-3">
                  {projectCategories.map(category => (
                    <button
                      key={category}
                      onClick={() => setFormData({ ...formData, category })}
                      className={`px-5 py-2.5 rounded-sm transition-all text-sm lowercase ${
                        formData.category === category
                          ? 'bg-charcoal text-cream'
                          : 'bg-white text-warm-gray-700 border border-warm-gray-300 hover:border-charcoal'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Current State */}
              <div>
                <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                  current state <span className="text-rust">*</span>
                </label>
                <div className="space-y-3">
                  {projectStates.map(state => (
                    <button
                      key={state}
                      onClick={() => setFormData({ ...formData, currentState: state })}
                      className={`w-full p-4 rounded-sm border-2 transition-all text-left ${
                        formData.currentState === state
                          ? 'border-charcoal bg-white'
                          : 'border-warm-gray-200 hover:border-warm-gray-400 bg-white/50'
                      }`}
                    >
                      <div className="text-sm lowercase text-charcoal font-light">{state}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Tech Stack */}
              <div>
                <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                  tech stack <span className="text-rust">*</span>
                </label>
                <div className="flex flex-wrap gap-3 mb-4">
                  {techStackOptions.map(tech => (
                    <button
                      key={tech}
                      onClick={() => setFormData({ 
                        ...formData, 
                        techStack: toggleArrayItem(formData.techStack, tech)
                      })}
                      className={`px-5 py-2.5 rounded-sm transition-all text-sm lowercase ${
                        formData.techStack.includes(tech)
                          ? 'bg-charcoal text-cream'
                          : 'bg-white text-warm-gray-700 border border-warm-gray-300 hover:border-charcoal'
                      }`}
                    >
                      {tech}
                    </button>
                  ))}
                </div>

                {/* Custom tech */}
                {formData.techStack.filter(tech => !techStackOptions.includes(tech)).length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs uppercase tracking-loose text-warm-gray-500 mb-2 font-sans">
                      custom tech
                    </p>
                    <div className="flex flex-wrap gap-3">
                      {formData.techStack
                        .filter(tech => !techStackOptions.includes(tech))
                        .map(tech => (
                          <div
                            key={tech}
                            className="px-5 py-2.5 rounded-sm bg-rust/10 text-charcoal border border-rust/30 text-sm lowercase flex items-center gap-2"
                          >
                            {tech}
                            <button
                              onClick={() => setFormData({
                                ...formData,
                                techStack: formData.techStack.filter(t => t !== tech)
                              })}
                              className="text-rust hover:text-charcoal transition-colors"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                )}

                {!showCustomTech ? (
                  <button
                    onClick={() => setShowCustomTech(true)}
                    className="px-5 py-2.5 rounded-sm bg-sand text-warm-gray-700 border border-warm-gray-300 hover:border-charcoal transition-all text-sm lowercase"
                  >
                    + add other tech
                  </button>
                ) : (
                  <div className="flex gap-3 items-center">
                    <input
                      type="text"
                      value={formData.customTechStack}
                      onChange={(e) => setFormData({ ...formData, customTechStack: e.target.value })}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          addCustomTech()
                        }
                      }}
                      className="px-4 py-2.5 bg-white border border-warm-gray-300 focus:border-charcoal focus:outline-none rounded-sm text-sm text-charcoal lowercase flex-1"
                      placeholder="type tech name..."
                      autoFocus
                    />
                    <button
                      onClick={addCustomTech}
                      className="px-5 py-2.5 rounded-sm bg-charcoal text-cream hover:bg-warm-gray-900 transition-all text-sm lowercase"
                    >
                      add
                    </button>
                    <button
                      onClick={() => {
                        setShowCustomTech(false)
                        setFormData({ ...formData, customTechStack: '' })
                      }}
                      className="px-5 py-2.5 rounded-sm bg-white text-warm-gray-700 border border-warm-gray-300 hover:border-charcoal transition-all text-sm lowercase"
                    >
                      cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Links */}
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                    project url <span className="text-warm-gray-400">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.projectUrl}
                    onChange={(e) => setFormData({ ...formData, projectUrl: e.target.value })}
                    className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal font-light"
                    placeholder="https://..."
                  />
                </div>

                <div>
                  <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-3 font-sans">
                    github url <span className="text-warm-gray-400">(optional)</span>
                  </label>
                  <input
                    type="url"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-0 py-4 bg-transparent border-b-2 border-warm-gray-300 focus:border-charcoal focus:outline-none transition-colors text-lg text-charcoal font-light"
                    placeholder="https://github.com/..."
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                  project images <span className="text-warm-gray-400">(optional, max 5)</span>
                </label>
                
                {formData.imagePreviews.length > 0 && (
                  <div className="grid grid-cols-3 gap-4 mb-4">
                    {formData.imagePreviews.map((preview, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-sm border border-warm-gray-200"
                        />
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 w-6 h-6 bg-charcoal text-cream rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {formData.images.length < 5 && (
                  <div className="relative">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="project-images"
                    />
                    <label
                      htmlFor="project-images"
                      className="px-8 py-3 bg-white text-charcoal border border-warm-gray-300 hover:border-charcoal rounded-sm transition-all font-sans tracking-relaxed lowercase cursor-pointer inline-block"
                    >
                      + add images
                    </label>
                  </div>
                )}
              </div>

              {/* Partnership Terms */}
              <div>
                <label className="block text-xs uppercase tracking-loose text-warm-gray-600 mb-4 font-sans">
                  partnership terms <span className="text-rust">*</span>
                </label>
                <p className="text-sm text-warm-gray-600 mb-4 font-light">
                  what arrangement are you open to? (select all that apply)
                </p>
                <div className="space-y-3">
                  {['co-founder / equity partner', 'revenue share', 'pay for marketing services', 'open to discussion'].map(term => (
                    <button
                      key={term}
                      onClick={() => setFormData({ 
                        ...formData, 
                        partnershipTerms: toggleArrayItem(formData.partnershipTerms, term)
                      })}
                      className={`w-full p-4 rounded-sm border-2 transition-all text-left ${
                        formData.partnershipTerms.includes(term)
                          ? 'border-charcoal bg-white'
                          : 'border-warm-gray-200 hover:border-warm-gray-400 bg-white/50'
                      }`}
                    >
                      <div className="text-sm lowercase text-charcoal font-light">{term}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-8 border-t border-warm-gray-200">
                <button
                  onClick={handleSubmit}
                  disabled={
                    submitting ||
                    !formData.title ||
                    !formData.description ||
                    !formData.category ||
                    !formData.currentState ||
                    formData.techStack.length === 0 ||
                    formData.partnershipTerms.length === 0
                  }
                  className="w-full px-8 py-4 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase disabled:opacity-30 disabled:cursor-not-allowed text-lg"
                >
                  {submitting ? 'posting project...' : 'post project'}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

export default ProjectPostPage

