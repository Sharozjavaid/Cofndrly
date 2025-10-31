import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRef, useState } from 'react'
import SEO from '../components/SEO'

const LandingPage = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const [activeTab, setActiveTab] = useState<'builder' | 'marketer'>('builder')
  const [userType, setUserType] = useState<'builder' | 'marketer' | null>(null)
  const [showTypeModal, setShowTypeModal] = useState(true)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <>
      <SEO
        title="GrowMyApp — Turn Your Shelf Projects Into Revenue"
        description="Connect builders with marketers. Got projects collecting dust? Find marketers who can bring them to market. Looking to market ready-to-launch products? Find builders who need your help."
        keywords="project marketplace, builder marketer platform, launch shelf projects, marketing partnerships, technical projects, co-founder, revenue share, project collaboration"
        canonicalUrl="https://GrowMyApp.com/"
      />

      {/* User Type Selection Modal */}
      {showTypeModal && !userType && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full p-6 md:p-12 mx-4"
          >
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4 text-center font-sans">
              Welcome to GrowMyApp
            </h2>
            <p className="text-base md:text-lg text-warm-gray-600 mb-6 md:mb-8 text-center font-sans">
              Are you a builder or a marketer?
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {/* Builder Option */}
              <button
                onClick={() => {
                  setUserType('builder')
                  setActiveTab('builder')
                  setShowTypeModal(false)
                }}
                className="group relative bg-gradient-to-br from-light-mint to-white rounded-2xl p-6 md:p-8 border-2 border-mint hover:border-forest transition-all duration-300 hover:shadow-xl"
                style={{ borderColor: '#7FB685' }}
              >
                <div className="flex flex-col items-center text-center gap-3 md:gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-forest rounded-2xl flex items-center justify-center text-3xl md:text-4xl group-hover:scale-110 transition-transform" style={{ backgroundColor: '#456456' }}>
                    <span>⚙️</span>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-forest mb-1 md:mb-2 font-sans" style={{ color: '#456456' }}>
                      I'm a Builder
                    </h3>
                    <p className="text-xs md:text-sm text-warm-gray-600 font-sans">
                      I have projects that need marketing
                    </p>
                  </div>
                </div>
              </button>

              {/* Marketer Option */}
              <button
                onClick={() => {
                  setUserType('marketer')
                  setActiveTab('marketer')
                  setShowTypeModal(false)
                }}
                className="group relative bg-gradient-to-br from-peach/20 to-white rounded-2xl p-6 md:p-8 border-2 border-bright-orange hover:border-bright-orange transition-all duration-300 hover:shadow-xl"
                style={{ borderColor: '#F5A65B' }}
              >
                <div className="flex flex-col items-center text-center gap-3 md:gap-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-bright-orange rounded-2xl flex items-center justify-center text-3xl md:text-4xl group-hover:scale-110 transition-transform" style={{ backgroundColor: '#F5A65B' }}>
                    <span>📈</span>
                  </div>
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold text-bright-orange mb-1 md:mb-2 font-sans" style={{ color: '#F5A65B' }}>
                      I'm a Marketer
                    </h3>
                    <p className="text-xs md:text-sm text-warm-gray-600 font-sans">
                      I want to grow products for equity
                    </p>
                  </div>
                </div>
              </button>
            </div>

            <p className="text-xs text-warm-gray-500 text-center mt-4 md:mt-6 font-sans">
              Don't worry, you can explore both options later
            </p>
          </motion.div>
        </div>
      )}

      <div className="min-h-screen bg-white">
        {/* Minimal Navigation */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md border-b border-warm-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-8 py-5 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-3"
          >
            <img src="/logo-bg.png" alt="GrowMyApp Logo" className="w-16 h-16" />
            <span className="text-3xl font-bold tracking-tight text-forest" style={{ color: '#456456' }}>
              GrowMyApp
            </span>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-4"
          >
            <button
              onClick={() => navigate('/login')}
              className="px-7 py-3 bg-transparent text-forest rounded-lg border-2 border-mint hover:border-forest transition-all font-sans text-base font-medium"
              style={{ color: '#456456', borderColor: '#7FB685', backgroundColor: 'transparent' }}
            >
              Sign In
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-7 py-3 bg-forest text-white rounded-lg hover:bg-dark-green transition-all font-sans text-base font-medium shadow-lg"
              style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section - Split Screen */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center px-4 md:px-8 pt-48 md:pt-32 pb-8 relative overflow-hidden bg-gradient-to-br from-white via-warm-gray-50 to-light-mint/10" aria-label="Hero section">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-[1400px] w-full relative z-10"
        >
          <div className="grid lg:grid-cols-[0.95fr_1.05fr] gap-8 lg:gap-12 items-center">
            {/* Left: Typography */}
            <article className="space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                {/* Pill Badge - Dynamic based on userType */}
                {(!userType || userType === 'builder') && (
                  <div className="inline-flex items-center gap-2 bg-light-mint/80 px-6 py-3 rounded-full mb-6" style={{ backgroundColor: 'rgba(127, 182, 133, 0.2)' }}>
                    <span className="text-xl">💡</span>
                    <span className="text-sm md:text-base font-bold uppercase tracking-wide text-forest" style={{ color: '#456456' }}>
                      Stop Leaving Money on the Table
                    </span>
                  </div>
                )}

                {userType === 'marketer' && (
                  <div className="inline-flex items-center gap-2 bg-peach/30 px-6 py-3 rounded-full mb-6" style={{ backgroundColor: 'rgba(245, 166, 91, 0.2)' }}>
                    <span className="text-xl">💰</span>
                    <span className="text-sm md:text-base font-bold uppercase tracking-wide text-bright-orange" style={{ color: '#F5A65B' }}>
                      Get Paid What You're Worth
                    </span>
                  </div>
                )}

                {/* Main Heading - Dynamic based on userType */}
                {(!userType || userType === 'builder') && (
                  <>
                    <h1 className="font-sans font-black text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.95] text-gray-900 mb-5">
                      Your Projects<br />
                      Deserve<br />
                      <span className="text-forest" style={{ color: '#456456' }}>Growth</span>
                    </h1>

                    {/* Subheading - Builder */}
                    <p className="text-xl md:text-2xl lg:text-3xl text-warm-gray-700 leading-relaxed font-normal max-w-xl mb-6 font-sans">
                      Share your shelf apps with marketers. Partner for equity—zero downside, all upside.
                    </p>
                  </>
                )}

                {userType === 'marketer' && (
                  <>
                    <h1 className="font-sans font-black text-6xl md:text-7xl lg:text-8xl xl:text-9xl leading-[0.95] text-gray-900 mb-5">
                      Your Marketing<br />
                      Deserves<br />
                      <span className="text-bright-orange" style={{ color: '#F5A65B' }}>Equity</span>
                    </h1>

                    {/* Subheading - Marketer */}
                    <p className="text-xl md:text-2xl lg:text-3xl text-warm-gray-700 leading-relaxed font-normal max-w-xl mb-6 font-sans">
                      Browse ready-made apps and negotiate ownership, not flat fees.
                    </p>
                  </>
                )}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <button
                  onClick={() => navigate('/signup')}
                  className="px-10 py-5 bg-forest text-white rounded-xl hover:bg-dark-green transition-all font-sans font-bold text-lg shadow-xl hover:shadow-2xl"
                  style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
                  aria-label="Get started free"
                >
                  Get Started Free
                </button>
                <button
                  onClick={() => {
                    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })
                  }}
                  className="px-10 py-5 bg-white text-forest rounded-xl border-2 border-mint hover:border-forest transition-all font-sans font-bold text-lg"
                  style={{ backgroundColor: '#FFFFFF', color: '#456456', borderColor: '#7FB685' }}
                  aria-label="Learn more"
                >
                  Learn More
                </button>
              </motion.div>

              {/* Social Proof - Bigger */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8 }}
                className="flex items-center gap-4 pt-3"
              >
                <div className="flex -space-x-2">
                  <div className="w-12 h-12 rounded-full bg-forest flex items-center justify-center text-white border-2 border-white" style={{ backgroundColor: '#456456' }}>
                    <span className="text-base">⚙️</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-bright-orange flex items-center justify-center text-white border-2 border-white" style={{ backgroundColor: '#F5A65B' }}>
                    <span className="text-base">📈</span>
                  </div>
                  <div className="w-12 h-12 rounded-full bg-forest flex items-center justify-center text-white border-2 border-white" style={{ backgroundColor: '#456456' }}>
                    <span className="text-base">⚙️</span>
                  </div>
                </div>
                <p className="text-base md:text-lg text-warm-gray-700 font-semibold">
                  Join 100+ builders & marketers turning ideas into income
                </p>
              </motion.div>
            </article>

            {/* Right: Logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="hidden lg:flex items-center justify-center"
            >
              <img 
                src="/logo-bg.png" 
                alt="GrowMyApp Logo" 
                className="w-full max-w-[600px] h-auto opacity-90"
              />
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section - Problems */}
      <section className="py-16 px-8 bg-white" aria-labelledby="philosophy-heading">
        <div className="max-w-6xl mx-auto">
          {/* Toggle Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-12"
          >
            <div className="inline-flex rounded-2xl border-2 border-warm-gray-200 p-2 bg-warm-gray-50">
              <button
                onClick={() => setActiveTab('builder')}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'builder'
                    ? 'bg-forest text-white shadow-lg'
                    : 'bg-transparent text-warm-gray-600 hover:text-forest'
                }`}
                style={activeTab === 'builder' ? { backgroundColor: '#456456', color: '#FFFFFF' } : {}}
              >
                <span className="text-2xl">⚙️</span>
                For Builders
              </button>
              <button
                onClick={() => setActiveTab('marketer')}
                className={`px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex items-center gap-2 ${
                  activeTab === 'marketer'
                    ? 'bg-bright-orange text-white shadow-lg'
                    : 'bg-transparent text-warm-gray-600 hover:text-bright-orange'
                }`}
                style={activeTab === 'marketer' ? { backgroundColor: '#F5A65B', color: '#FFFFFF' } : {}}
              >
                <span className="text-2xl">📈</span>
                For Marketers
              </button>
            </div>
          </motion.div>

          {/* Builder Content */}
          {activeTab === 'builder' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-sans font-bold text-forest mb-4">You Build. We Help You Grow.</h2>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Problem Card */}
                <div className="bg-gradient-to-br from-peach/20 to-warm-gray-50 rounded-2xl p-10 border-2 border-bright-orange shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">⚠️</span>
                    <h3 className="text-xl font-sans font-bold text-bright-orange uppercase tracking-wide">The Problem</h3>
                  </div>
                  <h4 className="text-3xl font-sans font-bold text-forest mb-6">Your Apps Are Collecting Dust</h4>
                  <div className="space-y-4 text-warm-gray-700 leading-relaxed text-base">
                    <div className="flex gap-3"><span className="text-red-500 font-bold flex-shrink-0">✗</span><p>You've built multiple side projects that are just sitting there</p></div>
                    <div className="flex gap-3"><span className="text-red-500 font-bold flex-shrink-0">✗</span><p>You know they have potential, but you don't have time to market them</p></div>
                    <div className="flex gap-3"><span className="text-red-500 font-bold flex-shrink-0">✗</span><p>Marketing isn't your strength. You're a builder, not a growth hacker</p></div>
                    <div className="flex gap-3"><span className="text-red-500 font-bold flex-shrink-0">✗</span><p>Every month that passes is potential revenue lost</p></div>
                    <div className="flex gap-3"><span className="text-red-500 font-bold flex-shrink-0">✗</span><p>You can't afford to hire a marketer full-time, and freelancers don't have skin in the game</p></div>
                  </div>
                  <div className="mt-8 p-6 bg-forest rounded-xl" style={{ backgroundColor: '#456456' }}>
                    <p className="text-white leading-relaxed">You didn't spend months building something just to let it die in obscurity. <span className="font-bold text-bright-green">Your projects deserve to see the light of day.</span></p>
                  </div>
                </div>
                {/* Solution Card */}
                <div className="bg-gradient-to-br from-light-mint to-white rounded-2xl p-10 border-2 border-mint shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">💡</span>
                    <h3 className="text-xl font-sans font-bold text-mint uppercase tracking-wide">The Solution</h3>
                  </div>
                  <h4 className="text-3xl font-sans font-bold text-forest mb-6">Partner With Marketers Who Care</h4>
                  <div className="space-y-4 text-warm-gray-700 leading-relaxed text-base">
                    <div className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✓</span><p>List your project on GrowMyApp and connect with experienced marketers</p></div>
                    <div className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✓</span><p>Find partners willing to work for equity, revenue share, or creative partnerships</p></div>
                    <div className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✓</span><p>No upfront costs. Marketers succeed when you succeed</p></div>
                    <div className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✓</span><p>Focus on what you do best (building) while they handle growth</p></div>
                    <div className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✓</span><p>Turn your shelf projects into revenue-generating businesses</p></div>
                  </div>
                  <div className="mt-8 p-6 bg-forest rounded-xl" style={{ backgroundColor: '#456456' }}>
                    <p className="text-white leading-relaxed">Stop letting your projects gather dust. <span className="font-bold text-bright-green">Connect with marketers who will treat your app like their own and help it reach its full potential.</span></p>
                  </div>
                </div>
              </div>

              {/* The Transformation Graph - Builder Tab Only */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative bg-white rounded-3xl shadow-2xl p-10 border border-warm-gray-200"
              >
                <div className="space-y-6">
                  {/* Title - Bigger */}
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 font-sans">The Transformation</h3>
                    <p className="text-base lg:text-lg text-warm-gray-600 leading-relaxed font-sans">See what happens when builders get dedicated marketing support</p>
                  </div>

                  {/* Graph Area - Larger */}
                  <div className="relative h-80 pt-4">
                    {/* Labels - Bigger */}
                    <div className="absolute top-0 right-0 flex flex-col gap-3 text-sm z-10">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-mint/10 px-4 py-3 rounded-xl border-2 border-mint shadow-lg"
                        style={{ borderColor: '#7FB685', backgroundColor: 'rgba(127, 182, 133, 0.1)' }}
                      >
                        <div className="text-sm font-bold text-mint mb-1 font-sans" style={{ color: '#7FB685' }}>AFTER</div>
                        <div className="text-sm text-warm-gray-700 font-medium font-sans">With marketing partner</div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-red-50 px-4 py-3 rounded-xl border-2 border-red-400 shadow-lg"
                      >
                        <div className="text-sm font-bold text-red-600 mb-1 font-sans">BEFORE</div>
                        <div className="text-sm text-warm-gray-700 font-medium font-sans">No dedicated marketing</div>
                      </motion.div>
                    </div>

                    {/* SVG Graph - Larger with better curves */}
                    <svg viewBox="0 0 500 240" className="w-full h-full" style={{ overflow: 'visible' }}>
                      {/* Grid lines */}
                      <line x1="50" y1="40" x2="480" y2="40" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="50" y1="80" x2="480" y2="80" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="50" y1="120" x2="480" y2="120" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="50" y1="160" x2="480" y2="160" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="50" y1="200" x2="480" y2="200" stroke="#E5E7EB" strokeWidth="1" />

                      {/* Y-axis labels */}
                      <text x="5" y="45" className="text-xs fill-warm-gray-600 font-medium" fontSize="11" fontFamily="system-ui, sans-serif">Users</text>
                      <text x="10" y="85" className="text-xs fill-warm-gray-600 font-medium" fontSize="11" fontFamily="system-ui, sans-serif">500</text>
                      <text x="10" y="125" className="text-xs fill-warm-gray-600 font-medium" fontSize="11" fontFamily="system-ui, sans-serif">400</text>
                      <text x="10" y="165" className="text-xs fill-warm-gray-600 font-medium" fontSize="11" fontFamily="system-ui, sans-serif">200</text>
                      <text x="10" y="205" className="text-xs fill-warm-gray-600 font-medium" fontSize="11" fontFamily="system-ui, sans-serif">100</text>

                      {/* X-axis labels - Bigger */}
                      <text x="30" y="230" className="text-xs fill-warm-gray-600 font-semibold" fontSize="13" fontFamily="system-ui, sans-serif">Month 1</text>
                      <text x="130" y="230" className="text-xs fill-warm-gray-600 font-semibold" fontSize="13" fontFamily="system-ui, sans-serif">Month 3</text>
                      <text x="230" y="230" className="text-xs fill-warm-gray-600 font-semibold" fontSize="13" fontFamily="system-ui, sans-serif">Month 6</text>
                      <text x="330" y="230" className="text-xs fill-warm-gray-600 font-semibold" fontSize="13" fontFamily="system-ui, sans-serif">Month 9</text>
                      <text x="420" y="230" className="text-xs fill-warm-gray-600 font-semibold" fontSize="13" fontFamily="system-ui, sans-serif">Month 12</text>

                      {/* Red line - Flat (Without Marketing) - Thicker */}
                      <motion.path
                        d="M 50 180 L 480 180"
                        stroke="#EF4444"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
                      />

                      {/* Green line - Growth curve (With GrowMyApp) - Thicker & Better curve */}
                      <motion.path
                        d="M 50 180 Q 120 175, 200 120 T 480 35"
                        stroke="#7FB685"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
                      />

                      {/* Dots at the end of lines for emphasis - Bigger */}
                      <motion.circle
                        cx="480"
                        cy="180"
                        r="8"
                        fill="#EF4444"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.9, duration: 0.3 }}
                      />
                      <motion.circle
                        cx="480"
                        cy="35"
                        r="8"
                        fill="#7FB685"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ delay: 2.6, duration: 0.5 }}
                      />
                    </svg>
                  </div>

                  {/* Legend - Bigger */}
                  <div className="flex items-center justify-center gap-8 pt-6 border-t-2 border-warm-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-1.5 bg-red-500 rounded"></div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 font-sans">Without Marketing</div>
                        <div className="text-sm text-warm-gray-600 font-sans">Projects stay flat</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-1.5 rounded" style={{ backgroundColor: '#7FB685' }}></div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 font-sans">With GrowMyApp</div>
                        <div className="text-sm font-semibold font-sans" style={{ color: '#7FB685' }}>Real growth trajectory</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Marketer Content */}
          {activeTab === 'marketer' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <div className="text-center mb-12">
                <h2 className="text-4xl md:text-5xl font-sans font-bold text-forest mb-4">Stop Working For Peanuts. Own Your Growth.</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-8 mb-12">
                {/* Problem Card */}
                <div className="bg-gradient-to-br from-peach/20 to-warm-gray-50 rounded-2xl p-10 border-2 border-bright-orange shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">⚠️</span>
                    <h3 className="text-xl font-sans font-bold text-bright-orange uppercase tracking-wide">The Problem</h3>
                  </div>
                  <h4 className="text-3xl font-sans font-bold text-forest mb-6">You're Undervalued & Underpaid</h4>
                  <div className="space-y-4 text-warm-gray-700 leading-relaxed text-base">
                    <div className="flex gap-3"><span className="text-red-500 font-bold flex-shrink-0">✗</span><p>You're tired of getting paid $20/video when you drive thousands in revenue</p></div>
                    <div className="flex gap-3"><span className="text-red-500 font-bold flex-shrink-0">✗</span><p>You bring real value. Views, downloads, customers. But see none of the upside</p></div>
                    <div className="flex gap-3"><span className="text-red-500 font-bold flex-shrink-0">✗</span><p>Starting from scratch is risky, expensive, and time-consuming</p></div>
                    <div className="flex gap-3"><span className="text-red-500 font-bold flex-shrink-0">✗</span><p>You don't have a technical co-founder or the time to build a product yourself</p></div>
                    <div className="flex gap-3"><span className="text-red-500 font-bold flex-shrink-0">✗</span><p>You know you could grow an existing product 10x, but no one gives you the opportunity</p></div>
                  </div>
                  <div className="mt-8 p-6 bg-forest rounded-xl" style={{ backgroundColor: '#456456' }}>
                    <p className="text-white leading-relaxed">Your marketing skills are worth more than flat fees. <span className="font-bold text-bright-green">You deserve a piece of what you help build.</span></p>
                  </div>
                </div>
                {/* Solution Card */}
                <div className="bg-gradient-to-br from-light-mint to-white rounded-2xl p-10 border-2 border-mint shadow-xl">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-3xl">💡</span>
                    <h3 className="text-xl font-sans font-bold text-mint uppercase tracking-wide">The Solution</h3>
                  </div>
                  <h4 className="text-3xl font-sans font-bold text-forest mb-6">Choose Projects & Get Equity</h4>
                  <div className="space-y-4 text-warm-gray-700 leading-relaxed text-base">
                    <div className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✓</span><p>Browse ready-made products from builders who need your expertise</p></div>
                    <div className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✓</span><p>Skip the "building from scratch" phase and jump straight to growth</p></div>
                    <div className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✓</span><p>Negotiate equity, revenue share, or partnership terms that reflect your value</p></div>
                    <div className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✓</span><p>Work with founders who are committed and open to collaboration</p></div>
                    <div className="flex gap-3"><span className="text-green-500 font-bold flex-shrink-0">✓</span><p>Build your portfolio while building actual wealth, not just hourly wages</p></div>
                  </div>
                  <div className="mt-8 p-6 bg-forest rounded-xl" style={{ backgroundColor: '#456456' }}>
                    <p className="text-white leading-relaxed">Don't just market products. <span className="font-bold text-bright-green">Own them. Find projects that excite you, grow them with your skills, and earn what you're actually worth.</span></p>
                  </div>
                </div>
              </div>

              {/* The Marketer Value Graph */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="relative bg-white rounded-3xl shadow-2xl p-10 border border-warm-gray-200"
              >
                <div className="space-y-6">
                  {/* Title */}
                  <div>
                    <h3 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3 font-sans">Your Marketing is Worth More Than $20/Video</h3>
                    <p className="text-base lg:text-lg text-warm-gray-600 leading-relaxed font-sans">Compare flat-fee earnings vs equity ownership over 12 months</p>
                  </div>

                  {/* Graph Area */}
                  <div className="relative h-80 pt-4">
                    {/* Labels */}
                    <div className="absolute top-0 right-0 flex flex-col gap-3 text-sm z-10">
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-mint/10 px-4 py-3 rounded-xl border-2 border-mint shadow-lg"
                        style={{ borderColor: '#7FB685', backgroundColor: 'rgba(127, 182, 133, 0.1)' }}
                      >
                        <div className="text-sm font-bold text-mint mb-1 font-sans" style={{ color: '#7FB685' }}>$45K+ potential</div>
                        <div className="text-xs text-warm-gray-700 font-medium font-sans">Equity/Revenue Share</div>
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="bg-red-50 px-4 py-3 rounded-xl border-2 border-red-400 shadow-lg"
                      >
                        <div className="text-sm font-bold text-red-600 mb-1 font-sans">$2.4K total</div>
                        <div className="text-xs text-warm-gray-700 font-medium font-sans">$20 Per Video (Flat Fee)</div>
                      </motion.div>
                    </div>

                    {/* SVG Graph */}
                    <svg viewBox="0 0 500 240" className="w-full h-full" style={{ overflow: 'visible' }}>
                      {/* Grid lines */}
                      <line x1="50" y1="30" x2="480" y2="30" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="50" y1="70" x2="480" y2="70" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="50" y1="110" x2="480" y2="110" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="50" y1="150" x2="480" y2="150" stroke="#E5E7EB" strokeWidth="1" />
                      <line x1="50" y1="190" x2="480" y2="190" stroke="#E5E7EB" strokeWidth="1" />

                      {/* Y-axis labels */}
                      <text x="5" y="35" className="text-xs fill-warm-gray-600 font-medium" fontSize="11" fontFamily="system-ui, sans-serif">$50K</text>
                      <text x="5" y="75" className="text-xs fill-warm-gray-600 font-medium" fontSize="11" fontFamily="system-ui, sans-serif">$40K</text>
                      <text x="5" y="115" className="text-xs fill-warm-gray-600 font-medium" fontSize="11" fontFamily="system-ui, sans-serif">$30K</text>
                      <text x="5" y="155" className="text-xs fill-warm-gray-600 font-medium" fontSize="11" fontFamily="system-ui, sans-serif">$20K</text>
                      <text x="5" y="195" className="text-xs fill-warm-gray-600 font-medium" fontSize="11" fontFamily="system-ui, sans-serif">$10K</text>

                      {/* X-axis labels */}
                      <text x="50" y="230" className="text-xs fill-warm-gray-600 font-semibold" fontSize="13" fontFamily="system-ui, sans-serif">Month 1</text>
                      <text x="140" y="230" className="text-xs fill-warm-gray-600 font-semibold" fontSize="13" fontFamily="system-ui, sans-serif">Month 3</text>
                      <text x="240" y="230" className="text-xs fill-warm-gray-600 font-semibold" fontSize="13" fontFamily="system-ui, sans-serif">Month 6</text>
                      <text x="340" y="230" className="text-xs fill-warm-gray-600 font-semibold" fontSize="13" fontFamily="system-ui, sans-serif">Month 9</text>
                      <text x="430" y="230" className="text-xs fill-warm-gray-600 font-semibold" fontSize="13" fontFamily="system-ui, sans-serif">Month 12</text>

                      {/* Red line - Flat Fee at $2.4K (near bottom, around 190-195 on Y axis) */}
                      <motion.path
                        d="M 50 195 L 150 194 L 250 193.5 L 350 193 L 480 192"
                        stroke="#EF4444"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 1.5, delay: 0.4, ease: "easeInOut" }}
                      />

                      {/* Green line - Equity Growth reaching $45K (around Y=42, which is 45K) */}
                      <motion.path
                        d="M 50 195 Q 150 190, 250 130 Q 350 65, 480 42"
                        stroke="#7FB685"
                        strokeWidth="5"
                        fill="none"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, opacity: 0 }}
                        animate={{ pathLength: 1, opacity: 1 }}
                        transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
                      />

                      {/* Dots at the end */}
                      <motion.circle
                        cx="480"
                        cy="192"
                        r="8"
                        fill="#EF4444"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.9, duration: 0.3 }}
                      />
                      <motion.circle
                        cx="480"
                        cy="42"
                        r="8"
                        fill="#7FB685"
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ delay: 2.6, duration: 0.5 }}
                      />
                    </svg>
                  </div>

                  {/* Legend */}
                  <div className="space-y-4 pt-6 border-t-2 border-warm-gray-200">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-1.5 bg-red-500 rounded mt-2"></div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900 mb-1 font-sans">$20 Per Video (Flat Fee)</div>
                        <div className="text-sm text-warm-gray-600 font-sans">Making 10 videos/month = $200/mo. Linear income, no upside regardless of downloads or success.</div>
                        <div className="text-sm font-bold text-red-600 mt-1 font-sans">Year 1 Total: ~$2,400</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-1.5 rounded mt-2" style={{ backgroundColor: '#7FB685' }}></div>
                      <div className="flex-1">
                        <div className="text-sm font-bold text-gray-900 mb-1 font-sans">Equity/Revenue Share</div>
                        <div className="text-sm text-warm-gray-600 font-sans">Own a piece of what you grow. As the app scales with your marketing, your earnings scale too.</div>
                        <div className="text-sm font-bold mt-1 font-sans" style={{ color: '#7FB685' }}>Year 1 Potential: $45,000+</div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section id="how-it-works" className="py-16 px-8 bg-forest text-white" style={{ backgroundColor: '#456456' }} aria-labelledby="how-it-works-heading">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-10"
          >
            <p className="text-sm uppercase tracking-widest text-mint mb-6 font-sans font-bold" style={{ color: '#7FB685' }}>
              How it works
            </p>
            <h2 id="how-it-works-heading" className="font-sans font-extrabold text-5xl md:text-6xl text-white">
              Three Simple Steps
            </h2>
          </motion.div>
          
          <div className="space-y-6">
            {[
              { 
                num: '1', 
                title: 'Sign Up', 
                desc: 'Choose builder or marketer. Tell us about your experience and what you\'re looking for.',
                emoji: '👋',
                details: null
              },
              { 
                num: '2', 
                title: 'Post or Browse', 
                desc: null,
                emoji: '🔍',
                details: [
                  { label: 'Builders:', text: 'post your shelf projects.' },
                  { label: 'Marketers:', text: 'browse available projects and see what you can help launch.' }
                ]
              },
              { 
                num: '3', 
                title: 'Connect & Launch', 
                desc: 'Match with the right partner, negotiate terms, and turn projects into revenue together.',
                emoji: '🚀',
                details: null
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.6 }}
                className="relative"
              >
                <div className="bg-forest/40 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-white/10">
                  <div className="flex items-start gap-6">
                    {/* Number Badge */}
                    <div className="flex-shrink-0 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                      <span className="text-2xl font-bold text-forest" style={{ color: '#456456' }}>{item.num}</span>
                    </div>
                    
                    {/* Content */}
                    <div className="flex-1">
                      <h3 className="font-sans font-bold text-3xl md:text-4xl text-white mb-4 flex items-center gap-3">
                        <span>{item.emoji}</span>
                        {item.title}
                      </h3>
                      
                      {item.desc && (
                        <p className="text-white/90 leading-relaxed font-normal text-lg" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                          {item.desc}
                        </p>
                      )}
                      
                      {item.details && (
                        <div className="space-y-3 text-lg">
                          {item.details.map((detail, idx) => (
                            <p key={idx} className="text-white/90" style={{ color: 'rgba(255, 255, 255, 0.9)' }}>
                              <span className="font-bold text-mint" style={{ color: '#7FB685' }}>{detail.label}</span> {detail.text}
                            </p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial-style quotes */}
      <section className="py-16 px-8 bg-white" aria-labelledby="testimonials-heading">
        <h2 id="testimonials-heading" className="sr-only">User testimonials</h2>
        <div className="max-w-4xl mx-auto space-y-12">
          {[
            {
              quote: "I've built three apps that just sit in my GitHub. Now they're getting launched.",
              role: "builder"
            },
            {
              quote: "I can sell ice to eskimos. Now I have actual products to market.",
              role: "marketer"
            }
          ].map((item, i) => (
            <motion.blockquote
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="border-l-4 border-bright-orange pl-8 md:pl-12"
            >
              <p className="font-sans font-bold text-3xl md:text-4xl text-forest leading-relaxed mb-4">
                "{item.quote}"
              </p>
              <footer className="text-sm uppercase tracking-loose text-mint font-sans font-bold">
                — {item.role}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-8 bg-gradient-to-br from-light-mint to-mint/20" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto text-center space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 id="cta-heading" className="font-sans font-extrabold text-6xl md:text-7xl lg:text-8xl text-forest mb-6 leading-tight">
              Grow Your<br />Shelf Project
            </h2>
            <button
              onClick={() => navigate('/signup')}
              className="px-14 py-6 bg-forest text-white rounded-xl hover:bg-dark-green transition-all font-sans font-bold text-xl inline-block shadow-2xl hover:shadow-3xl"
              style={{ backgroundColor: '#456456', color: '#FFFFFF' }}
              aria-label="Get started now"
            >
              Get Started
            </button>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-8 px-8 bg-white border-t border-warm-gray-200" role="contentinfo">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo-bg.png" alt="GrowMyApp Logo" className="w-10 h-10" />
            <span className="font-bold text-lg text-forest">
              GrowMyApp
            </span>
          </div>
          <nav className="flex gap-8 text-sm text-warm-gray-600 font-sans font-medium" aria-label="Footer navigation">
            <a href="#" className="hover:text-forest transition-colors">About</a>
            <a href="#" className="hover:text-forest transition-colors">Contact</a>
            <a href="#" className="hover:text-forest transition-colors">Privacy</a>
          </nav>
        </div>
      </footer>
      </div>
    </>
  )
}

export default LandingPage
