import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Target, Calendar, TrendingUp } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            AI-Powered Trail Running
            <span className="text-primary block">Training Plans</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            Get personalized trail running training plans tailored to your goals, fitness level, and schedule. 
            Whether you're preparing for your first 5K trail race or an ultra-marathon, our AI creates the perfect plan for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8 py-6">
              <Link to="/generate">
                Generate My Plan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 py-6">
              <Link to="/plans">View My Plans</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
              Why Choose TrailAI?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our AI understands the unique demands of trail running and creates plans that work for real runners.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mx-auto mb-4">
                  <Zap className="h-6 w-6" />
                </div>
                <CardTitle>AI-Powered</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Advanced AI analyzes your goals, fitness level, and preferences to create the perfect training plan.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-accent/10 text-accent p-3 rounded-full w-fit mx-auto mb-4">
                  <Target className="h-6 w-6" />
                </div>
                <CardTitle>Goal-Focused</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Whether it's a 5K trail run, marathon, or ultra-distance, we tailor plans to your specific race goals.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-primary/10 text-primary p-3 rounded-full w-fit mx-auto mb-4">
                  <Calendar className="h-6 w-6" />
                </div>
                <CardTitle>Flexible Scheduling</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Plans adapt to your available training days and time constraints while maximizing your progress.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="bg-accent/10 text-accent p-3 rounded-full w-fit mx-auto mb-4">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <CardTitle>Progressive Training</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Smart progression that builds endurance, strength, and trail-specific skills over time.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/10 to-accent/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Trail Running?
          </h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of trail runners who have achieved their goals with AI-powered training plans.
          </p>
          <Button asChild size="lg" className="text-lg px-8 py-6">
            <Link to="/generate">
              Create Your First Plan
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}