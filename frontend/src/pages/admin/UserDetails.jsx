import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, MapPin, Shield, Star } from "lucide-react";
import Loading from "../../components/Loading";
import RatingStars from "../../components/RatingStars";
import api from "../../services/api";

export default function UserDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get(`/admin/users/${id}`)
      .then((r) => setUser(r.data))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Loading />;
  if (!user) return <div className="p-6 text-slate-500">User not found.</div>;

  const roleBadge = {
    ADMIN: "bg-indigo-50 text-indigo-700",
    USER: "bg-emerald-50 text-emerald-700",
    STORE_OWNER: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="p-6 max-w-lg">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center text-white text-xl font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              {user.name}
            </h2>
            <span
              className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge[user.role]}`}
            >
              {user.role}
            </span>
          </div>
        </div>

        <div className="space-y-3 pt-2">
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Mail className="w-4 h-4 text-slate-400" />
            {user.email}
          </div>
          {user.address && (
            <div className="flex items-start gap-3 text-sm text-slate-600">
              <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
              {user.address}
            </div>
          )}
          <div className="flex items-center gap-3 text-sm text-slate-600">
            <Shield className="w-4 h-4 text-slate-400" />
            Joined {new Date(user.createdAt).toLocaleDateString()}
          </div>
        </div>

        {user.store && (
          <div className="border-t border-slate-100 pt-4">
            <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">
              Store
            </p>
            <p className="font-medium text-slate-900 mb-2">{user.store.name}</p>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <RatingStars
                value={Math.round(user.store.avgRating)}
                readonly
                size={14}
              />
              <span className="text-sm text-slate-500">
                {user.store.avgRating.toFixed(2)} ({user.store.totalRatings}{" "}
                ratings)
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
