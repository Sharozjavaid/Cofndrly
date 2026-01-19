import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
}

// Feature data
const features = [
  {
    icon: '🤖',
    title: 'AI-Powered Agent',
    subtitle: 'Smart Content Creation',
    description: 'Our Claude-powered agent understands philosophy deeply. Just tell it what you want, and it researches, writes scripts, and generates complete video slideshows.'
  },
  {
    icon: '🎨',
    title: 'Beautiful Visual Design',
    subtitle: 'Custom Themes & Typography',
    description: 'Every slide is uniquely designed with AI-generated imagery, professional typography, and multiple visual themes from glitch aesthetics to cinematic portraits.'
  },
  {
    icon: '🎙️',
    title: 'Professional Voiceovers',
    subtitle: 'Natural AI Narration',
    description: 'ElevenLabs integration provides human-like voiceovers that bring philosophical concepts to life. Multiple voice options to match your brand.'
  },
  {
    icon: '📱',
    title: 'Direct Social Publishing',
    subtitle: 'TikTok & Instagram Automation',
    description: 'Content goes straight from generation to publication. Our system handles formatting, optimization, and posting automatically.'
  },
  {
    icon: '📊',
    title: 'Smart Gallery & History',
    subtitle: 'Version Control for Content',
    description: 'Every piece of content is saved with full version history. Change fonts, themes, or regenerate images without losing previous versions.'
  },
  {
    icon: '⚡',
    title: 'Fast Iteration',
    subtitle: 'Edit & Regenerate in Seconds',
    description: "Don't like a slide? Regenerate just that one. Want a different font? Apply it instantly. Full creative control with minimal effort."
  }
]

const steps = [
  {
    number: '01',
    title: 'Tell the Agent',
    subtitle: 'Natural Conversation',
    description: 'Simply chat with our AI agent about what content you want. "Create a video about Stoic resilience" or "Make a series on existentialism for Gen Z."'
  },
  {
    number: '02',
    title: 'AI Does Everything',
    subtitle: 'Automated Pipeline',
    description: 'Researches topics, writes scripts, generates imagery, adds typography, creates voiceovers, and assembles the final video.'
  },
  {
    number: '03',
    title: 'Review & Customize',
    subtitle: 'Quality Control',
    description: 'Preview your content in the gallery. Change themes, fonts, or regenerate specific slides. Everything is customizable before posting.'
  },
  {
    number: '04',
    title: 'Automatic Publishing',
    subtitle: 'Set & Forget',
    description: 'Schedule content or let automations handle posting. Videos go live on TikTok and Instagram automatically.'
  }
]

const audiences = [
  { icon: '📚', title: 'Philosophy Educators', description: 'Share complex ideas in digestible, viral-ready formats.' },
  { icon: '🎬', title: 'Content Creators', description: 'Build a philosophy-focused brand without hours of editing.' },
  { icon: '📱', title: 'Social Media Managers', description: 'Manage philosophy accounts with minimal time investment.' },
  { icon: '💡', title: 'Philosophy Enthusiasts', description: 'Turn your passion into engaging content effortlessly.' }
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: ['10 videos per month', '2 themes available', 'Basic voiceover', 'Manual posting', 'Community support'],
    cta: 'Get Started',
    featured: false
  },
  {
    name: 'Creator',
    price: '$29',
    period: '/month',
    features: ['100 videos per month', 'All themes & fonts', 'Premium voiceovers', 'TikTok + Instagram posting', 'Version history', 'Priority support'],
    cta: 'Start Creating',
    featured: true
  },
  {
    name: 'Agency',
    price: '$99',
    period: '/month',
    features: ['Unlimited videos', 'Multiple accounts', 'Custom themes', 'API access', 'White-label options', 'Dedicated support'],
    cta: 'Contact Us',
    featured: false
  }
]

const stats = [
  { value: '10,000+', label: 'Videos Generated' },
  { value: '500K+', label: 'Total Views' },
  { value: '30s', label: 'Avg Generation Time' },
  { value: '95%', label: 'Automation Rate' }
]

const testimonials = [
  {
    quote: 'This is exactly what I needed. I can finally share philosophy without spending 5 hours per video.',
    author: '@philosophy_daily'
  },
  {
    quote: 'The AI agent actually understands the nuances of philosophical concepts. Impressive.',
    author: '@stoic_mindset'
  },
  {
    quote: 'I went from 1 post per week to daily content. Game changer for my account.',
    author: '@modern_philosopher'
  }
]

const faqs = [
  {
    q: 'How long does it take to generate a video?',
    a: 'Most videos are ready in 30-60 seconds. More complex slideshows with many slides may take 2-3 minutes.'
  },
  {
    q: 'Do I need video editing skills?',
    a: 'None at all. The AI handles everything from script to final video. You just provide the topic.'
  },
  {
    q: 'Can I customize the content?',
    a: 'Absolutely. Change themes, fonts, regenerate specific slides, or edit text. Full creative control.'
  },
  {
    q: 'What about copyright on images?',
    a: "All images are generated by AI specifically for your content. They're unique and safe to use."
  },
  {
    q: 'How does the TikTok/Instagram posting work?',
    a: 'You connect your accounts once via OAuth. After that, the system can post directly to your drafts (TikTok) or feed (Instagram) automatically.'
  },
  {
    q: "What if I don't like a generated video?",
    a: 'Regenerate individual slides, change the theme, adjust fonts, or start fresh. No limits on iterations.'
  }
]

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-obsidian text-cloud">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-gold to-accent-copper flex items-center justify-center">
              <span className="text-obsidian font-bold text-lg">φ</span>
            </div>
            <span className="font-serif text-xl text-pure">PhilosophizeMe</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-silver hover:text-pure transition-colors text-sm">Features</a>
            <a href="#how-it-works" className="text-silver hover:text-pure transition-colors text-sm">How It Works</a>
            <a href="#pricing" className="text-silver hover:text-pure transition-colors text-sm">Pricing</a>
            <a href="#faq" className="text-silver hover:text-pure transition-colors text-sm">FAQ</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-silver hover:text-pure transition-colors text-sm hidden sm:block">
              Sign In
            </button>
            <button className="px-5 py-2.5 bg-accent-gold text-obsidian font-medium text-sm rounded-lg hover:bg-accent-gold/90 transition-colors">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-radial from-charcoal via-obsidian to-obsidian" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-violet/10 rounded-full blur-3xl" />
        
        <motion.div 
          className="relative max-w-5xl mx-auto text-center"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.div 
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent-gold/30 bg-accent-gold/5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-accent-gold animate-pulse" />
            <span className="text-accent-gold text-sm">Now in Beta — Join the Waitlist</span>
          </motion.div>
          
          <motion.h1 
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-serif text-pure mb-6 leading-tight"
          >
            Transform Philosophy Into{' '}
            <span className="gradient-text">Viral Content</span>
          </motion.h1>
          
          <motion.p 
            variants={fadeInUp}
            className="text-xl md:text-2xl text-silver max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            AI-powered platform that generates, designs, and posts engaging philosophy content to TikTok and Instagram. 
            <span className="text-cloud"> No editing. No posting. Just pure automation.</span>
          </motion.p>
          
          <motion.div 
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto px-8 py-4 bg-accent-gold text-obsidian font-semibold rounded-xl hover:bg-accent-gold/90 transition-all hover-lift glow-gold">
              Get Started Free
            </button>
            <button className="w-full sm:w-auto px-8 py-4 border border-slate text-cloud font-medium rounded-xl hover:border-silver hover:bg-charcoal/50 transition-all">
              Watch Demo →
            </button>
          </motion.div>
        </motion.div>

        {/* Floating preview mockup */}
        <motion.div 
          className="relative max-w-4xl mx-auto mt-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <div className="relative rounded-2xl overflow-hidden border border-slate/50 shadow-2xl">
            <div className="bg-charcoal p-1">
              <div className="flex gap-2 px-4 py-3">
                <div className="w-3 h-3 rounded-full bg-red-500/60" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <div className="w-3 h-3 rounded-full bg-green-500/60" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-graphite to-charcoal p-8 md:p-12">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="text-sm text-accent-gold font-mono">// Agent Response</div>
                  <p className="text-cloud leading-relaxed">
                    "I'll create a 5-slide video about Stoic resilience, featuring Marcus Aurelius quotes with 
                    cinematic portrait imagery and a deep, contemplative voiceover..."
                  </p>
                  <div className="flex gap-2 pt-4">
                    <div className="px-3 py-1 bg-accent-sage/20 text-accent-sage text-xs rounded-full">Stoicism</div>
                    <div className="px-3 py-1 bg-accent-violet/20 text-accent-violet text-xs rounded-full">Resilience</div>
                  </div>
                </div>
                <div className="relative aspect-[9/16] max-w-[200px] mx-auto bg-obsidian rounded-xl overflow-hidden border border-slate/50">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="text-4xl mb-4">🏛️</div>
                      <p className="text-sm text-silver font-serif italic">"The obstacle is the way"</p>
                      <p className="text-xs text-mist mt-2">— Marcus Aurelius</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-slate/30">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <motion.div 
                key={i}
                className="text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl md:text-4xl font-serif gradient-text mb-2">{stat.value}</div>
                <div className="text-sm text-mist">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2 
            className="text-4xl md:text-5xl font-serif text-pure mb-8"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            What We Do
          </motion.h2>
          <motion.p 
            className="text-lg text-silver leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            PhilosophizeMe is an intelligent content automation platform that turns timeless philosophical wisdom 
            into modern, shareable social media content. Our AI agent researches topics, generates beautiful 
            slideshows with custom imagery and voiceovers, and automatically publishes to your TikTok and 
            Instagram accounts.
          </motion.p>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6 bg-charcoal/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-pure mb-4">Key Features</h2>
            <p className="text-silver text-lg">Everything you need to automate philosophy content</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-2xl bg-graphite/50 border border-slate/30 hover:border-accent-gold/30 transition-all hover-lift"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-serif text-pure mb-1">{feature.title}</h3>
                <div className="text-accent-gold text-sm mb-3">{feature.subtitle}</div>
                <p className="text-silver text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-pure mb-4">How It Works</h2>
            <p className="text-silver text-lg">From idea to published content in minutes</p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, i) => (
              <motion.div
                key={i}
                className="relative"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="text-6xl font-serif gradient-text opacity-30 mb-4">{step.number}</div>
                <h3 className="text-xl font-serif text-pure mb-1">{step.title}</h3>
                <div className="text-accent-gold text-sm mb-3">{step.subtitle}</div>
                <p className="text-silver text-sm leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-1/2 h-px bg-gradient-to-r from-slate/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Who Is This For */}
      <section className="py-24 px-6 bg-charcoal/30">
        <div className="max-w-5xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-pure mb-4">Who Is This For?</h2>
          </motion.div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((audience, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl bg-graphite/30 border border-slate/20 text-center"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl mb-3">{audience.icon}</div>
                <h3 className="font-serif text-pure mb-2">{audience.title}</h3>
                <p className="text-silver text-sm">{audience.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-pure mb-4">What Creators Say</h2>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-2xl bg-graphite/30 border border-slate/20"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-accent-gold text-4xl mb-4">"</div>
                <p className="text-cloud italic mb-6 leading-relaxed">{testimonial.quote}</p>
                <div className="text-accent-gold font-mono text-sm">{testimonial.author}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 bg-charcoal/30">
        <div className="max-w-6xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-pure mb-4">Simple Pricing</h2>
            <p className="text-silver text-lg">Start free, scale as you grow</p>
          </motion.div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, i) => (
              <motion.div
                key={i}
                className={`p-8 rounded-2xl border ${
                  plan.featured 
                    ? 'bg-gradient-to-b from-accent-gold/10 to-transparent border-accent-gold/50 relative' 
                    : 'bg-graphite/30 border-slate/20'
                }`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                {plan.featured && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-accent-gold text-obsidian text-xs font-semibold rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-serif text-pure mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-serif gradient-text">{plan.price}</span>
                  <span className="text-mist text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-silver text-sm">
                      <span className="text-accent-gold">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button className={`w-full py-3 rounded-xl font-medium transition-all ${
                  plan.featured
                    ? 'bg-accent-gold text-obsidian hover:bg-accent-gold/90'
                    : 'border border-slate text-cloud hover:border-silver hover:bg-charcoal/50'
                }`}>
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>
          
          <p className="text-center text-mist text-sm mt-8">
            Current version is in beta — contact us for early access
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-serif text-pure mb-4">FAQ</h2>
            <p className="text-silver text-lg">Common questions answered</p>
          </motion.div>
          
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                className="border border-slate/30 rounded-xl overflow-hidden"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-charcoal/50 transition-colors"
                >
                  <span className="text-cloud font-medium">{faq.q}</span>
                  <span className={`text-accent-gold transition-transform ${openFaq === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-silver text-sm leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-radial from-accent-gold/5 via-transparent to-transparent" />
        <motion.div 
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-pure mb-6">
            Ready to Automate Your Philosophy Content?
          </h2>
          <p className="text-silver text-lg mb-8 max-w-2xl mx-auto">
            Join creators who are sharing wisdom with the world — without the hours of manual work.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm text-silver">
            <span className="flex items-center gap-2"><span className="text-accent-gold">✓</span> No video editing required</span>
            <span className="flex items-center gap-2"><span className="text-accent-gold">✓</span> No research paralysis</span>
            <span className="flex items-center gap-2"><span className="text-accent-gold">✓</span> No posting headaches</span>
          </div>
          <button className="px-10 py-4 bg-accent-gold text-obsidian font-semibold rounded-xl hover:bg-accent-gold/90 transition-all hover-lift glow-gold text-lg">
            Start Creating Now — Free
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-slate/30 bg-charcoal/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-gold to-accent-copper flex items-center justify-center">
                  <span className="text-obsidian font-bold text-lg">φ</span>
                </div>
                <span className="font-serif text-xl text-pure">PhilosophizeMe</span>
              </Link>
              <p className="text-silver text-sm leading-relaxed">
                Empowering creators to share wisdom with the world.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h4 className="text-cloud font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-silver hover:text-pure transition-colors">Features</a></li>
                <li><a href="#pricing" className="text-silver hover:text-pure transition-colors">Pricing</a></li>
                <li><a href="#faq" className="text-silver hover:text-pure transition-colors">FAQ</a></li>
                <li><a href="#" className="text-silver hover:text-pure transition-colors">API</a></li>
              </ul>
            </div>
            
            {/* Legal */}
            <div>
              <h4 className="text-cloud font-medium mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link to="/privacy" className="text-silver hover:text-pure transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-silver hover:text-pure transition-colors">Terms of Service</Link></li>
              </ul>
            </div>
            
            {/* Connect */}
            <div>
              <h4 className="text-cloud font-medium mb-4">Connect</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="mailto:sharoz75@gmail.com" className="text-silver hover:text-pure transition-colors">sharoz75@gmail.com</a></li>
                <li><a href="https://twitter.com/philosophizeme" className="text-silver hover:text-pure transition-colors">Twitter/X</a></li>
                <li><a href="https://instagram.com/philosophizeme_app" className="text-silver hover:text-pure transition-colors">Instagram</a></li>
                <li><a href="#" className="text-silver hover:text-pure transition-colors">Discord</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-slate/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-mist text-sm">© 2026 PhilosophizeMe. All rights reserved.</p>
            <p className="text-mist text-sm italic">Empowering creators to share wisdom with the world.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
