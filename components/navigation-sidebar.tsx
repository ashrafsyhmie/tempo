"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NavigationSidebar() {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/food-intake", label: "Food Intake", icon: "🍎" },
    { href: "/activities", label: "Activities", icon: "💪" },
    { href: "/tracking", label: "Map Tracking", icon: "🗺️" },
    { href: "/history", label: "History", icon: "📋" },
    { href: "/settings", label: "Settings", icon: "⚙️" },
  ]

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <aside className="w-64 border-r border-border bg-sidebar p-6 flex flex-col">
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">FF</div>
        <span className="font-bold text-lg text-sidebar-foreground">FitFlow</span>
      </div>

      <nav className="space-y-2 flex-1">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href}>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 mb-1",
                pathname === item.href
                  ? "bg-sidebar-primary/20 text-sidebar-primary font-medium"
                  : "text-sidebar-foreground hover:bg-sidebar-accent/10",
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Button>
          </Link>
        ))}
      </nav>

      <Button onClick={handleLogout} className="w-full bg-destructive/10 text-destructive hover:bg-destructive/20">
        Logout
      </Button>
    </aside>
  )
}
