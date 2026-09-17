import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown, PlusCircle } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import RatingStars from "../../components/RatingStars";
import api from "../../services/api";

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const limit = 10;

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/admin/stores", { params: { search, sort, order, page, limit } })
      .then((r) => {
        setStores(r.data.stores);
        setTotal(r.data.total);
      })
      .finally(() => setLoading(false));
  }, [search, sort, order, page]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setPage(1);
  }, [search, sort, order]);

  const toggleSort = (field) => {
    if (sort === field) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSort(field);
      setOrder("asc");
    }
  };

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

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Stores</h2>
          <p className="text-sm text-slate-500 mt-0.5">{total} total stores</p>
        </div>
        <button
          onClick={() => navigate("/admin/add-store")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
        >
          <PlusCircle className="w-4 h-4" /> Add Store
        </button>
      </div>

      <SearchBar
        value={search}
        onChange={setSearch}
        placeholder="Search by name, email or address..."
      />

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["name", "email", "address"].map((f) => (
                  <th
                    key={f}
                    onClick={() => toggleSort(f)}
                    className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
                  >
                    <span className="flex items-center gap-1 capitalize">
                      {f} <SortIcon field={f} />
                    </span>
                  </th>
                ))}
                <th
                  onClick={() => toggleSort("rating")}
                  className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider cursor-pointer hover:text-slate-700 select-none"
                >
                  <span className="flex items-center gap-1">
                    Rating <SortIcon field="rating" />
                  </span>
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-8">
                    <Loading />
                  </td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan={4}>
                    <EmptyState title="No stores found" />
                  </td>
                </tr>
              ) : (
                stores.map((s) => (
                  <tr
                    key={s.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {s.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{s.email}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                      {s.address || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <RatingStars
                          value={Math.round(s.avgRating || 0)}
                          readonly
                          size={14}
                        />
                        <span className="text-xs text-slate-500">
                          {s.avgRating ? s.avgRating.toFixed(2) : "N/A"}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        <div className="px-4 pb-4 flex justify-end">
          <Pagination
            page={page}
            totalPages={Math.ceil(total / limit)}
            onPage={setPage}
          />
        </div>
      </div>
    </div>
  );
}
