"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import NavigationSidebar from "@/components/navigation-sidebar"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState({
    name: "",
    email: "",
    age: "",
    weight: "",
    height: "",
    goal: "Weight Loss",
    activityLevel: "Moderate",
    dailyCalorieGoal: "2500",
    dailyWaterGoal: "2.5",
    notifications: true,
    darkMode: false,
    twoFactorAuth: false,
  })
  const [saved, setSaved] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/login")
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    setSettings((prev) => ({
      ...prev,
      name: parsed.name || "",
      email: parsed.email || "",
    }))
  }, [router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement & HTMLSelectElement
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
    setSaved(false)
  }

  const handleSave = () => {
    localStorage.setItem("user", JSON.stringify({ ...user, name: settings.name }))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-background">
      <NavigationSidebar />
      <main className="flex-1 overflow-auto">
        <DashboardHeader user={user} />

        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Settings</h2>
            <p className="text-muted-foreground">Manage your profile and preferences</p>
          </div>

          {saved && (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-700 dark:text-green-400 font-medium">Settings saved successfully!</p>
            </div>
          )}

          {/* Profile Settings */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Full Name</label>
                  <Input
                    name="name"
                    value={settings.name}
                    onChange={handleInputChange}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <Input
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleInputChange}
                    className="bg-input border-border"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Age</label>
                  <Input
                    name="age"
                    type="number"
                    value={settings.age}
                    onChange={handleInputChange}
                    placeholder="e.g., 28"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Weight (kg)</label>
                  <Input
                    name="weight"
                    type="number"
                    value={settings.weight}
                    onChange={handleInputChange}
                    placeholder="e.g., 75"
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Height (cm)</label>
                  <Input
                    name="height"
                    type="number"
                    value={settings.height}
                    onChange={handleInputChange}
                    placeholder="e.g., 180"
                    className="bg-input border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fitness Goals */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Fitness Goals</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Primary Goal</label>
                  <select
                    name="goal"
                    value={settings.goal}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground"
                  >
                    <option>Weight Loss</option>
                    <option>Muscle Gain</option>
                    <option>Maintenance</option>
                    <option>Endurance</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Activity Level</label>
                  <select
                    name="activityLevel"
                    value={settings.activityLevel}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 rounded-lg bg-input border border-border text-foreground"
                  >
                    <option>Sedentary</option>
                    <option>Light</option>
                    <option>Moderate</option>
                    <option>Very Active</option>
                    <option>Extra Active</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Daily Calorie Goal</label>
                  <Input
                    name="dailyCalorieGoal"
                    type="number"
                    value={settings.dailyCalorieGoal}
                    onChange={handleInputChange}
                    className="bg-input border-border"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">Daily Water Goal (L)</label>
                  <Input
                    name="dailyWaterGoal"
                    type="number"
                    step="0.1"
                    value={settings.dailyWaterGoal}
                    onChange={handleInputChange}
                    className="bg-input border-border"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* App Preferences */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>App Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Push Notifications</p>
                  <p className="text-sm text-muted-foreground">Get reminders for workouts and meals</p>
                </div>
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleInputChange}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Dark Mode</p>
                  <p className="text-sm text-muted-foreground">Use dark theme</p>
                </div>
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleInputChange}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Enhanced security for your account</p>
                </div>
                <input
                  type="checkbox"
                  name="twoFactorAuth"
                  checked={settings.twoFactorAuth}
                  onChange={handleInputChange}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          {/* Privacy & Data */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Privacy & Data</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full border-border justify-start bg-transparent">
                📥 Download My Data
              </Button>
              <Button variant="outline" className="w-full border-border justify-start bg-transparent">
                🔄 Reset Privacy Settings
              </Button>
              <Button
                variant="outline"
                className="w-full border-destructive text-destructive justify-start hover:bg-destructive/10 bg-transparent"
              >
                🗑️ Delete Account
              </Button>
            </CardContent>
          </Card>

          {/* Save Button */}
          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-white py-6">
              Save Changes
            </Button>
            <Button variant="outline" className="flex-1 border-border py-6 bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
