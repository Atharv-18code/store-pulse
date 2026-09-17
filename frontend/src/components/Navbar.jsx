import { Menu, Bell } from "lucide-react";

export default function Navbar({ title, onMenuClick }) {
  return (
    <header className="sticky top-0 z-10 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden text-slate-500 hover:text-slate-700"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
      </div>
      <button className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 transition">
        <Bell className="w-4 h-4" />
      </button>
    </header>
  );
}
