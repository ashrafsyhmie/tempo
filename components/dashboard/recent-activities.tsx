"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function RecentActivities() {
  const activities = [
    { name: "Morning Run", type: "Running", duration: "45 min", calories: 450, time: "7:30 AM" },
    { name: "Breakfast", type: "Meal", calories: 650, time: "8:15 AM" },
    { name: "Gym Session", type: "Strength", duration: "60 min", calories: 380, time: "6:00 PM" },
  ]

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <div className="flex-1">
                <p className="font-medium text-foreground">{activity.name}</p>
                <p className="text-sm text-muted-foreground">{activity.type}</p>
              </div>
              <div className="text-right">
                {activity.duration && <p className="text-sm text-foreground">{activity.duration}</p>}
                <p className="text-sm font-medium text-primary">{activity.calories} kcal</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
