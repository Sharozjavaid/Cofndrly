import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BuildIcon } from '../components/Icons'
import SEO from '../components/SEO'

const BuildersPage = () => {
  const navigate = useNavigate()

  const problems = [
    {
      title: "the project graveyard",
      description: "You have 5, maybe 10 finished projects. They work. They're polished. But they're sitting on a shelf collecting dust because you have no time or energy to market them.",
      emoji: "🪦"
    },
    {
      title: "building but not shipping",
      description: "You spend months perfecting the code, but zero hours telling anyone about it. Launch day comes and... crickets. It's demoralizing.",
      emoji: "📦"
    },
    {
      title: "marketing feels impossible",
      description: "You tried posting on Reddit, Twitter, Product Hunt. Maybe got a few upvotes. But you're not a marketer. You're a builder. It's just not your skill set.",
      emoji: "😮‍💨"
    },
    {
      title: "no users, no revenue",
      description: "Your side projects have incredible potential but zero users and zero revenue. Meanwhile, inferior products with better marketing are thriving.",
      emoji: "📉"
    },
    {
      title: "wasted potential",
      description: "You know your projects could make real money if someone just knew how to market them. But you're too busy building the next thing to go back and promote the old ones.",
      emoji: "💸"
    },
    {
      title: "working alone",
      description: "Building solo is isolating. You have no one to bounce ideas off, no one to handle the parts you hate, and no one to share the wins (or losses) with.",
      emoji: "🏝️"
    }
  ]

  const benefits = [
    {
      title: "monetize your shelf projects",
      description: "Stop letting finished projects rot. Hand them to someone who can market them, split the revenue, and finally see your work generate income."
    },
    {
      title: "focus on what you love",
      description: "You build. They market. No more forcing yourself to create TikToks or write cold emails. Just code and ship."
    },
    {
      title: "equity over hourly rates",
      description: "Stop trading time for money. Build something once, split the ownership, and earn recurring revenue as it grows."
    },
    {
      title: "real partnerships",
      description: "This isn't outsourcing to Upwork. A marketing co-founder is invested in success because their equity depends on it. You're in it together."
    },
    {
      title: "faster growth cycles",
      description: "While you iterate on the product, they're building an audience, testing channels, and driving users. Growth happens in parallel, not sequentially."
    },
    {
      title: "shared burden",
      description: "Building alone is exhausting. Having a partner means someone celebrates wins with you and helps shoulder the failures. You're not in it alone anymore."
    }
  ]

  return (
    <>
      <SEO
        title="For Builders — Find a Marketing Co-Founder | cofndrly"
        description="You build great products but struggle with marketing and distribution. Find a growth hacker, content creator, or marketer who can help you reach your audience and scale."
        keywords="technical co-founder, find marketer, marketing co-founder, growth co-founder, startup builder, product developer, technical founder, developer co-founder"
        canonicalUrl="https://cofndrly.com/builders"
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
            <BuildIcon />
          </div>
          <p className="text-xs md:text-sm uppercase tracking-loose text-warm-gray-600 font-sans">
            For builders
          </p>
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl leading-[0.95] text-charcoal">
            your projects<br />
            are collecting dust.<br />
            <span className="italic text-rust">give them life.</span>
          </h1>
          <p className="text-2xl md:text-3xl text-warm-gray-700 leading-relaxed font-light max-w-3xl mx-auto">
            you've built it. now find someone who can sell it. split the equity. finally make money from your work.
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
                your shelf projects could be making money.
              </p>
              <p className="opacity-90">
                you just need someone who can <span className="italic text-rust">market them</span>.
              </p>
              <p className="text-2xl md:text-3xl text-warm-gray-600 font-sans font-light mt-12 max-w-2xl mx-auto">
                hand over your finished project. split the equity. let them handle growth while you keep building.
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
              stop letting<br />projects collect dust
            </h2>
            <p className="text-xl md:text-2xl text-warm-gray-700 font-light mb-12">
              find a marketer who can turn your shelf project into revenue
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
    </>
  )
}

export default BuildersPage

