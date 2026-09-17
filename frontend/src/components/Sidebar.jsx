import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, X } from "lucide-react";

export default function Sidebar({ items, open = true, onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const roles = {
    ADMIN: "Administrator",
    USER: "Normal User",
    STORE_OWNER: "Store Owner",
  };
  return (
    <>
      <>
        {open && onClose && (
          <button
            aria-label="Close navigation"
            onClick={onClose}
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          />
        )}
      </>
      <aside
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col bg-slate-900 transition-transform lg:static lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-slate-800 p-6">
          <div>
            <p className="text-lg font-bold tracking-tight text-white">
              Store Pulse
            </p>
            <p className="mt-0.5 text-xs text-slate-400">
              {roles[user?.role] || ""}
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white lg:hidden"
              aria-label="Close menu"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-4">
          {items.map(({ label, to, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={["/admin", "/user", "/owner"].includes(to)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? "bg-indigo-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-slate-800 p-4">
          <div className="mb-3 flex items-center gap-3 px-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-sm font-semibold text-white">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">
                {user?.name}
              </p>
              <p className="truncate text-xs text-slate-400">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => {
              logout();
              navigate("/login");
            }}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-slate-800 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
