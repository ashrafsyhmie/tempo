"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default function AdminReportsPage() {
  const [user, setUser] = useState<any>(null)
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

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <AdminHeader user={user} />

        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Reports</h2>
            <p className="text-muted-foreground">View detailed analytics and generate reports</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>User Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-primary mb-2">+25%</div>
                <p className="text-sm text-muted-foreground">compared to last month</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-secondary/30 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Engagement Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-secondary mb-2">78%</div>
                <p className="text-sm text-muted-foreground">active users this week</p>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-accent/30 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Monthly Report</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">Generate comprehensive monthly fitness analytics</p>
                <button className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg text-sm">
                  Generate
                </button>
              </CardContent>
            </Card>

            <Card className="border-border/50 hover:border-primary/30 transition-colors cursor-pointer">
              <CardHeader>
                <CardTitle>Export Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-3">Export user and activity data in CSV format</p>
                <button className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-white rounded-lg text-sm">
                  Export
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}
