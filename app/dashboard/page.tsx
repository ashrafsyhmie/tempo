"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import DashboardStats from "@/components/dashboard/dashboard-stats"
import RecentActivities from "@/components/dashboard/recent-activities"
import NavigationSidebar from "@/components/navigation-sidebar"
import { createClient } from "@/lib/supabase/client"

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user: authUser },
        error,
      } = await supabase.auth.getUser()

      if (error || !authUser) {
        router.push("/login")
        return
      }

      const { data: userData } = await supabase.from("users").select("*").eq("id", authUser.id).single()

      if (userData) {
        setUser({
          ...authUser,
          ...userData,
        })
      }
      setLoading(false)
    }

    getUser()
  }, [router, supabase])

  if (loading || !user) return null

  return (
    <div className="flex h-screen bg-background">
      <NavigationSidebar />

      <main className="flex-1 overflow-auto">
        <DashboardHeader user={user} />

        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          {/* Welcome Section */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Welcome back, {user.full_name}!</h2>
            <p className="text-muted-foreground">Here's your fitness overview for today</p>
          </div>

          {/* Stats Grid */}
          <DashboardStats />

          {/* Quick Actions */}
          <div className="grid md:grid-cols-4 gap-4">
            <Link href="/food-intake">
              <Card className="cursor-pointer hover:border-primary/50 transition-colors border-border/50 h-full">
                <CardHeader>
                  <div className="text-3xl mb-2">🍎</div>
                  <CardTitle className="text-lg">Log Food</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">Track your meals</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/activities">
              <Card className="cursor-pointer hover:border-secondary/50 transition-colors border-border/50 h-full">
                <CardHeader>
                  <div className="text-3xl mb-2">💪</div>
                  <CardTitle className="text-lg">Workouts</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">View exercise library</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/tracking">
              <Card className="cursor-pointer hover:border-accent/50 transition-colors border-border/50 h-full">
                <CardHeader>
                  <div className="text-3xl mb-2">🗺️</div>
                  <CardTitle className="text-lg">Map Track</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">GPS activity tracking</p>
                </CardContent>
              </Card>
            </Link>

            <Link href="/history">
              <Card className="cursor-pointer hover:border-primary/50 transition-colors border-border/50 h-full">
                <CardHeader>
                  <div className="text-3xl mb-2">📋</div>
                  <CardTitle className="text-lg">History</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">View past activities</p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* Recent Activities */}
          <RecentActivities />
        </div>
      </main>
    </div>
  )
}
