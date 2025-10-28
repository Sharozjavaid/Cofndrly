import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CreateIcon } from '../components/Icons'
import SEO from '../components/SEO'

const CreativesPage = () => {
  const navigate = useNavigate()

  const problems = [
    {
      title: "ideas with no execution",
      description: "You have a vision for an amazing product or campaign, but you can't build it yourself. You need someone who can turn your ideas into reality.",
      emoji: "💡"
    },
    {
      title: "dependent on others' timelines",
      description: "You've worked with freelancers and agencies, but they're slow, expensive, and don't care about your vision as much as you do. You need a partner, not a vendor.",
      emoji: "⏳"
    },
    {
      title: "limited by technical skills",
      description: "You know what good UX looks like. You know what features users want. But you can't code, so you're stuck explaining your vision to developers who don't get it.",
      emoji: "🚧"
    },
    {
      title: "audience without a product",
      description: "You've grown a following, mastered social media, or built an email list. But you have nothing to sell them. You need a product as good as your marketing.",
      emoji: "📱"
    },
    {
      title: "creative energy wasted",
      description: "Instead of focusing on growth, storytelling, and strategy, you're stuck learning to code or managing contractors. Your creativity is being drained by logistics.",
      emoji: "🔋"
    },
    {
      title: "can't scale alone",
      description: "You can create content, run ads, and grow communities. But building, maintaining, and scaling a product? That's a full-time job you weren't meant to do.",
      emoji: "📈"
    }
  ]

  const benefits = [
    {
      title: "bring your vision to life",
      description: "Stop compromising on your ideas. A technical co-founder can build exactly what you envision, and iterate as fast as you can think of new features."
    },
    {
      title: "focus on what drives growth",
      description: "You handle the storytelling, community building, and user acquisition. Let your co-founder worry about servers, bugs, and code."
    },
    {
      title: "move at startup speed",
      description: "No more waiting weeks for a contractor to finish a feature. With a technical co-founder, you can ship updates daily and respond to user feedback instantly."
    },
    {
      title: "true partnership",
      description: "Unlike hiring developers, a co-founder is invested in the success of the business. They care as much as you do because their equity depends on it."
    },
    {
      title: "monetize your audience",
      description: "You've built the audience. Now build something to sell them. A technical co-founder can help you turn followers into customers."
    },
    {
      title: "learn and grow together",
      description: "You'll pick up technical knowledge, they'll learn marketing. Together, you become a more well-rounded founding team that can tackle anything."
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
            you can market<br />
            anything.<br />
            <span className="italic text-rust">but can you build it?</span>
          </h1>
          <p className="text-2xl md:text-3xl text-warm-gray-700 leading-relaxed font-light max-w-3xl mx-auto">
            great marketing needs a great product. you need someone who knows how to build.
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
                you need to <span className="italic text-rust">find a builder</span>.
              </p>
              <p className="text-2xl md:text-3xl text-warm-gray-600 font-sans font-light mt-12 max-w-2xl mx-auto">
                someone who can build your vision while you grow the audience.
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
              turn your audience<br />into a business
            </h2>
            <p className="text-xl md:text-2xl text-warm-gray-700 font-light mb-12">
              find a builder who can bring your vision to life
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

