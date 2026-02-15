import ResumeTimeline from './components/ResumeTimeline'
import Footer from './components/Footer'
import SplitHero from './components/SplitHero'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <SplitHero />
      <section id="experience">
        <ResumeTimeline />
      </section>
      <Footer />
    </div>
  )
}

export default App
