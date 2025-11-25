"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"

interface UserDetail {
  id: string
  name: string
  email: string
  joinDate: string
  totalWorkouts: number
  totalCalories: number
  averageCaloriesPerDay: number
  favoriteActivity: string
  lastActive: string
  status: "Active" | "Inactive"
}

export default function AdminUsersPage() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<UserDetail[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      joinDate: "2025-11-01",
      totalWorkouts: 24,
      totalCalories: 12500,
      averageCaloriesPerDay: 416,
      favoriteActivity: "Running",
      lastActive: "2025-11-24",
      status: "Active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      joinDate: "2025-10-15",
      totalWorkouts: 18,
      totalCalories: 9800,
      averageCaloriesPerDay: 392,
      favoriteActivity: "Cycling",
      lastActive: "2025-11-23",
      status: "Active",
    },
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

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <AdminHeader user={user} />

        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">User Details</h2>
            <p className="text-muted-foreground">Detailed information about all users</p>
          </div>

          <div className="space-y-4">
            {users.map((userDetail) => (
              <Card key={userDetail.id} className="border-border/50">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-lg font-semibold text-foreground mb-4">{userDetail.name}</p>
                      <div className="space-y-2">
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="text-foreground">{userDetail.email}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Joined</p>
                          <p className="text-foreground">{new Date(userDetail.joinDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Status</p>
                          <span
                            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-medium ${
                              userDetail.status === "Active"
                                ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                : "bg-red-500/20 text-red-700 dark:text-red-400"
                            }`}
                          >
                            {userDetail.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Total Workouts</p>
                          <p className="text-2xl font-bold text-foreground">{userDetail.totalWorkouts}</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Total Calories</p>
                          <p className="text-2xl font-bold text-primary">{userDetail.totalCalories}</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Avg Cal/Day</p>
                          <p className="text-2xl font-bold text-secondary">{userDetail.averageCaloriesPerDay}</p>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Last Active</p>
                          <p className="text-lg font-bold text-accent">
                            {new Date(userDetail.lastActive).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
