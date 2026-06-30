import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import ClimatePrediction from './pages/ClimatePrediction'
import StateAnalysis from './pages/StateAnalysis'
import About from './pages/About'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-mist-50 dark:bg-ink-950 bg-monsoon-radial text-ink-900 dark:text-mist-50 font-body transition-colors duration-300">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/predict" element={<ClimatePrediction />} />
          <Route path="/states" element={<StateAnalysis />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
