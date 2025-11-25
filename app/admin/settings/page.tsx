"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import AdminHeader from "@/components/admin/admin-header"
import AdminSidebar from "@/components/admin/admin-sidebar"

export default function AdminSettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [settings, setSettings] = useState({
    appName: "FitFlow",
    maintenanceMode: false,
    maxUsers: "10000",
    apiRateLimit: "1000",
    emailNotifications: true,
    dataBackup: true,
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
    if (parsed.role !== "admin") {
      router.push("/dashboard")
      return
    }
    setUser(parsed)
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target
    setSettings((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }))
    setSaved(false)
  }

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  if (!user) return null

  return (
    <div className="flex h-screen bg-background">
      <AdminSidebar />
      <main className="flex-1 overflow-auto">
        <AdminHeader user={user} />

        <div className="p-6 space-y-6 max-w-2xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Admin Settings</h2>
            <p className="text-muted-foreground">Configure application settings</p>
          </div>

          {saved && (
            <div className="p-4 bg-green-500/20 border border-green-500/50 rounded-lg">
              <p className="text-green-700 dark:text-green-400 font-medium">Settings saved successfully!</p>
            </div>
          )}

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Application Name</label>
                <Input
                  name="appName"
                  value={settings.appName}
                  onChange={handleChange}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Max Users</label>
                <Input
                  name="maxUsers"
                  type="number"
                  value={settings.maxUsers}
                  onChange={handleChange}
                  className="bg-input border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">API Rate Limit (requests/hour)</label>
                <Input
                  name="apiRateLimit"
                  type="number"
                  value={settings.apiRateLimit}
                  onChange={handleChange}
                  className="bg-input border-border"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>System Options</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Maintenance Mode</p>
                  <p className="text-sm text-muted-foreground">Temporarily disable user access</p>
                </div>
                <input
                  type="checkbox"
                  name="maintenanceMode"
                  checked={settings.maintenanceMode}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Email Notifications</p>
                  <p className="text-sm text-muted-foreground">Send notifications to admins</p>
                </div>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/30 transition-colors">
                <div>
                  <p className="font-medium text-foreground">Automatic Data Backup</p>
                  <p className="text-sm text-muted-foreground">Daily backups at 2:00 AM UTC</p>
                </div>
                <input
                  type="checkbox"
                  name="dataBackup"
                  checked={settings.dataBackup}
                  onChange={handleChange}
                  className="w-5 h-5 cursor-pointer"
                />
              </div>
            </CardContent>
          </Card>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="flex-1 bg-primary hover:bg-primary/90 text-white py-6">
              Save Settings
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
