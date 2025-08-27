import { cn } from "@/lib/utils"
import { Home, Table2, User } from "lucide-react"
import { NavLink } from "react-router-dom"

const items = [
  { to: "/", icon: Home, label: "Dashboard" },
  { to: "/table", icon: Table2, label: "Table" },
  { to: "/profile", icon: User, label: "Profile" },
]

export function Sidebar() {
  return (
    <aside className="hidden md:flex md:w-64 flex-col border-r bg-background">
      <div className="px-4 py-4 text-xl font-bold">My App</div>
      <nav className="flex-1 space-y-1 px-2">
        {items.map((item) => (
          <SidebarItem key={item.to} {...item} />
        ))}
      </nav>
    </aside>
  )
}

function SidebarItem({ to, icon: Icon, label }: { to: string; icon: any; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-2 rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground",
          isActive ? "bg-accent text-accent-foreground" : "text-muted-foreground"
        )
      }
    >
      <Icon className="h-4 w-4" />
      {label}
    </NavLink>
  )
}
