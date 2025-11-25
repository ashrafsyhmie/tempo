"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function DashboardStats() {
  const stats = [
    {
      title: "Today's Calories",
      value: "1,245",
      subtitle: "of 2,500 kcal",
      icon: "🔥",
      color: "from-primary/20 to-primary/5",
    },
    { title: "Workouts", value: "2", subtitle: "this week", icon: "💪", color: "from-secondary/20 to-secondary/5" },
    { title: "Steps", value: "8,234", subtitle: "goal: 10,000", icon: "👟", color: "from-accent/20 to-accent/5" },
    {
      title: "Water Intake",
      value: "1.8L",
      subtitle: "goal: 2.5L",
      icon: "💧",
      color: "from-blue-500/20 to-blue-500/5",
    },
  ]

  return (
    <div className="grid md:grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx} className={`bg-gradient-to-br ${stat.color} border-border/50`}>
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <span className="text-2xl">{stat.icon}</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
