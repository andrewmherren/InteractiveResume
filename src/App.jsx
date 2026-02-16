import ResumeTimeline from './components/ResumeTimeline'
import Footer from './components/Footer'
import SplitHero from './components/SplitHero'
import Hero from './components/Hero'
import './index.css'

function App() {
  return (
    <div className="min-h-screen gradient-bg text-slate-100">
      <section className="hero-section flex items-center justify-center px-4 pt-32 pb-24 md:pt-40 md:pb-32 relative overflow-hidden">
        <div className="floating-keyword floating-keyword-1">AWS</div>
        <div className="floating-keyword floating-keyword-2">React</div>
        <div className="floating-keyword floating-keyword-3">Laravel</div>
        <div className="floating-keyword floating-keyword-4">Systems</div>
        <div className="floating-keyword floating-keyword-5">Scale</div>
        <div className="floating-keyword floating-keyword-6">Pragmatic</div>
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
