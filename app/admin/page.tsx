"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"

interface User {
  id: string
  name: string
  email: string
  joinDate: string
  totalWorkouts: number
  totalCalories: number
  status: "Active" | "Inactive"
}

export default function AdminPage() {
  const [user, setUser] = useState<any>(null)
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      joinDate: "2025-11-01",
      totalWorkouts: 24,
      totalCalories: 12500,
      status: "Active",
    },
    {
      id: "2",
      name: "Jane Smith",
      email: "jane@example.com",
      joinDate: "2025-10-15",
      totalWorkouts: 18,
      totalCalories: 9800,
      status: "Active",
    },
    {
      id: "3",
      name: "Mike Johnson",
      email: "mike@example.com",
      joinDate: "2025-09-20",
      totalWorkouts: 32,
      totalCalories: 16200,
      status: "Active",
    },
    {
      id: "4",
      name: "Sarah Williams",
      email: "sarah@example.com",
      joinDate: "2025-11-10",
      totalWorkouts: 5,
      totalCalories: 2400,
      status: "Inactive",
    },
    {
      id: "5",
      name: "Tom Brown",
      email: "tom@example.com",
      joinDate: "2025-08-05",
      totalWorkouts: 45,
      totalCalories: 22500,
      status: "Active",
    },
  ])
  const [searchTerm, setSearchTerm] = useState("")
  const [filteredUsers, setFilteredUsers] = useState<User[]>(users)
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

  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

  const handleRemoveUser = (id: string) => {
    setUsers(users.filter((u) => u.id !== id))
  }

  const handleToggleStatus = (id: string) => {
    setUsers(users.map((u) => (u.id === id ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" } : u)))
  }

  if (!user) return null

  const totalUsers = users.length
  const activeUsers = users.filter((u) => u.status === "Active").length
  const totalWorkouts = users.reduce((sum, u) => sum + u.totalWorkouts, 0)
  const totalCalories = users.reduce((sum, u) => sum + u.totalCalories, 0)

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <AdminHeader user={user} />

        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Admin Dashboard</h2>
            <p className="text-muted-foreground">Track all users and their fitness activities</p>
          </div>

          {/* Summary Stats */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{totalUsers}</div>
                <p className="text-xs text-muted-foreground mt-1">{activeUsers} active</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Workouts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-secondary">{totalWorkouts}</div>
                <p className="text-xs text-muted-foreground mt-1">all time</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Calories Burned</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-accent">{(totalCalories / 1000).toFixed(1)}k</div>
                <p className="text-xs text-muted-foreground mt-1">kcal</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Avg per User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-orange-500">{(totalWorkouts / totalUsers).toFixed(1)}</div>
                <p className="text-xs text-muted-foreground mt-1">workouts</p>
              </CardContent>
            </Card>
          </div>

          {/* User Search & Filter */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Search Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-input border-border"
              />
            </CardContent>
          </Card>

          {/* Users Table */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>User Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border/30">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">User</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Email</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Joined</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Workouts</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Calories</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="text-center py-8 text-muted-foreground">
                          No users found
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-border/30 hover:bg-muted/20 transition-colors">
                          <td className="py-4 px-4 font-medium text-foreground">{user.name}</td>
                          <td className="py-4 px-4 text-muted-foreground text-sm">{user.email}</td>
                          <td className="py-4 px-4 text-muted-foreground text-sm">
                            {new Date(user.joinDate).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-foreground font-medium">{user.totalWorkouts}</td>
                          <td className="py-4 px-4 text-primary font-medium">{user.totalCalories} kcal</td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.status === "Active"
                                  ? "bg-green-500/20 text-green-700 dark:text-green-400"
                                  : "bg-red-500/20 text-red-700 dark:text-red-400"
                              }`}
                            >
                              {user.status}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleToggleStatus(user.id)}
                                className="border-border"
                              >
                                {user.status === "Active" ? "Disable" : "Enable"}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleRemoveUser(user.id)}
                                className="text-destructive hover:bg-destructive/10"
                              >
                                Remove
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Activity Overview */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Top Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[...users]
                  .sort((a, b) => b.totalWorkouts - a.totalWorkouts)
                  .slice(0, 5)
                  .map((topUser, idx) => (
                    <div
                      key={topUser.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                          {idx + 1}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{topUser.name}</p>
                          <p className="text-xs text-muted-foreground">{topUser.email}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">{topUser.totalWorkouts} workouts</p>
                        <p className="text-sm text-primary">{topUser.totalCalories} kcal</p>
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
