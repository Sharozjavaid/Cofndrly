import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BuildIcon } from '../components/Icons'

const BuildersPage = () => {
  const navigate = useNavigate()

  const problems = [
    {
      title: "shipping in silence",
      description: "You've built multiple projects with great technical execution, but they never gain traction. Hours spent perfecting code, zero hours on telling anyone about it.",
      emoji: "🤫"
    },
    {
      title: "marketing feels like a chore",
      description: "Writing copy, creating content, managing social media — these tasks drain your energy and take you away from what you love: building and iterating on your product.",
      emoji: "😮‍💨"
    },
    {
      title: "no distribution strategy",
      description: "You know how to build a product. But getting it in front of users? That's a completely different skill set you don't have time to master.",
      emoji: "📉"
    },
    {
      title: "wearing too many hats",
      description: "You're forced to be the developer, designer, marketer, salesperson, and customer support. You end up doing everything poorly instead of your one thing excellently.",
      emoji: "🎩"
    },
    {
      title: "launch anxiety",
      description: "Every launch feels like shouting into the void. You post on Reddit, Twitter, and Product Hunt, but crickets. Meanwhile, inferior products with better marketing thrive.",
      emoji: "😰"
    },
    {
      title: "the graveyard of side projects",
      description: "Your GitHub is filled with amazing projects that got 5 stars. Not because they're bad, but because nobody knows they exist.",
      emoji: "🪦"
    }
  ]

  const benefits = [
    {
      title: "focus on what you do best",
      description: "Stop context-switching between code and marketing. Let someone who lives and breathes growth handle distribution while you perfect the product."
    },
    {
      title: "complementary skill sets",
      description: "A marketer thinks in stories, audiences, and virality. You think in systems, logic, and scalability. Together, you're unstoppable."
    },
    {
      title: "faster validation cycles",
      description: "Build, ship, market, measure, iterate. With a marketing co-founder, you can validate ideas 10x faster because someone's already building the audience while you build the product."
    },
    {
      title: "network effects",
      description: "Marketers have connections with influencers, media, and communities you've never heard of. Tap into networks you'd never reach alone."
    },
    {
      title: "sustainable growth",
      description: "Stop relying on one-time Product Hunt launches. A marketing co-founder builds systems for continuous user acquisition and retention."
    },
    {
      title: "shared emotional burden",
      description: "Building alone is isolating. Having a co-founder means someone celebrates wins with you and helps shoulder the failures."
    }
  ]

  return (
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
            <BuildIcon />
          </div>
          <p className="text-xs md:text-sm uppercase tracking-loose text-warm-gray-600 font-sans">
            For builders
          </p>
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-charcoal">
            you can build<br />
            anything.<br />
            <span className="italic text-rust">but can you sell it?</span>
          </h1>
          <p className="text-2xl md:text-3xl text-warm-gray-700 leading-relaxed font-light max-w-3xl mx-auto">
            great products don't sell themselves. you need someone who knows how to make noise.
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
              The builder's dilemma
            </p>
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl text-charcoal lowercase mb-8">
              problems you know<br />too well
            </h2>
            <p className="text-xl md:text-2xl text-warm-gray-700 font-light max-w-3xl mx-auto">
              you're not alone. these are the struggles every technical founder faces.
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
                you don't need to become a marketer.
              </p>
              <p className="opacity-90">
                you need to <span className="italic text-rust">find one</span>.
              </p>
              <p className="text-2xl md:text-3xl text-warm-gray-600 font-sans font-light mt-12 max-w-2xl mx-auto">
                someone who can tell your story while you write the code.
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
              Why you need a marketing co-founder
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
                company: "Apple",
                duo: "Wozniak + Jobs",
                insight: "Wozniak built the computer. Jobs sold the vision."
              },
              {
                company: "Airbnb",
                duo: "Gebbia + Chesky",
                insight: "Gebbia designed it. Chesky grew it to millions."
              },
              {
                company: "Stripe",
                duo: "Patrick + John Collison",
                insight: "One focused on product. One focused on distribution."
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
              stop building<br />in silence
            </h2>
            <p className="text-xl md:text-2xl text-warm-gray-700 font-light mb-12">
              find a marketer who can amplify your work
            </p>
            <button
              onClick={() => navigate('/signup')}
              className="px-14 py-6 bg-charcoal text-cream rounded-sm hover:bg-warm-gray-900 transition-all font-sans tracking-relaxed lowercase text-xl inline-block"
            >
              find your storyteller
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
  )
}

export default BuildersPage

