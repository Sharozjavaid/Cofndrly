import { motion, useScroll, useTransform } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import { BuildIcon, CaptureIcon, CreateIcon, GrowIcon, ApplyIcon, ApproveIcon, ConnectIcon } from '../components/Icons'
import SEO from '../components/SEO'

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
    <>
      <SEO
        title="cofndrly — where builders meet storytellers | Find Your Co-Founder"
        description="Not another networking app — a place to start something. Connect technical builders with growth hackers, content creators, and marketers to launch your next startup."
        keywords="co-founder matching, find co-founder, technical co-founder, startup co-founder, growth hacker, content creator, entrepreneur networking, startup founders, builder network, marketing co-founder"
        canonicalUrl="https://cofndrly.com/"
      />
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
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-3"
          >
            <button
              onClick={() => navigate('/login')}
              className="px-6 py-2.5 bg-transparent text-charcoal rounded-sm border border-warm-gray-300 hover:border-charcoal transition-all font-sans text-sm tracking-relaxed lowercase"
            >
              sign in
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="px-6 py-2.5 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans text-sm tracking-relaxed lowercase"
            >
              apply
            </button>
          </motion.div>
        </div>
      </nav>

      {/* Hero Section - Split Screen */}
      <section ref={heroRef} className="min-h-screen flex items-center justify-center px-8 pt-32 pb-20" aria-label="Hero section">
        <motion.div 
          style={{ opacity, scale }}
          className="max-w-6xl w-full"
        >
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            {/* Left: Typography */}
            <article className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="text-xs md:text-sm uppercase tracking-loose text-warm-gray-600 mb-8 font-sans">
                  Turn shelf projects into real businesses
                </p>
                <h1 className="font-serif text-7xl md:text-8xl lg:text-9xl leading-[0.90] text-charcoal mb-10">
                  stop building<br />
                  in silence.<br />
                  <span className="italic text-rust">find your co-founder</span>
                </h1>
                <p className="text-2xl md:text-3xl text-warm-gray-700 leading-relaxed font-light max-w-lg">
                  match with someone who complements your skills. split equity. build real wealth.
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
                  aria-label="Find your co-founder - Sign up"
                >
                  find your other half
                </button>
                <button 
                  className="px-10 py-5 bg-transparent text-charcoal rounded-sm border border-warm-gray-300 hover:border-charcoal transition-all font-sans tracking-relaxed lowercase text-lg"
                  aria-label="Learn more about cofndrly"
                >
                  learn more
                </button>
              </motion.div>
            </article>

            {/* Right: Creative Visual Grid */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
              role="img"
              aria-label="Visual representation of builders and storytellers collaborating"
            >
              <div className="grid grid-cols-2 gap-4">
                {/* Top Left - Code/Tech */}
                <div className="aspect-square rounded-sm overflow-hidden bg-gradient-to-br from-warm-gray-800 to-warm-gray-700 p-6 flex flex-col items-center justify-center relative group">
                  <div className="absolute inset-0 bg-rust/5 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="text-cream/90" aria-hidden="true">
                      <BuildIcon />
                    </div>
                    <p className="text-xs text-cream/60 font-mono uppercase tracking-wider">build</p>
                  </div>
                </div>
                
                {/* Top Right - Camera/Content */}
                <div className="aspect-square rounded-sm overflow-hidden bg-gradient-to-br from-sage/30 to-warm-gray-200 p-6 flex flex-col items-center justify-center relative group">
                  <div className="absolute inset-0 bg-sage/10 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="text-warm-gray-700" aria-hidden="true">
                      <CaptureIcon />
                    </div>
                    <p className="text-xs text-warm-gray-600 font-mono uppercase tracking-wider">capture</p>
                  </div>
                </div>
                
                {/* Bottom Left - Video/Edit */}
                <div className="aspect-square rounded-sm overflow-hidden bg-gradient-to-br from-rust/20 to-sand p-6 flex flex-col items-center justify-center relative group">
                  <div className="absolute inset-0 bg-rust/10 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="text-warm-gray-700" aria-hidden="true">
                      <CreateIcon />
                    </div>
                    <p className="text-xs text-warm-gray-600 font-mono uppercase tracking-wider">create</p>
                  </div>
                </div>
                
                {/* Bottom Right - Growth/Analytics */}
                <div className="aspect-square rounded-sm overflow-hidden bg-gradient-to-br from-warm-gray-200 to-sage/20 p-6 flex flex-col items-center justify-center relative group">
                  <div className="absolute inset-0 bg-sage/10 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true"></div>
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="text-warm-gray-700" aria-hidden="true">
                      <GrowIcon />
                    </div>
                    <p className="text-xs text-warm-gray-600 font-mono uppercase tracking-wider">grow</p>
                  </div>
                </div>
              </div>
              
              {/* Connection line overlay */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden="true">
                <div className="text-6xl text-rust/30">+</div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Philosophy Section */}
      <section className="py-32 px-8 bg-sand" aria-labelledby="philosophy-heading">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="space-y-12"
          >
            <p className="text-sm uppercase tracking-loose text-warm-gray-600 font-sans" id="philosophy-heading">
              The philosophy
            </p>
            
            <div className="space-y-8 text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-charcoal">
              <p className="opacity-90">
                builders: your projects are collecting dust.
              </p>
              <p className="opacity-90">
                storytellers: you're creating content for <span className="italic text-rust">$15/video</span>.
              </p>
              <p className="opacity-90 mt-8">
                what if you both owned something <span className="italic text-rust">together</span>?
              </p>
              <p className="text-2xl md:text-3xl text-warm-gray-600 font-sans font-light mt-12 max-w-2xl">
                stop working alone. find a partner. split the equity. build real wealth.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Split Cards - The Two Sides */}
      <section className="py-32 px-8" aria-labelledby="audience-heading">
        <h2 id="audience-heading" className="sr-only">Who cofndrly is for</h2>
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-8">
          {/* Technical Builders */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="group cursor-pointer"
            onClick={() => navigate('/builders')}
          >
            <div className="bg-white rounded-sm p-12 h-full border border-warm-gray-200 hover:border-charcoal transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-rust/5 rounded-full blur-2xl group-hover:bg-rust/10 transition-all" aria-hidden="true"></div>
              <div className="relative space-y-6">
                <div className="text-6xl mb-6" role="img" aria-label="Builders">⚙️</div>
                <h3 className="font-serif text-4xl text-charcoal lowercase">
                  builders
                </h3>
                <p className="text-warm-gray-700 leading-relaxed font-light text-lg">
                  you have finished projects sitting on the shelf. apps, tools, products you spent months building. they work, but no one knows they exist. give them to someone who can market it. split the profits. finally see your work make money.
                </p>
                <div className="pt-4 space-y-2 text-base text-warm-gray-600 font-sans">
                  <p className="lowercase">→ side projects with no users</p>
                  <p className="lowercase">→ completed apps sitting idle</p>
                  <p className="lowercase">→ tools you built but never marketed</p>
                </div>
                <div className="pt-6">
                  <span className="text-sm text-rust font-sans uppercase tracking-wider">
                    learn more →
                  </span>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Storytellers/Marketers */}
          <motion.article
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="group cursor-pointer"
            onClick={() => navigate('/creatives')}
          >
            <div className="bg-white rounded-sm p-12 h-full border border-warm-gray-200 hover:border-charcoal transition-all duration-300 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sage/5 rounded-full blur-2xl group-hover:bg-sage/10 transition-all" aria-hidden="true"></div>
              <div className="relative space-y-6">
                <div className="text-6xl mb-6" role="img" aria-label="Storytellers">📸</div>
                <h3 className="font-serif text-4xl text-charcoal lowercase">
                  storytellers
                </h3>
                <p className="text-warm-gray-700 leading-relaxed font-light text-lg">
                  stop creating content for pennies. you can grow accounts, make things viral, and drive traffic. but you're making $15 per video for someone else's brand. find a developer with a real product. become partners. promote something you actually own. make real money.
                </p>
                <div className="pt-4 space-y-2 text-base text-warm-gray-600 font-sans">
                  <p className="lowercase">→ tired of gig work & fiverr</p>
                  <p className="lowercase">→ want equity, not hourly rates</p>
                  <p className="lowercase">→ ready to own something real</p>
                </div>
                <div className="pt-6">
                  <span className="text-sm text-rust font-sans uppercase tracking-wider">
                    learn more →
                  </span>
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </section>

      {/* How It Works - Enhanced */}
      <section className="py-32 px-8 bg-charcoal text-cream" aria-labelledby="how-it-works-heading">
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
            <h2 id="how-it-works-heading" className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream lowercase">
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
                    <div className="text-cream" aria-hidden="true">
                      {item.icon}
                    </div>
                    <div className="absolute -top-3 -left-3 font-mono text-xs text-warm-gray-500 bg-charcoal px-2 py-1 rounded-sm border border-warm-gray-700" aria-label={`Step ${item.num}`}>
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
                    <div className="hidden md:block absolute left-16 -bottom-20 text-4xl text-warm-gray-700" aria-hidden="true">
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
      <section className="py-32 px-8" aria-labelledby="testimonials-heading">
        <h2 id="testimonials-heading" className="sr-only">User testimonials</h2>
        <div className="max-w-4xl mx-auto space-y-20">
          {[
            {
              quote: "My side project had zero users for 8 months. Now it's making $3k/month.",
              role: "builder"
            },
            {
              quote: "I was making $15 per TikTok. Now I own 40% of a product doing $10k MRR.",
              role: "storyteller"
            }
          ].map((item, i) => (
            <motion.blockquote
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
              <footer className="text-sm uppercase tracking-loose text-warm-gray-600 font-sans">
                — {item.role}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 px-8 bg-sand" aria-labelledby="cta-heading">
        <div className="max-w-3xl mx-auto text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 id="cta-heading" className="font-serif text-6xl md:text-7xl lg:text-8xl text-charcoal mb-8 leading-tight">
              find your<br />other half
            </h2>
            <button
              onClick={() => navigate('/signup')}
              className="px-14 py-6 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase text-xl inline-block"
              aria-label="Apply now to find your co-founder"
            >
              apply now
            </button>
          </motion.div>
        </div>
      </section>

      {/* Minimal Footer */}
      <footer className="py-12 px-8 border-t border-warm-gray-200" role="contentinfo">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif text-lg lowercase text-charcoal">
            cofndrly
          </div>
          <nav className="flex gap-8 text-sm text-warm-gray-600 font-sans lowercase" aria-label="Footer navigation">
            <a href="#" className="hover:text-charcoal transition-colors">about</a>
            <a href="#" className="hover:text-charcoal transition-colors">contact</a>
            <a href="#" className="hover:text-charcoal transition-colors">privacy</a>
          </nav>
        </div>
      </footer>
      </div>
    </>
  )
}

export default LandingPage
