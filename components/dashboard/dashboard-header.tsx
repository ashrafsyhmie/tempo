"use client"

interface User {
  name: string
  email: string
}

export default function DashboardHeader({ user }: { user: User }) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-foreground">FitFlow Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm font-medium text-foreground">{user.name}</p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
            {user.name.charAt(0)}
          </div>
        </div>
      </div>
    </header>
  )
}
