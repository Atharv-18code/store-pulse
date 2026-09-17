import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Store, Star } from "lucide-react";

export default function UserDashboard() {
  const { user } = useAuth();
  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          Welcome back, {user?.name?.split(" ")[0]}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          Rate stores and share your experience
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/user/stores"
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition group"
        >
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-100 transition">
            <Store className="w-6 h-6 text-indigo-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">Browse Stores</h3>
          <p className="text-sm text-slate-500">
            Discover and rate stores near you
          </p>
        </Link>
        <Link
          to="/user/stores"
          className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md transition group"
        >
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mb-4 group-hover:bg-amber-100 transition">
            <Star className="w-6 h-6 text-amber-600" />
          </div>
          <h3 className="font-semibold text-slate-900 mb-1">My Ratings</h3>
          <p className="text-sm text-slate-500">
            View and update your submitted ratings
          </p>
        </Link>
      </div>
    </div>
  );
}
