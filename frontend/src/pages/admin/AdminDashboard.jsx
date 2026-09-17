import { useState, useEffect } from "react";
import { Users, Store, Star } from "lucide-react";
import StatCard from "../../components/StatCard";
import Loading from "../../components/Loading";
import api from "../../services/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/admin/dashboard")
      .then((r) => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">Overview</h2>
        <p className="text-sm text-slate-500 mt-1">
          Platform statistics at a glance
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          color="indigo"
        />
        <StatCard
          title="Total Stores"
          value={stats?.totalStores ?? 0}
          icon={Store}
          color="emerald"
        />
        <StatCard
          title="Total Ratings"
          value={stats?.totalRatings ?? 0}
          icon={Star}
          color="amber"
        />
      </div>
    </div>
  );
}
