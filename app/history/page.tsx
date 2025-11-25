"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import NavigationSidebar from "@/components/navigation-sidebar"

interface ActivityRecord {
  id: string
  date: string
  type: string
  name: string
  duration: number
  calories: number
  distance?: number
  intensity: "Low" | "Medium" | "High"
}

export default function HistoryPage() {
  const [user, setUser] = useState<any>(null)
  const [activities, setActivities] = useState<ActivityRecord[]>([
    {
      id: "1",
      date: "2025-11-25",
      type: "Running",
      name: "Morning Run",
      duration: 45,
      calories: 450,
      distance: 5.2,
      intensity: "High",
    },
    {
      id: "2",
      date: "2025-11-25",
      type: "Strength",
      name: "Gym Session",
      duration: 60,
      calories: 380,
      intensity: "High",
    },
    {
      id: "3",
      date: "2025-11-24",
      type: "Cycling",
      name: "Evening Ride",
      duration: 60,
      calories: 520,
      distance: 15.8,
      intensity: "Medium",
    },
    { id: "4", date: "2025-11-24", type: "Yoga", name: "Yoga Class", duration: 30, calories: 150, intensity: "Low" },
    {
      id: "5",
      date: "2025-11-23",
      type: "Running",
      name: "Trail Run",
      duration: 50,
      calories: 480,
      distance: 6.1,
      intensity: "High",
    },
    {
      id: "6",
      date: "2025-11-23",
      type: "Swimming",
      name: "Pool Session",
      duration: 40,
      calories: 420,
      intensity: "Medium",
    },
    {
      id: "7",
      date: "2025-11-22",
      type: "Walking",
      name: "Morning Walk",
      duration: 30,
      calories: 180,
      distance: 2.5,
      intensity: "Low",
    },
    {
      id: "8",
      date: "2025-11-22",
      type: "Strength",
      name: "Weight Training",
      duration: 75,
      calories: 450,
      intensity: "High",
    },
  ])
  const [filteredActivities, setFilteredActivities] = useState<ActivityRecord[]>(activities)
  const [selectedType, setSelectedType] = useState<string | null>(null)
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
    if (selectedType) {
      setFilteredActivities(activities.filter((a) => a.type === selectedType))
    } else {
      setFilteredActivities(activities)
    }
  }, [selectedType, activities])

  if (!user) return null

  const totalCalories = activities.reduce((sum, a) => sum + a.calories, 0)
  const totalDuration = activities.reduce((sum, a) => sum + a.duration, 0)
  const uniqueTypes = [...new Set(activities.map((a) => a.type))]
  const totalDistance = activities.filter((a) => a.distance).reduce((sum, a) => sum + (a.distance || 0), 0)

  const groupedByDate = activities.reduce(
    (acc, activity) => {
      if (!acc[activity.date]) {
        acc[activity.date] = []
      }
      acc[activity.date].push(activity)
      return acc
    },
    {} as Record<string, ActivityRecord[]>,
  )

  const sortedDates = Object.keys(groupedByDate).sort().reverse()

  return (
    <div className="flex h-screen bg-background">
      <NavigationSidebar />
      <main className="flex-1 overflow-auto">
        <DashboardHeader user={user} />

        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Activity History</h2>
            <p className="text-muted-foreground">View all your past workouts and activities</p>
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{activities.length}</div>
                <p className="text-xs text-muted-foreground mt-1">All time</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Calories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{totalCalories}</div>
                <p className="text-xs text-muted-foreground mt-1">kcal burned</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Duration</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{(totalDuration / 60).toFixed(1)}h</div>
                <p className="text-xs text-muted-foreground mt-1">hours exercised</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Distance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{totalDistance.toFixed(1)} km</div>
                <p className="text-xs text-muted-foreground mt-1">traveled</p>
              </CardContent>
            </Card>
          </div>

          {/* Filter */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Filter by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={() => setSelectedType(null)}
                  variant={selectedType === null ? "default" : "outline"}
                  className={selectedType === null ? "bg-primary hover:bg-primary/90 text-white" : "border-border"}
                >
                  All Types
                </Button>
                {uniqueTypes.map((type) => (
                  <Button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    variant={selectedType === type ? "default" : "outline"}
                    className={selectedType === type ? "bg-primary hover:bg-primary/90 text-white" : "border-border"}
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Activities by Date */}
          <div className="space-y-6">
            {sortedDates.map((date) => (
              <div key={date}>
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {new Date(date).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h3>
                <div className="space-y-2">
                  {groupedByDate[date]
                    .filter((a) => !selectedType || a.type === selectedType)
                    .map((activity) => (
                      <Card key={activity.id} className="border-border/50 hover:border-primary/30 transition-colors">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4 flex-1">
                              <div className="text-2xl">
                                {activity.type === "Running"
                                  ? "🏃"
                                  : activity.type === "Cycling"
                                    ? "🚴"
                                    : activity.type === "Walking"
                                      ? "🚶"
                                      : activity.type === "Strength"
                                        ? "💪"
                                        : activity.type === "Yoga"
                                          ? "🧘"
                                          : activity.type === "Swimming"
                                            ? "🏊"
                                            : "🏋️"}
                              </div>
                              <div>
                                <p className="font-semibold text-foreground">{activity.name}</p>
                                <p className="text-sm text-muted-foreground">{activity.type}</p>
                              </div>
                            </div>
                            <div className="grid grid-cols-4 gap-6 text-right">
                              <div>
                                <p className="text-xs text-muted-foreground">Duration</p>
                                <p className="font-semibold text-foreground">{activity.duration} min</p>
                              </div>
                              {activity.distance && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Distance</p>
                                  <p className="font-semibold text-foreground">{activity.distance} km</p>
                                </div>
                              )}
                              <div>
                                <p className="text-xs text-muted-foreground">Intensity</p>
                                <p
                                  className={`font-semibold text-sm ${
                                    activity.intensity === "Low"
                                      ? "text-green-600 dark:text-green-400"
                                      : activity.intensity === "Medium"
                                        ? "text-yellow-600 dark:text-yellow-400"
                                        : "text-red-600 dark:text-red-400"
                                  }`}
                                >
                                  {activity.intensity}
                                </p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Calories</p>
                                <p className="font-semibold text-primary">{activity.calories} kcal</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
