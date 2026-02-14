import Hero from './components/Hero'
import ResumeTimeline from './components/ResumeTimeline'
import Footer from './components/Footer'
import GodotTeaser from './components/GodotTeaser'
import './index.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <GodotTeaser />
      <Hero />
      <section id="experience">
        <ResumeTimeline />
      </section>
      <Footer />
    </div>
  )
}

export default App
