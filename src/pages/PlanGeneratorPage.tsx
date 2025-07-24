import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Loader2, Sparkles } from 'lucide-react'
import { Button } from '../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Input } from '../components/ui/input'
import { Label } from '../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select'
import { Textarea } from '../components/ui/textarea'
import { Checkbox } from '../components/ui/checkbox'
import { useToast } from '../hooks/use-toast'
import { blink } from '../blink/client'

interface TrainingPlanForm {
  goal: string
  raceDistance: string
  raceDate: string
  currentFitnessLevel: string
  weeklyMileage: string
  trainingDays: string[]
  timePerSession: string
  experience: string
  injuries: string
  preferences: string
}

export default function PlanGeneratorPage() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<TrainingPlanForm>({
    goal: '',
    raceDistance: '',
    raceDate: '',
    currentFitnessLevel: '',
    weeklyMileage: '',
    trainingDays: [],
    timePerSession: '',
    experience: '',
    injuries: '',
    preferences: ''
  })

  const handleDayToggle = (day: string) => {
    setFormData(prev => ({
      ...prev,
      trainingDays: prev.trainingDays.includes(day)
        ? prev.trainingDays.filter(d => d !== day)
        : [...prev.trainingDays, day]
    }))
  }

  const generatePlan = async () => {
    if (!formData.goal || !formData.raceDistance || !formData.currentFitnessLevel || formData.trainingDays.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields to generate your plan.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const user = await blink.auth.me()
      
      // Create the prompt for AI
      const prompt = `Create a personalized trail running training plan with the following details:

Goal: ${formData.goal}
Race Distance: ${formData.raceDistance}
Race Date: ${formData.raceDate || 'Not specified'}
Current Fitness Level: ${formData.currentFitnessLevel}
Current Weekly Mileage: ${formData.weeklyMileage}
Available Training Days: ${formData.trainingDays.join(', ')}
Time Per Session: ${formData.timePerSession}
Trail Running Experience: ${formData.experience}
Injuries/Limitations: ${formData.injuries || 'None specified'}
Additional Preferences: ${formData.preferences || 'None specified'}

Please create a comprehensive 12-week training plan that includes:
1. Weekly schedule with specific workouts for each training day
2. Progressive mileage buildup
3. Mix of easy runs, tempo runs, hill training, and long runs
4. Recovery and rest day recommendations
5. Strength training suggestions
6. Nutrition and hydration tips
7. Injury prevention advice
8. Race preparation strategy

Format the response as a structured training plan with clear weekly breakdowns.`

      // Generate the plan using AI
      const { text } = await blink.ai.generateText({
        prompt,
        model: 'gpt-4o-mini',
        maxTokens: 2000
      })

      // Save the plan to database
      const planData = {
        userId: user.id,
        title: `${formData.goal} - ${formData.raceDistance} Training Plan`,
        goal: formData.goal,
        raceDistance: formData.raceDistance,
        raceDate: formData.raceDate,
        currentFitnessLevel: formData.currentFitnessLevel,
        weeklyMileage: formData.weeklyMileage,
        trainingDays: formData.trainingDays.join(','),
        timePerSession: formData.timePerSession,
        experience: formData.experience,
        injuries: formData.injuries,
        preferences: formData.preferences,
        aiGeneratedPlan: text,
        createdAt: new Date().toISOString(),
        status: 'active'
      }

      const savedPlan = await blink.db.trainingPlans.create(planData)

      toast({
        title: "Plan Generated Successfully!",
        description: "Your personalized training plan is ready. Redirecting to view it...",
      })

      // Redirect to the plan details page
      setTimeout(() => {
        navigate(`/plans/${savedPlan.id}`)
      }, 1500)

    } catch (error) {
      console.error('Error generating plan:', error)
      toast({
        title: "Generation Failed",
        description: "There was an error generating your plan. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Generate Your Training Plan
          </h1>
          <p className="text-xl text-muted-foreground">
            Tell us about your goals and we'll create a personalized trail running plan just for you.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Training Plan Details
            </CardTitle>
            <CardDescription>
              Provide as much detail as possible for the most accurate and personalized plan.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Goal */}
            <div className="space-y-2">
              <Label htmlFor="goal">Primary Goal *</Label>
              <Select value={formData.goal} onValueChange={(value) => setFormData(prev => ({ ...prev, goal: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your primary training goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="complete-first-trail-race">Complete my first trail race</SelectItem>
                  <SelectItem value="improve-trail-time">Improve my trail race time</SelectItem>
                  <SelectItem value="build-endurance">Build trail running endurance</SelectItem>
                  <SelectItem value="prepare-for-ultra">Prepare for ultra-distance event</SelectItem>
                  <SelectItem value="general-fitness">General trail running fitness</SelectItem>
                  <SelectItem value="comeback-from-injury">Comeback from injury</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Race Distance */}
            <div className="space-y-2">
              <Label htmlFor="raceDistance">Target Race Distance *</Label>
              <Select value={formData.raceDistance} onValueChange={(value) => setFormData(prev => ({ ...prev, raceDistance: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your target distance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5k">5K Trail Run</SelectItem>
                  <SelectItem value="10k">10K Trail Run</SelectItem>
                  <SelectItem value="15k">15K Trail Run</SelectItem>
                  <SelectItem value="half-marathon">Half Marathon Trail</SelectItem>
                  <SelectItem value="marathon">Marathon Trail</SelectItem>
                  <SelectItem value="50k">50K Ultra</SelectItem>
                  <SelectItem value="50-mile">50 Mile Ultra</SelectItem>
                  <SelectItem value="100k">100K Ultra</SelectItem>
                  <SelectItem value="100-mile">100 Mile Ultra</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Race Date */}
            <div className="space-y-2">
              <Label htmlFor="raceDate">Target Race Date (Optional)</Label>
              <Input
                type="date"
                value={formData.raceDate}
                onChange={(e) => setFormData(prev => ({ ...prev, raceDate: e.target.value }))}
              />
            </div>

            {/* Current Fitness Level */}
            <div className="space-y-2">
              <Label htmlFor="currentFitnessLevel">Current Fitness Level *</Label>
              <Select value={formData.currentFitnessLevel} onValueChange={(value) => setFormData(prev => ({ ...prev, currentFitnessLevel: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your current fitness level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner (New to running)</SelectItem>
                  <SelectItem value="novice">Novice (Can run 20-30 minutes)</SelectItem>
                  <SelectItem value="intermediate">Intermediate (Regular runner, 3-5 miles comfortable)</SelectItem>
                  <SelectItem value="advanced">Advanced (Experienced runner, 6+ miles comfortable)</SelectItem>
                  <SelectItem value="elite">Elite (Competitive runner)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Weekly Mileage */}
            <div className="space-y-2">
              <Label htmlFor="weeklyMileage">Current Weekly Mileage</Label>
              <Select value={formData.weeklyMileage} onValueChange={(value) => setFormData(prev => ({ ...prev, weeklyMileage: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your current weekly mileage" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0-10">0-10 miles per week</SelectItem>
                  <SelectItem value="10-20">10-20 miles per week</SelectItem>
                  <SelectItem value="20-30">20-30 miles per week</SelectItem>
                  <SelectItem value="30-40">30-40 miles per week</SelectItem>
                  <SelectItem value="40-50">40-50 miles per week</SelectItem>
                  <SelectItem value="50+">50+ miles per week</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Training Days */}
            <div className="space-y-2">
              <Label>Available Training Days *</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {days.map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={formData.trainingDays.includes(day)}
                      onCheckedChange={() => handleDayToggle(day)}
                    />
                    <Label htmlFor={day} className="text-sm">{day}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Time Per Session */}
            <div className="space-y-2">
              <Label htmlFor="timePerSession">Available Time Per Session</Label>
              <Select value={formData.timePerSession} onValueChange={(value) => setFormData(prev => ({ ...prev, timePerSession: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select available time per training session" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30-45-min">30-45 minutes</SelectItem>
                  <SelectItem value="45-60-min">45-60 minutes</SelectItem>
                  <SelectItem value="60-90-min">60-90 minutes</SelectItem>
                  <SelectItem value="90-120-min">90-120 minutes</SelectItem>
                  <SelectItem value="2+ hours">2+ hours</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience">Trail Running Experience</Label>
              <Select value={formData.experience} onValueChange={(value) => setFormData(prev => ({ ...prev, experience: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select your trail running experience" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new-to-trails">New to trail running</SelectItem>
                  <SelectItem value="some-experience">Some trail experience</SelectItem>
                  <SelectItem value="experienced">Experienced trail runner</SelectItem>
                  <SelectItem value="very-experienced">Very experienced trail runner</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Injuries */}
            <div className="space-y-2">
              <Label htmlFor="injuries">Current Injuries or Limitations</Label>
              <Textarea
                placeholder="Describe any current injuries, past injuries, or physical limitations we should consider..."
                value={formData.injuries}
                onChange={(e) => setFormData(prev => ({ ...prev, injuries: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Preferences */}
            <div className="space-y-2">
              <Label htmlFor="preferences">Additional Preferences</Label>
              <Textarea
                placeholder="Any specific preferences, training styles you enjoy, or additional goals you'd like to include..."
                value={formData.preferences}
                onChange={(e) => setFormData(prev => ({ ...prev, preferences: e.target.value }))}
                rows={3}
              />
            </div>

            {/* Generate Button */}
            <Button 
              onClick={generatePlan} 
              disabled={loading}
              size="lg"
              className="w-full text-lg py-6"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating Your Plan...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-5 w-5" />
                  Generate My Training Plan
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}