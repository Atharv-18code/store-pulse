export default function StatCard({
  title,
  value,
  icon: Icon,
  color = "indigo",
  change,
}) {
  const colors = {
    indigo: "bg-indigo-50 text-indigo-600",
    emerald: "bg-emerald-50 text-emerald-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
  };
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 flex items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colors[color] || colors.indigo}`}
      >
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">
          {title}
        </p>
        <p className="text-2xl font-700 text-slate-900 mt-0.5">{value}</p>
        {change && <p className="text-xs text-slate-400 mt-0.5">{change}</p>}
      </div>
    </div>
  );
}
