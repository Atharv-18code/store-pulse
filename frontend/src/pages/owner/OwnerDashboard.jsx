import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, Star, Users } from "lucide-react";
import StatCard from "../../components/StatCard";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import RatingStars from "../../components/RatingStars";
import api from "../../services/api";

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("createdAt");
  const [order, setOrder] = useState("desc");

  useEffect(() => {
    api
      .get("/owner/dashboard")
      .then((r) => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  const toggleSort = (field) => {
    if (sort === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSort(field);
      setOrder("asc");
    }
  };

  const sortedRatings = data
    ? [...data.ratings].sort((first, second) => {
        let result;
        if (sort === "rating") {
          result = first.rating - second.rating;
        } else if (sort === "createdAt") {
          result = new Date(first.createdAt) - new Date(second.createdAt);
        } else {
          const firstValue = first.user?.[sort] ?? "";
          const secondValue = second.user?.[sort] ?? "";
          result = String(firstValue).localeCompare(String(secondValue));
        }
        return order === "desc" ? -result : result;
      })
    : [];

  const SortIcon = ({ field }) =>
    sort === field ? (
      order === "asc" ? (
        <ChevronUp className="w-3.5 h-3.5" />
      ) : (
        <ChevronDown className="w-3.5 h-3.5" />
      )
    ) : (
      <ChevronUp className="w-3.5 h-3.5 opacity-20" />
    );

  if (loading) return <Loading />;
  if (!data)
    return (
      <div className="p-6 text-slate-500">
        No store assigned to your account.
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-slate-900">
          {data.store.name}
        </h2>
        {data.store.address && (
          <p className="text-sm text-slate-500 mt-0.5">{data.store.address}</p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <StatCard
          title="Average Rating"
          value={data.avgRating ? data.avgRating.toFixed(2) : "N/A"}
          icon={Star}
          color="amber"
        />
        <StatCard
          title="Total Ratings"
          value={data.totalRatings}
          icon={Users}
          color="indigo"
        />
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-3">
          Rating Distribution
        </h3>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4">
          {data.avgRating > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl font-700 text-slate-900">
                {data.avgRating.toFixed(1)}
              </span>
              <div>
                <RatingStars
                  value={Math.round(data.avgRating)}
                  readonly
                  size={18}
                />
                <p className="text-xs text-slate-400 mt-1">
                  {data.totalRatings} ratings
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <div>
        <h3 className="text-base font-semibold text-slate-900 mb-3">
          Customer Ratings
        </h3>
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          {data.ratings.length === 0 ? (
            <EmptyState
              title="No ratings yet"
              description="Ratings from users will appear here."
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    {["name", "email", "rating", "createdAt"].map(
                      (field) => (
                        <th
                          key={field}
                          onClick={() => toggleSort(field)}
                          className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
                        >
                          <span className="flex items-center gap-1">
                            {field === "createdAt"
                              ? "Date"
                              : field.charAt(0).toUpperCase() + field.slice(1)}
                            <SortIcon field={field} />
                          </span>
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody>
                  {sortedRatings.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-slate-50 hover:bg-slate-50 transition"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {r.user.name}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {r.user.email}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <RatingStars value={r.rating} readonly size={14} />
                          <span className="text-xs text-slate-500">
                            {r.rating}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-400 text-xs">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
