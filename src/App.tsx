import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { blink } from './blink/client'
import { Toaster } from './components/ui/toaster'
import Header from './components/layout/Header'
import HomePage from './pages/HomePage'
import PlanGeneratorPage from './pages/PlanGeneratorPage'
import MyPlansPage from './pages/MyPlansPage'
import PlanDetailsPage from './pages/PlanDetailsPage'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <h1 className="text-3xl font-bold text-foreground mb-4">Welcome to TrailAI</h1>
          <p className="text-muted-foreground mb-6">
            Get personalized trail running training plans powered by AI. Please sign in to continue.
          </p>
          <button
            onClick={() => blink.auth.login()}
            className="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Sign In to Get Started
          </button>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Header user={user} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/generate" element={<PlanGeneratorPage />} />
            <Route path="/plans" element={<MyPlansPage />} />
            <Route path="/plans/:id" element={<PlanDetailsPage />} />
          </Routes>
        </main>
        <Toaster />
      </div>
    </Router>
  )
}

export default App