"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import NavigationSidebar from "@/components/navigation-sidebar"

interface RoutePoint {
  lat: number
  lng: number
  timestamp: number
}

interface TrackingSession {
  id: string
  type: "Running" | "Cycling" | "Walking"
  startTime: number
  endTime?: number
  route: RoutePoint[]
  distance: number
  duration: number
  calories: number
  avgSpeed: number
}

export default function TrackingPage() {
  const [user, setUser] = useState<any>(null)
  const [tracking, setTracking] = useState(false)
  const [currentType, setCurrentType] = useState<"Running" | "Cycling" | "Walking">("Running")
  const [sessions, setSessions] = useState<TrackingSession[]>([
    {
      id: "1",
      type: "Running",
      startTime: Date.now() - 3600000,
      endTime: Date.now() - 1800000,
      route: [],
      distance: 5.2,
      duration: 30,
      calories: 450,
      avgSpeed: 10.4,
    },
    {
      id: "2",
      type: "Cycling",
      startTime: Date.now() - 7200000,
      endTime: Date.now() - 3600000,
      route: [],
      distance: 15.8,
      duration: 60,
      calories: 520,
      avgSpeed: 15.8,
    },
  ])
  const [sessionTime, setSessionTime] = useState(0)
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
    let interval: NodeJS.Timeout
    if (tracking) {
      interval = setInterval(() => {
        setSessionTime((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [tracking])

  const startTracking = () => {
    setTracking(true)
    setSessionTime(0)
  }

  const stopTracking = () => {
    if (sessionTime > 0) {
      const distance = (
        (sessionTime / 60) *
        (currentType === "Cycling" ? 20 : currentType === "Running" ? 10 : 5)
      ).toFixed(1)
      const calories = Math.round(
        (sessionTime / 60) * (currentType === "Cycling" ? 500 : currentType === "Running" ? 900 : 300),
      )
      const avgSpeed = (Number.parseFloat(distance) / (sessionTime / 60)).toFixed(1)

      const newSession: TrackingSession = {
        id: Date.now().toString(),
        type: currentType,
        startTime: Date.now() - sessionTime * 1000,
        endTime: Date.now(),
        route: [],
        distance: Number.parseFloat(distance),
        duration: Math.round(sessionTime / 60),
        calories,
        avgSpeed: Number.parseFloat(avgSpeed),
      }

      setSessions([newSession, ...sessions])
    }
    setTracking(false)
    setSessionTime(0)
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-background">
      <NavigationSidebar />
      <main className="flex-1 overflow-auto">
        <DashboardHeader user={user} />

        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Activity Tracking</h2>
            <p className="text-muted-foreground">Track your running, cycling, and walking activities with GPS</p>
          </div>

          {/* Active Tracking Session */}
          <Card className="border-primary/50 bg-gradient-to-br from-primary/10 to-primary/5">
            <CardHeader>
              <CardTitle>Start New Activity</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Activity Type Selection */}
              <div>
                <p className="text-sm font-medium text-foreground mb-3">Activity Type</p>
                <div className="flex gap-3">
                  {(["Running", "Cycling", "Walking"] as const).map((type) => (
                    <Button
                      key={type}
                      onClick={() => !tracking && setCurrentType(type)}
                      variant={currentType === type ? "default" : "outline"}
                      disabled={tracking}
                      className={currentType === type ? "bg-primary hover:bg-primary/90 text-white" : "border-border"}
                    >
                      {type}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Live Tracking Stats */}
              {tracking && (
                <div className="grid md:grid-cols-4 gap-4 p-4 bg-background rounded-lg">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Time</p>
                    <p className="text-2xl font-bold text-primary font-mono">{formatTime(sessionTime)}</p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Distance</p>
                    <p className="text-2xl font-bold text-secondary font-mono">
                      {(
                        ((sessionTime / 60) * (currentType === "Cycling" ? 20 : currentType === "Running" ? 10 : 5)) /
                        1000
                      ).toFixed(1)}{" "}
                      km
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Speed</p>
                    <p className="text-2xl font-bold text-accent font-mono">
                      {(
                        (sessionTime / 60) *
                        (currentType === "Cycling" ? 20 : currentType === "Running" ? 10 : 5)
                      ).toFixed(1)}{" "}
                      km/h
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted-foreground">Calories</p>
                    <p className="text-2xl font-bold text-orange-500 font-mono">
                      {Math.round(
                        (sessionTime / 60) * (currentType === "Cycling" ? 500 : currentType === "Running" ? 900 : 300),
                      )}{" "}
                      kcal
                    </p>
                  </div>
                </div>
              )}

              {/* Tracking Control Buttons */}
              <div className="flex gap-3">
                {!tracking ? (
                  <Button
                    onClick={startTracking}
                    className="flex-1 bg-primary hover:bg-primary/90 text-white py-6 text-lg"
                  >
                    Start Activity
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={stopTracking}
                      className="flex-1 bg-destructive hover:bg-destructive/90 text-white py-6 text-lg"
                    >
                      Stop Activity
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Map Placeholder */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Route Map</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-96 bg-muted/30 rounded-lg flex items-center justify-center border-2 border-dashed border-border/50">
                <div className="text-center">
                  <p className="text-3xl mb-2">🗺️</p>
                  <p className="text-muted-foreground">Map visualization of your route</p>
                  <p className="text-sm text-muted-foreground mt-2">Integrate with Google Maps API for live tracking</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Sessions */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {sessions.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No activities tracked yet</p>
                ) : (
                  sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="text-2xl">
                            {session.type === "Running" ? "🏃" : session.type === "Cycling" ? "🚴" : "🚶"}
                          </span>
                          <div>
                            <p className="font-medium text-foreground">{session.type}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(session.startTime).toLocaleDateString()} at{" "}
                              {new Date(session.startTime).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-4 gap-6 text-right">
                        <div>
                          <p className="text-xs text-muted-foreground">Distance</p>
                          <p className="font-semibold text-foreground">{session.distance} km</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Duration</p>
                          <p className="font-semibold text-foreground">{session.duration} min</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Avg Speed</p>
                          <p className="font-semibold text-foreground">{session.avgSpeed} km/h</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Calories</p>
                          <p className="font-semibold text-primary">{session.calories} kcal</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
