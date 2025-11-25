"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"

interface ActivityStats {
  type: string
  count: number
  totalCalories: number
  averageCalories: number
  popularity: number
}

export default function AdminActivitiesPage() {
  const [user, setUser] = useState<any>(null)
  const [activities, setActivities] = useState<ActivityStats[]>([
    { type: "Running", count: 85, totalCalories: 38250, averageCalories: 450, popularity: 95 },
    { type: "Strength Training", count: 62, totalCalories: 23560, averageCalories: 380, popularity: 87 },
    { type: "Cycling", count: 48, totalCalories: 24960, averageCalories: 520, popularity: 75 },
    { type: "Yoga", count: 35, totalCalories: 5250, averageCalories: 150, popularity: 62 },
    { type: "Swimming", count: 28, totalCalories: 11760, averageCalories: 420, popularity: 54 },
  ])
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsed = JSON.parse(userData)
    if (parsed.role !== "admin") {
      router.push("/dashboard")
      return
    }
    setUser(parsed)
  }, [router])

  if (!user) return null

  const totalActivities = activities.reduce((sum, a) => sum + a.count, 0)
  const totalCalories = activities.reduce((sum, a) => sum + a.totalCalories, 0)

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <AdminHeader user={user} />

        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Activity Analytics</h2>
            <p className="text-muted-foreground">Track activity types and user engagement</p>
          </div>

          {/* Summary */}
          <div className="grid md:grid-cols-2 gap-4">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Activities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{totalActivities}</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Calories Burned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{(totalCalories / 1000).toFixed(1)}k kcal</div>
              </CardContent>
            </Card>
          </div>

          {/* Activity Breakdown */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Activity Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.type}>
                    <div className="flex justify-between mb-2">
                      <p className="font-medium text-foreground">{activity.type}</p>
                      <p className="text-sm text-muted-foreground">{activity.count} sessions</p>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mb-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${activity.popularity}%` }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{activity.averageCalories} kcal avg</span>
                      <span>{activity.totalCalories} kcal total</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
