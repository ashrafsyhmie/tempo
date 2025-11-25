"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import NavigationSidebar from "@/components/navigation-sidebar"

interface Activity {
  id: string
  name: string
  bodyParts: string[]
  difficulty: "Easy" | "Medium" | "Hard"
  duration: number
  calories: number
  description: string
}

const activitiesData: Activity[] = [
  {
    id: "1",
    name: "Bench Press",
    bodyParts: ["Chest", "Triceps", "Shoulders"],
    difficulty: "Medium",
    duration: 5,
    calories: 50,
    description: "Classic chest exercise targeting front upper body",
  },
  {
    id: "2",
    name: "Squats",
    bodyParts: ["Legs", "Glutes", "Quads"],
    difficulty: "Hard",
    duration: 8,
    calories: 80,
    description: "Compound leg exercise for lower body strength",
  },
  {
    id: "3",
    name: "Pull-ups",
    bodyParts: ["Back", "Biceps", "Shoulders"],
    difficulty: "Hard",
    duration: 5,
    calories: 60,
    description: "Great for back and arm development",
  },
  {
    id: "4",
    name: "Plank",
    bodyParts: ["Core", "Shoulders", "Back"],
    difficulty: "Easy",
    duration: 3,
    calories: 30,
    description: "Isometric core strengthening exercise",
  },
  {
    id: "5",
    name: "Deadlifts",
    bodyParts: ["Back", "Legs", "Glutes", "Core"],
    difficulty: "Hard",
    duration: 6,
    calories: 100,
    description: "Full body compound movement",
  },
  {
    id: "6",
    name: "Bicep Curls",
    bodyParts: ["Biceps", "Forearms"],
    difficulty: "Easy",
    duration: 4,
    calories: 25,
    description: "Isolation exercise for arm development",
  },
  {
    id: "7",
    name: "Leg Press",
    bodyParts: ["Legs", "Quads", "Glutes"],
    difficulty: "Medium",
    duration: 6,
    calories: 70,
    description: "Machine-based leg workout",
  },
  {
    id: "8",
    name: "Rowing",
    bodyParts: ["Back", "Arms", "Core", "Legs"],
    difficulty: "Medium",
    duration: 10,
    calories: 120,
    description: "Full body cardio and strength exercise",
  },
]

const bodyParts = [
  "Chest",
  "Back",
  "Legs",
  "Arms",
  "Shoulders",
  "Glutes",
  "Core",
  "Triceps",
  "Biceps",
  "Quads",
  "Forearms",
]

export default function ActivitiesPage() {
  const [user, setUser] = useState<any>(null)
  const [selectedBodyPart, setSelectedBodyPart] = useState<string | null>(null)
  const [filteredActivities, setFilteredActivities] = useState<Activity[]>(activitiesData)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  useEffect(() => {
    if (selectedBodyPart) {
      setFilteredActivities(activitiesData.filter((activity) => activity.bodyParts.includes(selectedBodyPart)))
    } else {
      setFilteredActivities(activitiesData)
    }
  }, [selectedBodyPart])

  if (!user) return null

  return (
    <div className="flex h-screen bg-background">
      <NavigationSidebar />
      <main className="flex-1 overflow-auto">
        <DashboardHeader user={user} />

        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Exercise Library</h2>
            <p className="text-muted-foreground">Browse exercises by body part and difficulty</p>
          </div>

          {/* Body Part Filter */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Filter by Body Part</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setSelectedBodyPart(null)}
                  variant={selectedBodyPart === null ? "default" : "outline"}
                  className={selectedBodyPart === null ? "bg-primary hover:bg-primary/90 text-white" : ""}
                >
                  All Exercises
                </Button>
                {bodyParts.map((part) => (
                  <Button
                    key={part}
                    onClick={() => setSelectedBodyPart(part)}
                    variant={selectedBodyPart === part ? "default" : "outline"}
                    className={
                      selectedBodyPart === part ? "bg-primary hover:bg-primary/90 text-white" : "border-border"
                    }
                  >
                    {part}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activities Grid */}
          <div className="grid md:grid-cols-2 gap-4">
            {filteredActivities.map((activity) => (
              <Card key={activity.id} className="border-border/50 hover:border-primary/30 transition-colors">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg">{activity.name}</CardTitle>
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        activity.difficulty === "Easy"
                          ? "bg-green-500/20 text-green-700 dark:text-green-400"
                          : activity.difficulty === "Medium"
                            ? "bg-yellow-500/20 text-yellow-700 dark:text-yellow-400"
                            : "bg-red-500/20 text-red-700 dark:text-red-400"
                      }`}
                    >
                      {activity.difficulty}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{activity.description}</p>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-2">Targets</p>
                      <div className="flex flex-wrap gap-2">
                        {activity.bodyParts.map((part) => (
                          <span key={part} className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded">
                            {part}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-border/30">
                      <div>
                        <p className="text-xs text-muted-foreground">Duration</p>
                        <p className="font-semibold text-foreground">{activity.duration} min</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Calories</p>
                        <p className="font-semibold text-primary">{activity.calories} kcal</p>
                      </div>
                      <div className="text-right">
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white w-full">
                          Start
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredActivities.length === 0 && (
            <Card className="border-border/50">
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">No exercises found for this body part</p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  )
}
