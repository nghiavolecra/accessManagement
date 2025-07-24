// frontend/pages/dashboard.jsx
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,     // ← add this
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  Users,
  Lock,
  Activity,
  Key,
  Globe,
  Settings,
  LogOut,
} from "lucide-react";
import { Link } from 'react-router-dom'

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r">
        <div className="px-6 py-8">
          <h2 className="text-xl font-bold mb-8">SecureIAM</h2>
          <nav className="space-y-2">
            {[
              { icon: BarChart3, label: "Overview", href: "/dashboard" },
              { icon: Users,      label: "Users",    href: "/dashboard/users" },
              { icon: Lock,       label: "Roles",    href: "/dashboard/roles" },
              { icon: Activity,   label: "Audit",    href: "/dashboard/audit" },
              { icon: Globe,      label: "Integrations", href: "/dashboard/integrations" },
              { icon: Settings,   label: "Settings", href: "/dashboard/settings" },
            ].map(({ icon: Icon, label, href }) => (
              <Link key={label} href={href}>
                <a className="flex items-center space-x-3 px-3 py-2 rounded-lg text-slate-700 hover:bg-slate-100">
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{label}</span>
                </a>
              </Link>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        {/* Top Bar */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard Overview</h1>
          <Button variant="outline" asChild>
            <Link href="/">
              <a className="flex items-center space-x-2">
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </a>
            </Link>
          </Button>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2,847</div>
              <Badge variant="secondary">+12% this month</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm">Active Sessions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,234</div>
              <Badge variant="secondary">+5% today</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm">Failed Logins</CardTitle>
              <Key className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <Badge className="bg-red-100 text-red-800">3 in last hour</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex items-center justify-between pb-2">
              <CardTitle className="text-sm">Integrations</CardTitle>
              <Globe className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">6</div>
              <Badge variant="secondary">Connected</Badge>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4 mb-12">
          <Button asChild>
            <Link href="/dashboard/users/new">
              <a className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Add User</span>
              </a>
            </Link>
          </Button>
          <Button asChild>
            <Link href="/dashboard/roles/new">
              <a className="flex items-center space-x-2">
                <Lock className="h-5 w-5" />
                <span>Create Role</span>
              </a>
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/policies">
              <a className="flex items-center space-x-2">
                <Key className="h-5 w-5" />
                <span>View Policies</span>
              </a>
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/audit">
              <a className="flex items-center space-x-2">
                <Activity className="h-5 w-5" />
                <span>Audit Logs</span>
              </a>
            </Link>
          </Button>
        </div>

        {/* Card Grid Example (e.g. Policies Preview) */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[{ title: "Admin Full Access", desc: "All resources" },
            { title: "Manager Dept Access", desc: "Own dept only" },
            { title: "Employee Basic", desc: "Common resources" }
          ].map((p) => (
            <Card key={p.title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle>{p.title}</CardTitle>
                <CardDescription>{p.desc}</CardDescription>
              </CardHeader>
              <CardContent>
                <Button size="sm">Edit</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
