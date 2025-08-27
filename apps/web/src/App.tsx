import { Routes, Route, useLocation } from "react-router-dom";
import AppNav from "@/components/app-shell/AppNav";
import Protected from "@/components/Protected";
import Dashboard from "@/pages/dashboard";
import UsersPage from "@/pages/users";
import ResourcesPage from "@/pages/resources";
import RolesPage from "@/pages/roles";
import AccessRequestsPage from "@/pages/access-requests";
import AuditLogsPage from "@/pages/audit-logs";
import ReportsPage from "@/pages/reports";
import LoginPage from "@/pages/login";

export default function App() {
  const location = useLocation();

  const hideNav = location.pathname === "/login"; // chỉ ẩn khi ở login

  return (
    <div className="px-4">
      {!hideNav && <AppNav />}
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/users"
          element={
            <Protected roles={["Admin", "Manager"]}>
              <UsersPage />
            </Protected>
          }
        />
        <Route
          path="/resources"
          element={
            <Protected roles={["Admin", "Manager"]}>
              <ResourcesPage />
            </Protected>
          }
        />
        <Route
          path="/roles"
          element={
            <Protected roles={["Admin"]}>
              <RolesPage />
            </Protected>
          }
        />
        <Route
          path="/access-requests"
          element={
            <Protected>
              <AccessRequestsPage />
            </Protected>
          }
        />
        <Route
          path="/audit-logs"
          element={
            <Protected roles={["Admin", "Manager"]}>
              <AuditLogsPage />
            </Protected>
          }
        />
        <Route
          path="/reports"
          element={
            <Protected roles={["Admin", "Manager"]}>
              <ReportsPage />
            </Protected>
          }
        />
      </Routes>
    </div>
  );
}
