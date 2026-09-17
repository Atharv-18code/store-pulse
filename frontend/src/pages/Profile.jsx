import { useAuth } from "../context/AuthContext";
import { Mail, MapPin, Shield } from "lucide-react";

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="max-w-xl p-6">
      <h2 className="text-xl font-semibold text-slate-900">Profile</h2>
      <p className="mt-1 text-sm text-slate-500">Your account details.</p>
      <div className="mt-6 space-y-4 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-bold text-white">
          {user?.name?.charAt(0)?.toUpperCase()}
        </div>
        <div>
          <p className="text-lg font-semibold text-slate-900">{user?.name}</p>
          <p className="text-sm text-slate-500">
            {user?.role?.replace("_", " ")}
          </p>
        </div>
        <div className="space-y-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
          <p className="flex items-center gap-3">
            <Mail className="h-4 w-4 text-slate-400" />
            {user?.email}
          </p>
          <p className="flex items-start gap-3">
            <MapPin className="mt-0.5 h-4 w-4 text-slate-400" />
            {user?.address || "No address provided"}
          </p>
          <p className="flex items-center gap-3">
            <Shield className="h-4 w-4 text-slate-400" />
            Role: {user?.role}
          </p>
        </div>
      </div>
    </div>
  );
}
