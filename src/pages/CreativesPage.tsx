import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CreateIcon } from '../components/Icons'
import SEO from '../components/SEO'

const CreativesPage = () => {
  const navigate = useNavigate()

  const problems = [
    {
      title: "stuck in gig work hell",
      description: "You're making $15 per TikTok, $25 per Instagram post, grinding on Fiverr and Upwork. You're talented, but you're trading hours for pennies with no upside.",
      emoji: "💸"
    },
    {
      title: "building someone else's brand",
      description: "You pour creativity into content that grows other people's businesses. They get equity and recurring revenue. You get a one-time payment and move to the next gig.",
      emoji: "🎪"
    },
    {
      title: "no product to promote",
      description: "You know how to make things go viral. You can grow audiences, drive traffic, create content that converts. But you have nothing of your own to sell.",
      emoji: "🚧"
    },
    {
      title: "income ceiling",
      description: "There's a limit to how much you can charge per hour or per deliverable. You can't scale yourself. More money means more hours, and you're already maxed out.",
      emoji: "⏰"
    },
    {
      title: "creative energy wasted",
      description: "Your best ideas and campaigns go to clients who don't even appreciate them. What if you poured that energy into something you actually owned?",
      emoji: "🔋"
    },
    {
      title: "no leverage",
      description: "You're building skills, creating content, growing audiences — but none of it compounds. Every month you start from zero. You need equity, not invoices.",
      emoji: "📉"
    }
  ]

  const benefits = [
    {
      title: "equity over hourly rates",
      description: "Stop selling your time for $15/video. Partner with a developer, take equity, and earn recurring revenue as the product grows."
    },
    {
      title: "promote something you own",
      description: "Your content, your strategy, your growth skills — finally directed toward something you have a stake in. Every view, every conversion benefits you directly."
    },
    {
      title: "leverage existing products",
      description: "Developers have finished projects sitting idle. You don't need to start from scratch. Take a working product and make it successful."
    },
    {
      title: "true partnership",
      description: "This isn't a client relationship. You're co-founders. Equal stake, equal say, shared upside. You're building wealth together, not trading time for money."
    },
    {
      title: "focus on what you're great at",
      description: "No more learning Python or figuring out APIs. You handle marketing, growth, and storytelling. They handle the tech. Division of labor at its finest."
    },
    {
      title: "compounding growth",
      description: "Your marketing efforts compound. Every piece of content, every campaign, every user you bring in builds long-term value in something you co-own."
    }
  ]

  return (
    <>
      <SEO
        title="For Storytellers — Find a Technical Co-Founder | cofndrly"
        description="You're a growth hacker, content creator, or marketer who needs a technical partner. Find a builder who can turn your vision into a real product and scale it."
        keywords="find technical co-founder, developer co-founder, technical partner, growth hacker, content creator, marketing co-founder, non-technical founder"
        canonicalUrl="https://cofndrly.com/creatives"
      />
      <div className="min-h-screen bg-cream grain">
        {/* Navigation */}
      <nav className="fixed top-0 w-full bg-cream/80 backdrop-blur-md border-b border-warm-gray-200/50 z-50">
        <div className="max-w-7xl mx-auto px-8 py-6 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onClick={() => navigate('/')}
            className="text-xl font-serif tracking-tight lowercase text-charcoal cursor-pointer"
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

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-8 pt-32 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-5xl w-full text-center space-y-8"
        >
          <div className="text-7xl mb-8">
            <CreateIcon />
          </div>
          <p className="text-xs md:text-sm uppercase tracking-loose text-warm-gray-600 font-sans">
            For storytellers
          </p>
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-charcoal">
            stop making<br />
            $15 per video.<br />
            <span className="italic text-rust">own something real.</span>
          </h1>
          <p className="text-2xl md:text-3xl text-warm-gray-700 leading-relaxed font-light max-w-3xl mx-auto">
            find a developer with a finished product. become partners. promote something you own. make real money.
          </p>
        </motion.div>
      </section>

      {/* Problems Section */}
      <section className="py-32 px-8 bg-sand">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-sm uppercase tracking-loose text-warm-gray-600 mb-6 font-sans">
              The creative's dilemma
            </p>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal lowercase mb-8">
              problems you know<br />too well
            </h2>
            <p className="text-xl md:text-2xl text-warm-gray-700 font-light max-w-3xl mx-auto">
              you're not alone. these are the struggles every non-technical founder faces.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {problems.map((problem, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                className="bg-white rounded-sm p-10 border border-warm-gray-200 hover:border-charcoal transition-all group"
              >
                <div className="text-5xl mb-6">{problem.emoji}</div>
                <h3 className="font-serif text-3xl text-charcoal lowercase mb-4">
                  {problem.title}
                </h3>
                <p className="text-warm-gray-700 leading-relaxed font-light text-lg">
                  {problem.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Solution */}
      <section className="py-32 px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="space-y-12"
          >
            <p className="text-sm uppercase tracking-loose text-warm-gray-600 font-sans">
              The solution
            </p>
            
            <div className="space-y-8 text-3xl md:text-4xl lg:text-5xl font-serif leading-relaxed text-charcoal">
              <p className="opacity-90">
                you don't need to learn to code.
              </p>
              <p className="opacity-90">
                you need to <span className="italic text-rust">partner with someone who already built something</span>.
              </p>
              <p className="text-2xl md:text-3xl text-warm-gray-600 font-sans font-light mt-12 max-w-2xl mx-auto">
                find a developer with a shelf project. become co-founders. market it. split the profits.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
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
              Why you need a technical co-founder
            </p>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-cream lowercase">
              the benefits
            </h2>
          </motion.div>

          <div className="space-y-16">
            {benefits.map((benefit, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="border-l-2 border-rust pl-8 md:pl-12"
              >
                <h3 className="font-serif text-3xl md:text-4xl lowercase text-cream mb-4">
                  {benefit.title}
                </h3>
                <p className="text-warm-gray-300 leading-relaxed font-light text-lg md:text-xl max-w-3xl">
                  {benefit.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Real Examples */}
      <section className="py-32 px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
            className="text-center mb-20"
          >
            <p className="text-sm uppercase tracking-loose text-warm-gray-600 mb-6 font-sans">
              Success stories
            </p>
            <h2 className="font-serif text-5xl md:text-6xl text-charcoal lowercase">
              it works
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                company: "Nike",
                duo: "Bowerman + Knight",
                insight: "Bowerman designed the shoes. Knight built the brand empire."
              },
              {
                company: "Warby Parker",
                duo: "Gilboa + Raider",
                insight: "One handled product and tech. The other built the brand story."
              },
              {
                company: "Glossier",
                duo: "Weiss + Barna",
                insight: "Weiss created the brand. Barna built the platform that scaled it."
              }
            ].map((example, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.8 }}
                className="bg-sand rounded-sm p-10 border border-warm-gray-200"
              >
                <h3 className="font-serif text-2xl text-charcoal mb-2">
                  {example.company}
                </h3>
                <p className="text-sm text-rust font-sans uppercase tracking-wider mb-4">
                  {example.duo}
                </p>
                <p className="text-warm-gray-700 leading-relaxed font-light">
                  {example.insight}
                </p>
              </motion.div>
            ))}
          </div>
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
            <h2 className="font-serif text-6xl md:text-7xl text-charcoal mb-8 leading-tight lowercase">
              stop creating<br />for pennies
            </h2>
            <p className="text-xl md:text-2xl text-warm-gray-700 font-light mb-12">
              find a builder who can give you equity, not invoices
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="px-14 py-6 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase text-xl inline-block"
            >
              find your builder
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-8 border-t border-warm-gray-200">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="font-serif text-lg lowercase text-charcoal cursor-pointer" onClick={() => navigate('/')}>
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
    </>
  )
}

export default CreativesPage

