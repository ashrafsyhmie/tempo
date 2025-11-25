"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import DashboardHeader from "@/components/dashboard/dashboard-header"
import NavigationSidebar from "@/components/navigation-sidebar"
import { createClient } from "@/lib/supabase/client"

interface FoodItem {
  id: string
  food_name: string
  calories: number
  protein: number
  carbs: number
  fats: number
  logged_at: string
}

export default function FoodIntakePage() {
  const [user, setUser] = useState<any>(null)
  const [foods, setFoods] = useState<FoodItem[]>([])
  const [newFood, setNewFood] = useState("")
  const [newCalories, setNewCalories] = useState("")
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const loadData = async () => {
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
        setUser(userData)
      }

      // Fetch today's food logs
      const today = new Date().toISOString().split("T")[0]
      const { data: foodLogs } = await supabase
        .from("food_logs")
        .select("*")
        .eq("user_id", authUser.id)
        .gte("logged_at", `${today}T00:00:00`)
        .lte("logged_at", `${today}T23:59:59`)
        .order("logged_at", { ascending: false })

      if (foodLogs) {
        setFoods(foodLogs)
      }
      setLoading(false)
    }

    loadData()
  }, [router, supabase])

  const addFood = async () => {
    if (!newFood || !newCalories) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from("food_logs").insert([
        {
          user_id: user.id,
          food_name: newFood,
          calories: Number.parseInt(newCalories),
          protein: Math.round((Number.parseInt(newCalories) * 0.3) / 4),
          carbs: Math.round((Number.parseInt(newCalories) * 0.45) / 4),
          fats: Math.round((Number.parseInt(newCalories) * 0.25) / 9),
          logged_at: new Date().toISOString(),
        },
      ])

      if (!error) {
        setNewFood("")
        setNewCalories("")
        // Refresh food logs
        const today = new Date().toISOString().split("T")[0]
        const { data: updatedLogs } = await supabase
          .from("food_logs")
          .select("*")
          .eq("user_id", user.id)
          .gte("logged_at", `${today}T00:00:00`)
          .lte("logged_at", `${today}T23:59:59`)
          .order("logged_at", { ascending: false })

        if (updatedLogs) {
          setFoods(updatedLogs)
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  const deleteFood = async (id: string) => {
    const { error } = await supabase.from("food_logs").delete().eq("id", id)

    if (!error) {
      setFoods(foods.filter((f) => f.id !== id))
    }
  }

  if (loading || !user) return null

  const totalCalories = foods.reduce((sum, f) => sum + f.calories, 0)
  const totalProtein = foods.reduce((sum, f) => sum + f.protein, 0)
  const totalCarbs = foods.reduce((sum, f) => sum + f.carbs, 0)
  const totalFat = foods.reduce((sum, f) => sum + f.fats, 0)
  const calorieGoal = user.daily_calorie_target || 2500

  return (
    <div className="flex h-screen bg-background">
      <NavigationSidebar />
      <main className="flex-1 overflow-auto">
        <DashboardHeader user={user} />

        <div className="p-6 space-y-6 max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Food Intake Tracker</h2>
            <p className="text-muted-foreground">Log your meals and track nutritional intake</p>
          </div>

          {/* Macro Summary */}
          <div className="grid md:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-br from-primary/20 to-primary/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total Calories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-primary">{totalCalories}</div>
                <p className="text-xs text-muted-foreground mt-1">Goal: {calorieGoal} kcal</p>
                <div className="mt-2 w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: `${Math.min((totalCalories / calorieGoal) * 100, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-secondary/20 to-secondary/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Protein</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{totalProtein}g</div>
                <p className="text-xs text-muted-foreground mt-1">Goal: 150g</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-accent/20 to-accent/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Carbs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{totalCarbs}g</div>
                <p className="text-xs text-muted-foreground mt-1">Goal: 310g</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-orange-500/20 to-orange-500/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Fat</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-500">{totalFat}g</div>
                <p className="text-xs text-muted-foreground mt-1">Goal: 83g</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-500/20 to-blue-500/5 border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">Remaining</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{Math.max(0, calorieGoal - totalCalories)}</div>
                <p className="text-xs text-muted-foreground mt-1">kcal left today</p>
              </CardContent>
            </Card>
          </div>

          {/* Add Food Form */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Add Food</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-4">
                <Input
                  placeholder="Food name (e.g., Chicken Breast)"
                  value={newFood}
                  onChange={(e) => setNewFood(e.target.value)}
                  disabled={submitting}
                  className="bg-input border-border"
                />
                <Input
                  placeholder="Calories"
                  type="number"
                  value={newCalories}
                  onChange={(e) => setNewCalories(e.target.value)}
                  disabled={submitting}
                  className="bg-input border-border w-24"
                />
                <Button onClick={addFood} className="bg-primary hover:bg-primary/90 text-white" disabled={submitting}>
                  {submitting ? "Adding..." : "Add"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Food Log */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle>Today's Food Log</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {foods.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No foods logged yet</p>
                ) : (
                  foods.map((food) => (
                    <div
                      key={food.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{food.food_name}</p>
                        <div className="flex gap-6 mt-2 text-sm text-muted-foreground">
                          <span>P: {food.protein}g</span>
                          <span>C: {food.carbs}g</span>
                          <span>F: {food.fats}g</span>
                        </div>
                      </div>
                      <div className="text-right mr-4">
                        <p className="font-bold text-foreground text-lg">{food.calories}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(food.logged_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                      <Button
                        onClick={() => deleteFood(food.id)}
                        variant="ghost"
                        className="text-destructive hover:bg-destructive/10"
                        disabled={submitting}
                      >
                        ✕
                      </Button>
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
