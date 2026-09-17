import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Store, Key, LayoutDashboard } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const navItems = [
  { label: "Dashboard", to: "/user", icon: LayoutDashboard },
  { label: "Stores", to: "/user/stores", icon: Store },
  { label: "Update Password", to: "/user/password", icon: Key },
];

export default function UserLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen bg-slate-50 flex">
      <Sidebar
        items={navItems}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0">
        <Navbar
          title="User Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
