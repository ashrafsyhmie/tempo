"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
              FF
            </div>
            <span className="font-bold text-xl text-foreground">FitFlow</span>
          </div>
          <div className="flex gap-4">
            <Link href="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/register">
              <Button className="bg-primary hover:bg-primary/90 text-white">Get Started</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-4 text-balance text-foreground">Transform Your Fitness Journey</h1>
          <p className="text-xl text-muted-foreground mb-8 text-balance max-w-2xl mx-auto">
            Track workouts, monitor nutrition, and achieve your goals with our comprehensive fitness platform
          </p>
          <Link href="/register">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
              Start Free Today
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="border-border/50 hover:border-primary/30 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <CardTitle>Smart Dashboard</CardTitle>
              <CardDescription>Real-time overview of your fitness metrics</CardDescription>
            </CardHeader>
            <CardContent>Monitor calories, workouts, and progress all in one beautiful dashboard.</CardContent>
          </Card>

          <Card className="border-border/50 hover:border-secondary/30 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🗺️</span>
              </div>
              <CardTitle>GPS Tracking</CardTitle>
              <CardDescription>Track runs and outdoor activities with maps</CardDescription>
            </CardHeader>
            <CardContent>Record your routes, distance, and pace with integrated GPS tracking.</CardContent>
          </Card>

          <Card className="border-border/50 hover:border-accent/30 transition-colors">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🍎</span>
              </div>
              <CardTitle>Nutrition Tracking</CardTitle>
              <CardDescription>Log meals and monitor nutritional intake</CardDescription>
            </CardHeader>
            <CardContent>Keep track of calories, macros, and nutrients throughout the day.</CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
