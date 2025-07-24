import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Plus, Calendar, Target, Clock, Eye } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Badge } from '../components/ui/badge'
import { blink } from '../blink/client'

interface TrainingPlan {
  id: string
  title: string
  goal: string
  raceDistance: string
  raceDate: string
  currentFitnessLevel: string
  createdAt: string
  status: string
}

export default function MyPlansPage() {
  const [plans, setPlans] = useState<TrainingPlan[]>([])
  const [loading, setLoading] = useState(true)

  const loadPlans = async () => {
    try {
      const user = await blink.auth.me()
      const userPlans = await blink.db.trainingPlans.list({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' }
      })
      setPlans(userPlans)
    } catch (error) {
      console.error('Error loading plans:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPlans()
  }, [])

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-primary text-primary-foreground'
      case 'completed':
        return 'bg-green-500 text-white'
      case 'paused':
        return 'bg-yellow-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your training plans...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              My Training Plans
            </h1>
            <p className="text-xl text-muted-foreground">
              Track your progress and manage your trail running journey.
            </p>
          </div>
          <Button asChild size="lg" className="mt-4 sm:mt-0">
            <Link to="/generate">
              <Plus className="mr-2 h-5 w-5" />
              Create New Plan
            </Link>
          </Button>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-muted/50 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <Target className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-semibold text-foreground mb-4">
              No Training Plans Yet
            </h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Ready to start your trail running journey? Create your first AI-powered training plan and achieve your goals.
            </p>
            <Button asChild size="lg">
              <Link to="/generate">
                <Plus className="mr-2 h-5 w-5" />
                Generate Your First Plan
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card key={plan.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge className={getStatusColor(plan.status)}>
                      {plan.status.charAt(0).toUpperCase() + plan.status.slice(1)}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {formatDate(plan.createdAt)}
                    </span>
                  </div>
                  <CardTitle className="line-clamp-2">{plan.title}</CardTitle>
                  <CardDescription className="line-clamp-2">
                    {plan.goal.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Target className="mr-2 h-4 w-4" />
                      <span>{plan.raceDistance.replace(/-/g, ' ').toUpperCase()}</span>
                    </div>
                    
                    {plan.raceDate && (
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Race: {formatDate(plan.raceDate)}</span>
                      </div>
                    )}
                    
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>
                        {plan.currentFitnessLevel.charAt(0).toUpperCase() + plan.currentFitnessLevel.slice(1)} Level
                      </span>
                    </div>
                  </div>
                  
                  <Button asChild className="w-full mt-6">
                    <Link to={`/plans/${plan.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      View Plan
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}