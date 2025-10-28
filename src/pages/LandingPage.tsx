import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { BuildIcon, CaptureIcon, CreateIcon, GrowIcon, ApplyIcon, ApproveIcon, ConnectIcon } from '../components/Icons'

const LandingPage = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"]
  })
  
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95])

  return (
    <div className="min-h-screen bg-cream grain">
      {/* Minimal Navigation */}
      <nav className="fixed top-0 w-full bg-cream/80 backdrop-blur-md border-b border-warm-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-xl font-serif tracking-tight lowercase text-charcoal"
          >
            cofndrly
          </motion.div>
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            onClick={() => navigate('/signup')}
            className="px-6 py-2.5 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans text-sm tracking-relaxed lowercase"
          >
            apply
          </motion.button>
        </div>
      </nav>

      {/* Hero Section - Split Screen */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center px-8 pt-32 pb-20">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-6xl w-full"
        >
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: Typography */}
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs md:text-sm uppercase tracking-loose text-warm-gray-600 mb-8 font-sans">
                  For the ones who build
                </p>
                <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl leading-[0.90] text-charcoal mb-10">
                  where builders<br />
                  meet<br />
                  <span className="italic text-rust">storytellers</span>
                </h1>
                <p className="text-2xl md:text-3xl text-warm-gray-700 leading-relaxed font-light max-w-lg">
                  not another networking app — a place to start something.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="flex flex-col sm:flex-row gap-4 pt-6"
              >
                <button
                  onClick={() => navigate('/signup')}
                  className="px-10 py-5 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase text-lg"
                >
                  find your other half
                </button>
                <button className="px-10 py-5 bg-transparent text-charcoal rounded-sm border border-warm-gray-300 hover:border-charcoal transition-all font-sans tracking-relaxed lowercase text-lg">
                  learn more
                </button>
              </motion.div>
            </div>

            {/* Right: Creative Visual Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Top Left - Code/Tech */}
                <div className="aspect-square rounded-sm overflow-hidden bg-gradient-to-br from-warm-gray-800 to-warm-gray-700 p-6 flex flex-col items-center justify-center relative group">
                  <div className="absolute inset-0 bg-rust/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="text-cream/90">
                      <BuildIcon />
                    </div>
                    <p className="text-xs text-cream/60 font-mono uppercase tracking-wider">build</p>
                  </div>
                </div>
                
                {/* Top Right - Camera/Content */}
                <div className="aspect-square rounded-sm overflow-hidden bg-gradient-to-br from-sage/30 to-warm-gray-200 p-6 flex flex-col items-center justify-center relative group">
                  <div className="absolute inset-0 bg-sage/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="text-warm-gray-700">
                      <CaptureIcon />
                    </div>
                    <p className="text-xs text-warm-gray-600 font-mono uppercase tracking-wider">capture</p>
                  </div>
                </div>
                
                {/* Bottom Left - Video/Edit */}
                <div className="aspect-square rounded-sm overflow-hidden bg-gradient-to-br from-rust/20 to-sand p-6 flex flex-col items-center justify-center relative group">
                  <div className="absolute inset-0 bg-rust/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="text-warm-gray-700">
                      <CreateIcon />
                    </div>
                    <p className="text-xs text-warm-gray-600 font-mono uppercase tracking-wider">create</p>
                  </div>
                </div>
                
                {/* Bottom Right - Growth/Analytics */}
                <div className="aspect-square rounded-sm overflow-hidden bg-gradient-to-br from-warm-gray-200 to-sage/20 p-6 flex flex-col items-center justify-center relative group">
                  <div className="absolute inset-0 bg-sage/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="text-warm-gray-700">
                      <GrowIcon />
                    </div>
                    <p className="text-xs text-warm-gray-600 font-mono uppercase tracking-wider">grow</p>
                  </div>
                </div>
              </div>
              
              {/* Connection line overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="text-6xl text-rust/30">+</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-8 bg-sand">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            <p className="text-sm uppercase tracking-loose text-warm-gray-600 font-sans">
              The future is built in pairs
            </p>
            
            <div className="space-y-8 text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-charcoal">
              <p className="opacity-90">
                you have built something great.
              </p>
              <p className="opacity-90">
                now find someone who can <span className="italic text-rust">tell the world</span>.
              </p>
              <p className="text-2xl md:text-3xl text-warm-gray-600 font-sans font-light mt-12 max-w-2xl">
                for the ones who build in silence and the ones who make noise.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Split Cards - The Two Sides */}
      <section className="py-32 px-8">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Technical Builders */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-sm p-12 h-full border border-warm-gray-200 hover:border-charcoal transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rust/5 rounded-full blur-2xl group-hover:bg-rust/10 transition-all"></div>
              <div className="relative space-y-6">
                <div className="text-6xl mb-6">⚙️</div>
                <h3 className="font-serif text-4xl text-charcoal lowercase">
                  builders
                </h3>
                <p className="text-warm-gray-700 leading-relaxed font-light text-lg">
                  you've built multiple projects that never see the light of day. not because they're not good — but because marketing and sales take time away from what you do best: building and iterating on the product.
                </p>
                <div className="pt-4 space-y-2 text-base text-warm-gray-600 font-sans">
                  <p className="lowercase">→ Mobile apps, SaaS, Web apps</p>
                  <p className="lowercase">→ Hardware products</p>
                  <p className="lowercase">→ AI apps, Developer Tools, Web3</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Storytellers/Marketers */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-sm p-12 h-full border border-warm-gray-200 hover:border-charcoal transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full blur-2xl group-hover:bg-sage/10 transition-all"></div>
              <div className="relative space-y-6">
                <div className="text-6xl mb-6">📸</div>
                <h3 className="font-serif text-4xl text-charcoal lowercase">
                  storytellers
                </h3>
                <p className="text-warm-gray-700 leading-relaxed font-light text-lg">
                  you're a growth hacker, content creator, or marketing strategist. you know how to make things go viral and reach people — but you need a builder to bring your vision to life.
                </p>
                <div className="pt-4 space-y-2 text-base text-warm-gray-600 font-sans">
                  <p className="lowercase">→ growth hackers & marketers</p>
                  <p className="lowercase">→ content creators & strategists</p>
                  <p className="lowercase">→ brand storytellers</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="py-32 px-8 bg-charcoal text-cream">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-sm uppercase tracking-loose text-warm-gray-400 mb-6 font-sans">
              How it works
            </p>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream lowercase">
              three simple steps
            </h2>
          </motion.div>
          
          <div className="space-y-20">
            {[
              { 
                num: '01', 
                title: 'apply', 
                desc: 'share your story, experience, and what you are building. tell us what makes you unique.',
                icon: <ApplyIcon />,
                color: 'rust'
              },
              { 
                num: '02', 
                title: 'get approved', 
                desc: 'we carefully curate our community to ensure quality matches. expect to hear from us within 24-48 hours.',
                icon: <ApproveIcon />,
                color: 'sage'
              },
              { 
                num: '03', 
                title: 'start connecting', 
                desc: 'swipe through potential co-founders. message matches. find your balance and launch together.',
                icon: <ConnectIcon />,
                color: 'sage'
              }
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-start md:items-center">
                  {/* Icon/Visual */}
                  <div className={`flex-shrink-0 w-24 h-24 md:w-32 md:h-32 rounded-sm flex items-center justify-center relative group ${
                    item.color === 'rust' ? 'bg-rust/20' : 'bg-sage/20'
                  }`}>
                    <div className="text-cream">
                      {item.icon}
                    </div>
                    <div className="absolute -top-3 -left-3 font-mono text-xs text-warm-gray-500 bg-charcoal px-2 py-1 rounded-sm border border-warm-gray-700">
                      {item.num}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 space-y-3">
                    <h3 className="font-serif text-4xl md:text-5xl lowercase text-cream">
                      {item.title}
                    </h3>
                    <p className="text-warm-gray-300 leading-relaxed font-light text-lg md:text-xl max-w-2xl">
                      {item.desc}
                    </p>
                  </div>
                  
                  {/* Arrow connector (except last one) */}
                  {i < 2 && (
                    <div className="hidden md:block absolute left-16 -bottom-20 text-4xl text-warm-gray-700">
                      ↓
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial-style quotes */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto space-y-20">
          {[
            {
              quote: "I built three apps that never saw the light of day. Not anymore.",
              role: "builder"
            },
            {
              quote: "I have grown accounts to 500k. Now I am growing a product.",
              role: "storyteller"
            }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8 }}
              className="border-l-2 border-rust pl-8 md:pl-12"
            >
              <p className="font-serif text-3xl md:text-4xl text-charcoal leading-relaxed mb-4">
                "{item.quote}"
              </p>
              <p className="text-sm uppercase tracking-loose text-warm-gray-600 font-sans">
                — {item.role}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 bg-sand">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-6xl md:text-7xl lg:text-8xl text-charcoal mb-8 leading-tight">
              find your<br />other half
            </h2>
            <button
              onClick={() => navigate('/signup')}
              className="px-14 py-6 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase text-xl inline-block"
            >
              apply now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 px-8 border-t border-warm-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif text-lg lowercase text-charcoal">
            cofndrly
          </div>
          <div className="flex gap-8 text-sm text-warm-gray-600 font-sans lowercase">
            <a href="#" className="hover:text-charcoal transition-colors">about</a>
            <a href="#" className="hover:text-charcoal transition-colors">contact</a>
            <a href="#" className="hover:text-charcoal transition-colors">privacy</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
