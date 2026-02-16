import ResumeTimeline from './components/ResumeTimeline'
import Footer from './components/Footer'
import SplitHero from './components/SplitHero'
import Hero from './components/Hero'
import './index.css'

const keywords = ['AWS', 'React', 'Laravel', 'Systems', 'Scale', 'Pragmatic']
function App() {
  return (
    <div className="min-h-screen gradient-bg text-slate-100">
      <section className="hero-section flex items-center justify-center px-4 pt-32 pb-24 md:pt-40 md:pb-32 relative overflow-hidden">
        {keywords.map((keyword, index) => (
          <div key={keyword} className={`floating-keyword floating-keyword-${index + 1}`}>
            {keyword}
          </div>
        ))}
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <Hero />
      </section>
      <SplitHero />
      <section id="experience">
        <ResumeTimeline />
      </section>
      <Footer />
    </div>
  )
}

export default App
