import { useState } from "react";
import { Outlet } from "react-router-dom";
import { LayoutDashboard, Key } from "lucide-react";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/Navbar";

const navItems = [
  { label: "Dashboard", to: "/owner", icon: LayoutDashboard },
  { label: "Update Password", to: "/owner/password", icon: Key },
];

export default function OwnerLayout() {
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
          title="Store Owner Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
