import { Link, NavLink } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { logoutApi } from "@/services/auth.service";


export default function AppNav() {
    const { user, roles } = useAuth();
    return (
        <div className="flex items-center justify-between py-3 border-b mb-4">
            <div className="flex items-center gap-4">
                <Link to="/" className="font-bold">AccessMgmt</Link>
                <nav className="flex gap-3 text-sm">
                    <NavLink to="/" end>Dashboard</NavLink>
                    <NavLink to="/users">Users</NavLink>
                    <NavLink to="/resources">Resources</NavLink>
                    <NavLink to="/roles">Roles</NavLink>
                    <NavLink to="/access-requests">Access Requests</NavLink>
                    <NavLink to="/audit-logs">Audit Logs</NavLink>
                    <NavLink to="/reports">Reports</NavLink>
                </nav>
            </div>
            <div className="flex items-center gap-3">
                <span className="text-sm opacity-70">{user?.email} · {roles?.join(", ")}</span>
                <button className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300" onClick={() => logoutApi()}>Logout</button>
            </div>
        </div>
    );
}