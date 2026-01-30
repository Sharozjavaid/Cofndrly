import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase/config'

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

// Animated counter hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    let startTime: number | null = null
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [isInView, end, duration])

  return { count, ref }
}

// SVG Icons for social platforms
const TikTokIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.16 8.16 0 0 0 4.77 1.52V6.84a4.86 4.86 0 0 1-1.01-.15z"/>
  </svg>
)

const InstagramIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
)

const FacebookIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const YouTubeIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const XIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

const LinkedInIcon = ({ className = "w-8 h-8" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
)

// Platform data for carousel
const platforms = [
  { name: 'TikTok', icon: TikTokIcon, color: '#ff0050' },
  { name: 'Instagram', icon: InstagramIcon, color: '#E1306C' },
  { name: 'Facebook', icon: FacebookIcon, color: '#1877F2' },
  { name: 'YouTube', icon: YouTubeIcon, color: '#FF0000' },
  { name: 'X (Twitter)', icon: XIcon, color: '#FFFFFF' },
  { name: 'LinkedIn', icon: LinkedInIcon, color: '#0A66C2' },
]

// Feature data
const features = [
  {
    icon: '🧠',
    title: 'AI Content Strategy',
    description: 'Our AI analyzes your niche, competitors, and trending topics to build a custom content strategy that drives engagement.'
  },
  {
    icon: '📱',
    title: 'Multi-Platform Posting',
    description: 'Publish to TikTok, Instagram, Facebook, YouTube, X, and LinkedIn — all from one dashboard, optimized for each platform.'
  },
  {
    icon: '📅',
    title: 'Smart Scheduling',
    description: 'AI determines the best posting times based on your audience activity. Set it once and let the algorithm optimize.'
  },
  {
    icon: '📊',
    title: 'Performance Analytics',
    description: 'Track views, engagement, follower growth, and ROI across all platforms with real-time analytics dashboards.'
  },
  {
    icon: '🎯',
    title: 'Brand Voice Learning',
    description: 'Cofndrly learns your brand voice, visual style, and tone. Every post feels authentically you — because the AI adapts.'
  },
  {
    icon: '🎨',
    title: 'Visual Content Generation',
    description: 'Generate scroll-stopping images, carousels, and video content. AI creates visuals tailored to your brand identity.'
  }
]

const steps = [
  {
    number: '01',
    title: 'Connect Your Accounts',
    description: 'Link your TikTok, Instagram, Facebook, YouTube, and more. One-time OAuth setup — takes 30 seconds.'
  },
  {
    number: '02',
    title: 'Tell Us Your Goals',
    description: 'Describe your business, target audience, and growth goals. Our AI builds a custom content strategy around you.'
  },
  {
    number: '03',
    title: 'AI Creates Content',
    description: 'Cofndrly researches trending topics, writes copy, generates visuals, and creates platform-optimized posts automatically.'
  },
  {
    number: '04',
    title: 'Content Goes Live',
    description: 'Posts are scheduled and published at peak engagement times. You wake up to new followers, views, and engagement.'
  }
]

const proofAccounts = [
  {
    handle: '@philosophize.me',
    platform: 'TikTok',
    url: 'https://www.tiktok.com/@philosophize.me',
    followers: '15K+',
    views: '2M+',
    niche: 'Philosophy & Mindset',
    description: 'Daily philosophy content — fully automated posting and strategy by Cofndrly.'
  },
  {
    handle: '@philosophizeme_app',
    platform: 'TikTok',
    url: 'https://www.tiktok.com/@philosophizeme_app',
    followers: '8K+',
    views: '500K+',
    niche: 'App Promotion',
    description: 'App marketing content driving organic installs through consistent, AI-powered posting.'
  },
  {
    handle: '@geteatai',
    platform: 'TikTok',
    url: 'https://www.tiktok.com/@geteatai',
    followers: '5K+',
    views: '300K+',
    niche: 'AI & Food Tech',
    description: 'Growing a food-tech AI brand with zero manual content effort.'
  }
]

const audiences = [
  {
    icon: '📱',
    title: 'App Founders',
    description: 'Launch your app and let us handle the marketing. Focus on building while Cofndrly grows your audience.'
  },
  {
    icon: '🛒',
    title: 'E-Commerce Businesses',
    description: 'Scale your social presence alongside your store. Automated product content that converts browsers to buyers.'
  },
  {
    icon: '🎬',
    title: 'Content Creators',
    description: 'Focus on what you love creating. Cofndrly handles distribution, scheduling, and cross-platform optimization.'
  },
  {
    icon: '🏢',
    title: 'Agencies',
    description: 'Manage multiple client accounts with white-label social media automation. Scale without scaling headcount.'
  }
]

const pricingPlans = [
  {
    name: 'Free',
    price: '$0',
    period: '/month',
    features: ['1 social account', '5 posts per month', 'Basic AI content', 'Community support'],
    cta: 'Join Waitlist',
    featured: false
  },
  {
    name: 'Growth',
    price: '$50',
    period: '/month',
    features: ['1 social account', '60 posts per month', 'Full AI strategy', 'Auto-posting', 'Performance analytics', 'Brand voice learning', 'Priority support'],
    cta: 'Join Waitlist',
    featured: true
  },
  {
    name: 'Scale',
    price: '$150',
    period: '/month',
    features: ['3 social accounts', '60 posts per account', 'Full AI strategy', 'Auto-posting', 'Performance analytics', 'Brand voice learning', 'Dedicated support'],
    cta: 'Join Waitlist',
    featured: false
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    features: ['Unlimited accounts', 'Custom post volume', 'Custom AI training', 'Cofndrly Studio access', 'White-label options', 'API access', 'Dedicated account manager'],
    cta: 'Join Waitlist',
    featured: false
  }
]

const stats = [
  { value: 50, suffix: '+', label: 'Accounts Managed' },
  { value: 10000, suffix: '+', label: 'Posts Published' },
  { value: 3, suffix: 'M+', label: 'Total Views Generated' },
  { value: 12, suffix: '%', label: 'Avg Engagement Rate' }
]

const faqs = [
  {
    q: 'What is Cofndrly?',
    a: 'Cofndrly is your AI marketing cofounder. It handles your social media strategy, content creation, scheduling, and posting across TikTok, Instagram, Facebook, YouTube, and more — all on autopilot.'
  },
  {
    q: 'Who is this for?',
    a: 'Cofndrly is built for app founders, e-commerce businesses, content creators, and agencies who want to grow their social media presence without dedicating hours to manual posting.'
  },
  {
    q: 'What is Cofndrly Studio?',
    a: 'Cofndrly Studio is for businesses that want more granular control. You create your own images and visual templates, and our AI learns your style. It then continues posting for you using your unique brand aesthetic.'
  },
  {
    q: 'Which platforms do you support?',
    a: 'We currently support TikTok, Instagram, Facebook, YouTube, X (Twitter), and LinkedIn. More platforms are being added regularly.'
  },
  {
    q: 'How does the AI learn my brand?',
    a: 'When you connect your accounts, our AI analyzes your existing content, audience demographics, engagement patterns, and brand voice. It continuously learns and improves from performance data.'
  },
  {
    q: 'Can I review content before it posts?',
    a: 'Absolutely. You can set Cofndrly to full autopilot or approval mode where you review and approve each post before it goes live. You have full control.'
  },
  {
    q: 'Is there a free trial?',
    a: 'Yes! Our Free plan includes 1 social account and 5 posts per month at no cost. Upgrade anytime as you grow.'
  }
]

// Slide images for the demo
const slideImages = [
  '/slides/slide1.png',
  '/slides/slide2.png',
  '/slides/slide3.png',
  '/slides/slide4.png',
  '/slides/slide-5.png',
  '/slides/slide6.png',
  '/slides/slide7.JPG',
]

// Typing dots component
function TypingDots({ color = 'accent-gold' }: { color?: string }) {
  return (
    <div className="flex gap-1.5 items-center">
      <span className={`w-2 h-2 rounded-full bg-${color}/60 animate-bounce`} style={{ animationDelay: '0ms' }} />
      <span className={`w-2 h-2 rounded-full bg-${color}/60 animate-bounce`} style={{ animationDelay: '150ms' }} />
      <span className={`w-2 h-2 rounded-full bg-${color}/60 animate-bounce`} style={{ animationDelay: '300ms' }} />
    </div>
  )
}

// Animated chat demo component
function AgentChatDemo() {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })
  const [phase, setPhase] = useState(0)
  // Phases:
  // 0=nothing, 1=user1 typing, 2=user1 msg visible, 3=thinking1,
  // 4=agent1 streaming, 5=agent1 done + slideshow,
  // 6=user2 typing, 7=user2 visible, 8=thinking2,
  // 9=agent2 streaming, 10=agent2 done + video + accounts

  useEffect(() => {
    if (!isInView) return
    const timers: ReturnType<typeof setTimeout>[] = []
    const schedule = (fn: () => void, delay: number) => {
      timers.push(setTimeout(fn, delay))
    }
    schedule(() => setPhase(1), 400)
    schedule(() => setPhase(2), 2200)
    schedule(() => setPhase(3), 2800)
    schedule(() => setPhase(4), 4200)
    schedule(() => setPhase(5), 5800)
    schedule(() => setPhase(6), 7800)
    schedule(() => setPhase(7), 9400)
    schedule(() => setPhase(8), 10000)
    schedule(() => setPhase(9), 11400)
    schedule(() => setPhase(10), 13000)
    return () => timers.forEach(clearTimeout)
  }, [isInView])

  const chatRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight
    }
  }, [phase])

  return (
    <motion.div
      ref={ref}
      className="relative max-w-4xl mx-auto mt-20"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.8 }}
    >
      {/* Philosophy callout above the chat */}
      <motion.div
        className="text-center mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <p className="text-silver text-sm md:text-base max-w-2xl mx-auto leading-relaxed">
          <span className="text-accent-gold font-medium">Our philosophy:</span> Gather attention to your branded page through engaging content related to your niche. In a world where 3 billion people are on social media, attention is everything — if you can grab someone for a few seconds, you can get them to your page and convert them. Post constantly, grow multiple pages, and let AI do the heavy lifting.
        </p>
      </motion.div>

      <div className="rounded-2xl overflow-hidden border border-slate/50 shadow-2xl">
        {/* Window chrome */}
        <div className="bg-charcoal px-4 py-3 flex items-center gap-2 border-b border-slate/30">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
          <div className="w-3 h-3 rounded-full bg-green-500/60" />
          <span className="ml-3 text-mist text-xs font-mono">Cofndrly Agent</span>
          {/* Account indicator */}
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-accent-violet" />
              <span className="text-mist text-xs">@philosophize.me</span>
            </div>
            {(phase >= 3 && phase <= 4) || (phase >= 8 && phase <= 9) ? (
              <span className="flex items-center gap-1.5 text-accent-gold text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                Thinking...
              </span>
            ) : null}
          </div>
        </div>

        {/* Chat body */}
        <div ref={chatRef} className="bg-gradient-to-b from-graphite to-charcoal p-6 md:p-8 space-y-6 max-h-[700px] overflow-y-auto scroll-smooth">

          {/* Typing indicator for user 1 */}
          {phase === 1 && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-accent-gold text-xs font-medium mr-1">You</span>
              <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-2xl rounded-tr-md px-5 py-3">
                <TypingDots />
              </div>
            </div>
          )}

          {/* User message 1 */}
          {phase >= 2 && (
            <motion.div
              className="flex flex-col items-end gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-accent-gold text-xs font-medium mr-1">You</span>
              <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-2xl rounded-tr-md px-5 py-3 max-w-[85%]">
                <p className="text-cloud text-sm leading-relaxed">I want a slideshow about 5 great leaders who won after almost losing. Dark oil painting style. Make it dramatic</p>
              </div>
            </motion.div>
          )}

          {/* Thinking spinner 1 */}
          {phase === 3 && (
            <motion.div
              className="flex flex-col items-start gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-accent-violet text-xs font-medium ml-1">Agent</span>
              <div className="bg-charcoal border border-slate/30 rounded-2xl rounded-tl-md px-5 py-4">
                <TypingDots color="accent-gold" />
              </div>
            </motion.div>
          )}

          {/* Agent response 1 - streaming */}
          {phase === 4 && (
            <motion.div
              className="flex flex-col items-start gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-accent-violet text-xs font-medium ml-1">Agent</span>
              <div className="bg-charcoal border border-slate/30 rounded-2xl rounded-tl-md px-5 py-4 max-w-[85%]">
                <p className="text-cloud text-sm leading-relaxed animate-pulse">Love it. "5 Leaders Who Won From the Brink of Defeat" — generating slideshow now...</p>
                <span className="inline-block w-0.5 h-4 bg-accent-gold animate-pulse ml-1 align-middle" />
              </div>
            </motion.div>
          )}

          {/* Agent response 1 - complete with slideshow */}
          {phase >= 5 && (
            <motion.div
              className="flex flex-col items-start gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-accent-violet text-xs font-medium ml-1">Agent</span>
              <div className="bg-charcoal border border-slate/30 rounded-2xl rounded-tl-md px-5 py-4 max-w-[90%]">
                <p className="text-cloud text-sm leading-relaxed mb-3">Done. <span className="text-pure font-medium">"5 Leaders Who Won From the Brink of Defeat"</span> — 7 slides, dark oil painting style. Napoleon at Austerlitz, Washington at Valley Forge, Lincoln during the Civil War, Genghis Khan's early exile, and Churchill in 1940.</p>

                {/* Slide preview gallery */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                >
                  <p className="text-mist text-xs font-mono mb-3">// Generated Slideshow</p>
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
                    {slideImages.map((src, i) => (
                      <motion.img
                        key={i}
                        src={src}
                        alt={`Slide ${i + 1}`}
                        className="w-28 h-48 object-cover rounded-xl border border-slate/30 flex-shrink-0 hover:border-accent-gold/50 transition-all hover:scale-105"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 + i * 0.08, duration: 0.3 }}
                      />
                    ))}
                  </div>
                </motion.div>

                <div className="flex gap-2 pt-4 flex-wrap">
                  <span className="px-3 py-1 bg-accent-sage/20 text-accent-sage text-xs rounded-full">Leadership</span>
                  <span className="px-3 py-1 bg-accent-violet/20 text-accent-violet text-xs rounded-full">Slideshow</span>
                  <span className="px-3 py-1 bg-accent-gold/20 text-accent-gold text-xs rounded-full">Dark Oil Style</span>
                  <span className="px-3 py-1 bg-accent-copper/20 text-accent-copper text-xs rounded-full">Instagram + TikTok</span>
                </div>
              </div>
            </motion.div>
          )}

          {/* Typing indicator for user 2 */}
          {phase === 6 && (
            <div className="flex flex-col items-end gap-1">
              <span className="text-accent-gold text-xs font-medium mr-1">You</span>
              <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-2xl rounded-tr-md px-5 py-3">
                <TypingDots />
              </div>
            </div>
          )}

          {/* User message 2 */}
          {phase >= 7 && (
            <motion.div
              className="flex flex-col items-end gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-accent-gold text-xs font-medium mr-1">You</span>
              <div className="bg-accent-gold/10 border border-accent-gold/20 rounded-2xl rounded-tr-md px-5 py-3 max-w-[85%]">
                <p className="text-cloud text-sm leading-relaxed">Now make a video too — a Carl Jung piece. Script it, add narration and transitions. Schedule the video to @philosophize.me at 5pm</p>
              </div>
            </motion.div>
          )}

          {/* Thinking spinner 2 */}
          {phase === 8 && (
            <motion.div
              className="flex flex-col items-start gap-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <span className="text-accent-violet text-xs font-medium ml-1">Agent</span>
              <div className="bg-charcoal border border-slate/30 rounded-2xl rounded-tl-md px-5 py-4">
                <TypingDots color="accent-gold" />
              </div>
            </motion.div>
          )}

          {/* Agent response 2 - streaming */}
          {phase === 9 && (
            <motion.div
              className="flex flex-col items-start gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-accent-violet text-xs font-medium ml-1">Agent</span>
              <div className="bg-charcoal border border-slate/30 rounded-2xl rounded-tl-md px-5 py-4 max-w-[85%]">
                <p className="text-cloud text-sm leading-relaxed animate-pulse">On it. Writing the script, generating narration, creating scenes, and scheduling to @philosophize.me...</p>
                <span className="inline-block w-0.5 h-4 bg-accent-gold animate-pulse ml-1 align-middle" />
              </div>
            </motion.div>
          )}

          {/* Agent response 2 - complete with video + accounts */}
          {phase >= 10 && (
            <motion.div
              className="flex flex-col items-start gap-1"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-accent-violet text-xs font-medium ml-1">Agent</span>
              <div className="bg-charcoal border border-slate/30 rounded-2xl rounded-tl-md px-5 py-4 max-w-[90%]">
                <p className="text-cloud text-sm leading-relaxed mb-4">All done. Here's everything:</p>

                {/* Checklist */}
                <div className="space-y-2 mb-5">
                  <motion.div className="flex items-center gap-2 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
                    <span className="text-green-400">&#10003;</span>
                    <span className="text-cloud"><span className="text-pure font-medium">Script created</span> — Carl Jung on the shadow self, 60 seconds</span>
                  </motion.div>
                  <motion.div className="flex items-center gap-2 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                    <span className="text-green-400">&#10003;</span>
                    <span className="text-cloud"><span className="text-pure font-medium">Narration generated</span> — deep, contemplative voice</span>
                  </motion.div>
                  <motion.div className="flex items-center gap-2 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                    <span className="text-green-400">&#10003;</span>
                    <span className="text-cloud"><span className="text-pure font-medium">AI images generated</span> — 5 scenes with cinematic oil painting style</span>
                  </motion.div>
                  <motion.div className="flex items-center gap-2 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
                    <span className="text-green-400">&#10003;</span>
                    <span className="text-cloud"><span className="text-pure font-medium">Transitions added</span> — slow cross-dissolves between scenes</span>
                  </motion.div>
                  <motion.div className="flex items-center gap-2 text-sm" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
                    <span className="text-green-400">&#10003;</span>
                    <span className="text-cloud"><span className="text-pure font-medium">Each scene brought to life</span> — subtle motion, parallax, ambient effects</span>
                  </motion.div>
                </div>

                {/* Video player - large, expandable */}
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                >
                  <p className="text-mist text-xs font-mono mb-3">// Generated Video</p>
                  <div className="group relative w-full max-w-xs mx-auto aspect-[9/16] rounded-2xl overflow-hidden border-2 border-accent-violet/40 shadow-lg cursor-pointer hover:max-w-sm transition-all duration-500 ease-in-out">
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src="/slides/carljungvideo.mp4" type="video/mp4" />
                    </video>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                    {/* Top label */}
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-accent-violet animate-pulse" />
                      <span className="text-pure/90 text-xs font-mono">@philosophize.me</span>
                    </div>
                    {/* Bottom info */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-pure text-sm font-medium mb-1">Carl Jung — The Shadow Self</p>
                      <p className="text-silver/80 text-xs">Script + Narration + AI Images + Transitions</p>
                    </div>
                    {/* Expand hint */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-black/50 backdrop-blur-sm rounded-lg px-2 py-1 text-[10px] text-silver">
                        Hover to expand
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Schedule summary */}
                <motion.div
                  className="mt-5 p-3 rounded-xl bg-graphite/50 border border-slate/20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-green-400">&#10003;</span>
                    <span className="w-2 h-2 rounded-full bg-accent-violet" />
                    <span className="text-cloud">Scheduled to <span className="text-pure font-medium">@philosophize.me</span></span>
                    <span className="text-mist text-xs">— video posting at 5:00 PM</span>
                  </div>
                </motion.div>

                <p className="text-silver text-sm leading-relaxed mt-4">Video is ready and scheduled. It'll post automatically at 5 PM — you don't need to touch anything.</p>

                <div className="flex gap-2 pt-3 flex-wrap">
                  <span className="px-3 py-1 bg-accent-violet/20 text-accent-violet text-xs rounded-full">Video</span>
                  <span className="px-3 py-1 bg-accent-gold/20 text-accent-gold text-xs rounded-full">AI Narration</span>
                  <span className="px-3 py-1 bg-accent-copper/20 text-accent-copper text-xs rounded-full">Auto-Scheduled</span>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showWaitlistModal, setShowWaitlistModal] = useState(false)
  const [waitlistForm, setWaitlistForm] = useState({ name: '', email: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const handleWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      await addDoc(collection(db, 'waitlist'), {
        name: waitlistForm.name,
        email: waitlistForm.email,
        createdAt: serverTimestamp()
      })
      setSubmitSuccess(true)
      setWaitlistForm({ name: '', email: '' })
    } catch (error) {
      console.error('Error adding to waitlist:', error)
      setSubmitError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const openWaitlist = () => {
    setShowWaitlistModal(true)
    setSubmitSuccess(false)
    setSubmitError('')
  }

  // Counter hooks for stats
  const stat0 = useCounter(stats[0].value)
  const stat1 = useCounter(stats[1].value)
  const stat2 = useCounter(stats[2].value)
  const stat3 = useCounter(stats[3].value)
  const statCounters = [stat0, stat1, stat2, stat3]

  return (
    <div className="min-h-screen bg-obsidian text-cloud">
      {/* Waitlist Modal */}
      {showWaitlistModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-obsidian/80 backdrop-blur-sm"
            onClick={() => setShowWaitlistModal(false)}
          />
          <motion.div
            className="relative bg-charcoal border border-slate/50 rounded-2xl p-8 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <button
              onClick={() => setShowWaitlistModal(false)}
              className="absolute top-4 right-4 text-mist hover:text-pure transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>

            {submitSuccess ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">🚀</div>
                <h3 className="text-2xl font-display font-semibold text-pure mb-2">You're on the list!</h3>
                <p className="text-silver">We'll notify you when Cofndrly launches. Get ready to put your social media on autopilot.</p>
                <button
                  onClick={() => setShowWaitlistModal(false)}
                  className="mt-6 px-6 py-3 bg-accent-gold text-obsidian font-medium rounded-xl hover:bg-accent-gold/90 transition-colors"
                >
                  Got it!
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-2xl font-display font-semibold text-pure mb-2">Join the Waitlist</h3>
                <p className="text-silver mb-6">Be the first to get your marketing cofounder. Early access members get special perks.</p>

                <form onSubmit={handleWaitlistSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-silver mb-2">Name</label>
                    <input
                      type="text"
                      required
                      value={waitlistForm.name}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, name: e.target.value })}
                      className="w-full px-4 py-3 bg-graphite border border-slate/50 rounded-xl text-pure placeholder-mist focus:outline-none focus:border-accent-gold/50 transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-silver mb-2">Email</label>
                    <input
                      type="email"
                      required
                      value={waitlistForm.email}
                      onChange={(e) => setWaitlistForm({ ...waitlistForm, email: e.target.value })}
                      className="w-full px-4 py-3 bg-graphite border border-slate/50 rounded-xl text-pure placeholder-mist focus:outline-none focus:border-accent-gold/50 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>

                  {submitError && (
                    <p className="text-red-400 text-sm">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-accent-gold text-obsidian font-semibold rounded-xl hover:bg-accent-gold/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      )}

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate/30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src="/favicon.png" alt="Cofndrly" className="w-10 h-10 rounded-xl" />
            <span className="font-display text-xl font-semibold text-pure">Cofndrly</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-silver hover:text-pure transition-colors text-sm">Features</a>
            <a href="#how-it-works" className="text-silver hover:text-pure transition-colors text-sm">How It Works</a>
            <a href="#proof" className="text-silver hover:text-pure transition-colors text-sm">Proof</a>
            <a href="#pricing" className="text-silver hover:text-pure transition-colors text-sm">Pricing</a>
            <a href="#faq" className="text-silver hover:text-pure transition-colors text-sm">FAQ</a>
          </div>
          <button
            onClick={openWaitlist}
            className="px-5 py-2.5 bg-accent-gold text-obsidian font-medium text-sm rounded-lg hover:bg-accent-gold/90 transition-colors"
          >
            Join Waitlist
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-radial from-charcoal via-obsidian to-obsidian" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent-gold/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent-violet/10 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent-copper/5 rounded-full blur-3xl" />

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
            <span className="text-accent-gold text-sm font-medium">Your Marketing Cofounder</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-pure mb-6 leading-[1.05]"
          >
            Your Social Media{' '}
            <br className="hidden sm:block" />
            <span className="gradient-text">On Autopilot</span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg md:text-xl text-silver max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Cofndrly is an AI agent that handles all your social media strategizing, posting, and growth.
            <span className="text-cloud"> Built for app founders and e-commerce businesses who want to grow — not grind.</span>
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={openWaitlist}
              className="w-full sm:w-auto px-8 py-4 bg-accent-gold text-obsidian font-semibold rounded-xl hover:bg-accent-gold/90 transition-all hover-lift glow-gold text-lg"
            >
              Join Waitlist — It's Free
            </button>
            <a
              href="#proof"
              className="w-full sm:w-auto px-8 py-4 border border-slate text-cloud font-medium rounded-xl hover:border-silver hover:bg-charcoal/50 transition-all text-center"
            >
              See It In Action
            </a>
          </motion.div>
        </motion.div>

        {/* Platform Carousel */}
        <motion.div
          className="relative max-w-4xl mx-auto mt-20"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
        >
          <div className="text-center mb-8">
            <p className="text-mist text-sm uppercase tracking-widest">Post everywhere, automatically</p>
          </div>
          <div className="overflow-hidden relative">
            {/* Fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-obsidian to-transparent z-10" />
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-obsidian to-transparent z-10" />
            {/* Marquee track */}
            <div className="flex animate-marquee gap-12">
              {[...platforms, ...platforms, ...platforms].map((platform, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 flex flex-col items-center gap-3 px-6 py-4"
                >
                  <div
                    className="w-16 h-16 rounded-2xl bg-charcoal border border-slate/30 flex items-center justify-center transition-all hover:scale-110 hover:border-accent-gold/50"
                    style={{ boxShadow: `0 0 20px ${platform.color}15` }}
                  >
                    <platform.icon className="w-8 h-8 text-cloud" />
                  </div>
                  <span className="text-mist text-xs font-medium">{platform.name}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Agent Conversation Demo */}
        <AgentChatDemo />
      </section>

      {/* Stats Section */}
      <section className="py-16 px-6 border-y border-slate/30 bg-charcoal/20">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <div
                key={i}
                ref={statCounters[i].ref}
                className="text-center"
              >
                <motion.div
                  className="text-3xl md:text-4xl font-display font-bold gradient-text mb-2"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  {statCounters[i].count.toLocaleString()}{stat.suffix}
                </motion.div>
                <div className="text-sm text-mist">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Two Products Section */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-pure mb-4">Two Ways to Grow</h2>
            <p className="text-silver text-lg max-w-2xl mx-auto">Whether you want full autopilot or creative control — Cofndrly has you covered.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Agent */}
            <motion.div
              className="relative p-8 md:p-10 rounded-2xl bg-gradient-to-b from-accent-gold/10 to-transparent border border-accent-gold/30 hover:border-accent-gold/50 transition-all"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="absolute -top-3 left-8 px-4 py-1 bg-accent-gold text-obsidian text-xs font-semibold rounded-full">
                Most Popular
              </div>
              <div className="text-4xl mb-4">🤖</div>
              <h3 className="text-2xl font-display font-semibold text-pure mb-2">Cofndrly Agent</h3>
              <div className="text-accent-gold text-sm font-medium mb-4">Full Autopilot Mode</div>
              <p className="text-silver leading-relaxed mb-6">
                Hand over the keys. Our AI agent handles everything — content strategy, creation, scheduling, and posting.
                You focus on your business while Cofndrly grows your audience.
              </p>
              <ul className="space-y-3 mb-8">
                {['AI-driven content strategy', 'Automatic content creation', 'Smart scheduling & posting', 'Cross-platform optimization', 'Performance-based learning'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-cloud text-sm">
                    <span className="text-accent-gold">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="text-mist text-sm">Best for: App founders, e-commerce businesses</div>
            </motion.div>

            {/* Studio */}
            <motion.div
              className="relative p-8 md:p-10 rounded-2xl bg-graphite/50 border border-slate/30 hover:border-accent-violet/30 transition-all"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <div className="text-4xl mb-4">🎨</div>
              <h3 className="text-2xl font-display font-semibold text-pure mb-2">Cofndrly Studio</h3>
              <div className="text-accent-violet text-sm font-medium mb-4">Creative Control Mode</div>
              <p className="text-silver leading-relaxed mb-6">
                Want more granular control? Create your own images and templates in the studio.
                Our AI learns your unique style and continuously posts content that looks and feels like you made it.
              </p>
              <ul className="space-y-3 mb-8">
                {['Custom image & template creation', 'AI learns your visual style', 'Brand-consistent auto-posting', 'Template library & versioning', 'Full creative approval workflow'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-cloud text-sm">
                    <span className="text-accent-violet">&#10003;</span>
                    {item}
                  </li>
                ))}
              </ul>
              <div className="text-mist text-sm">Best for: Brands with specific visual identity</div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6 bg-charcoal/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-pure mb-4">How It Works</h2>
            <p className="text-silver text-lg">From setup to autopilot in under 5 minutes</p>
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
                <div className="text-6xl font-display font-bold gradient-text opacity-30 mb-4">{step.number}</div>
                <h3 className="text-xl font-display font-semibold text-pure mb-3">{step.title}</h3>
                <p className="text-silver text-sm leading-relaxed">{step.description}</p>
                {i < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 right-0 w-1/2 h-px bg-gradient-to-r from-slate/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-pure mb-4">Everything You Need</h2>
            <p className="text-silver text-lg">A full marketing team, powered by AI</p>
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
                <h3 className="text-xl font-display font-semibold text-pure mb-3">{feature.title}</h3>
                <p className="text-silver text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section id="proof" className="py-24 px-6 bg-charcoal/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-pure mb-4">Real Results, Real Accounts</h2>
            <p className="text-silver text-lg max-w-2xl mx-auto">These are real TikTok accounts grown and managed using Cofndrly. No fake metrics — just consistent, AI-powered posting.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {proofAccounts.map((account, i) => (
              <motion.a
                key={i}
                href={account.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group p-8 rounded-2xl bg-graphite/50 border border-slate/30 hover:border-accent-gold/30 transition-all hover-lift block"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-charcoal border border-slate/50 flex items-center justify-center">
                    <TikTokIcon className="w-6 h-6 text-cloud" />
                  </div>
                  <div>
                    <div className="text-pure font-medium group-hover:text-accent-gold transition-colors">{account.handle}</div>
                    <div className="text-mist text-xs">{account.platform}</div>
                  </div>
                </div>
                <div className="flex gap-6 mb-4">
                  <div>
                    <div className="text-xl font-display font-bold text-pure">{account.followers}</div>
                    <div className="text-mist text-xs">Followers</div>
                  </div>
                  <div>
                    <div className="text-xl font-display font-bold text-pure">{account.views}</div>
                    <div className="text-mist text-xs">Views</div>
                  </div>
                </div>
                <div className="px-3 py-1 bg-accent-gold/10 text-accent-gold text-xs rounded-full inline-block mb-4">{account.niche}</div>
                <p className="text-silver text-sm leading-relaxed">{account.description}</p>
                <div className="mt-4 text-accent-gold text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                  View on TikTok &rarr;
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-pure mb-4">Built For Builders</h2>
            <p className="text-silver text-lg">Whether you're launching an app or scaling a store</p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((audience, i) => (
              <motion.div
                key={i}
                className="p-6 rounded-xl bg-graphite/30 border border-slate/20 text-center hover:border-accent-gold/20 transition-all"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl mb-3">{audience.icon}</div>
                <h3 className="font-display font-semibold text-pure mb-2">{audience.title}</h3>
                <p className="text-silver text-sm">{audience.description}</p>
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
            <h2 className="text-4xl md:text-5xl font-display font-bold text-pure mb-4">Simple Pricing</h2>
            <p className="text-silver text-lg">Start free, scale as you grow</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
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
                <h3 className="text-xl font-display font-semibold text-pure mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-4xl font-display font-bold gradient-text">{plan.price}</span>
                  <span className="text-mist text-sm">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3 text-silver text-sm">
                      <span className="text-accent-gold">&#10003;</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={openWaitlist}
                  className={`w-full py-3 rounded-xl font-medium transition-all ${
                    plan.featured
                      ? 'bg-accent-gold text-obsidian hover:bg-accent-gold/90'
                      : 'border border-slate text-cloud hover:border-silver hover:bg-charcoal/50'
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-mist text-sm mt-8">
            Currently in beta — join the waitlist for early access
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
            <h2 className="text-4xl md:text-5xl font-display font-bold text-pure mb-4">FAQ</h2>
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
      <section className="py-24 px-6 relative overflow-hidden bg-charcoal/30">
        <div className="absolute inset-0 bg-gradient-radial from-accent-gold/5 via-transparent to-transparent" />
        <motion.div
          className="relative max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-display font-bold text-pure mb-6">
            Ready to Put Your Social Media on Autopilot?
          </h2>
          <p className="text-silver text-lg mb-8 max-w-2xl mx-auto">
            Join founders and businesses who are growing their audience — without the hours of manual content work.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-10 text-sm text-silver">
            <span className="flex items-center gap-2"><span className="text-accent-gold">&#10003;</span> No content creation required</span>
            <span className="flex items-center gap-2"><span className="text-accent-gold">&#10003;</span> Works across all platforms</span>
            <span className="flex items-center gap-2"><span className="text-accent-gold">&#10003;</span> Posts while you sleep</span>
          </div>
          <button
            onClick={openWaitlist}
            className="px-10 py-4 bg-accent-gold text-obsidian font-semibold rounded-xl hover:bg-accent-gold/90 transition-all hover-lift glow-gold text-lg"
          >
            Join the Waitlist — Free
          </button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 border-t border-slate/30">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-1">
              <Link to="/" className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent-gold to-accent-copper flex items-center justify-center">
                  <span className="text-obsidian font-bold text-lg">C</span>
                </div>
                <span className="font-display text-xl font-semibold text-pure">Cofndrly</span>
              </Link>
              <p className="text-silver text-sm leading-relaxed">
                Your AI marketing cofounder. Social media strategy, content, and posting — on autopilot.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="text-cloud font-medium mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="text-silver hover:text-pure transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-silver hover:text-pure transition-colors">How It Works</a></li>
                <li><a href="#pricing" className="text-silver hover:text-pure transition-colors">Pricing</a></li>
                <li><a href="#faq" className="text-silver hover:text-pure transition-colors">FAQ</a></li>
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
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-mist text-sm">&copy; 2026 Cofndrly. All rights reserved.</p>
            <p className="text-mist text-sm italic">Your marketing cofounder, powered by AI.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
