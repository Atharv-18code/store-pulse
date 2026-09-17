import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronUp, ChevronDown, Eye, UserPlus } from "lucide-react";
import SearchBar from "../../components/SearchBar";
import Pagination from "../../components/Pagination";
import Loading from "../../components/Loading";
import EmptyState from "../../components/EmptyState";
import api from "../../services/api";

const ROLES = ["", "ADMIN", "USER", "STORE_OWNER"];

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [sort, setSort] = useState("name");
  const [order, setOrder] = useState("asc");
  const [page, setPage] = useState(1);
  const navigate = useNavigate();
  const limit = 10;

  const load = useCallback(() => {
    setLoading(true);
    api
      .get("/admin/users", {
        params: { search, role, sort, order, page, limit },
      })
      .then((r) => {
        setUsers(r.data.users);
        setTotal(r.data.total);
      })
      .finally(() => setLoading(false));
  }, [search, role, sort, order, page]);

  useEffect(() => {
    load();
  }, [load]);
  useEffect(() => {
    setPage(1);
  }, [search, role, sort, order]);

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

  const roleBadge = {
    ADMIN: "bg-indigo-50 text-indigo-700",
    USER: "bg-emerald-50 text-emerald-700",
    STORE_OWNER: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900">Users</h2>
          <p className="text-sm text-slate-500 mt-0.5">{total} total users</p>
        </div>
        <button
          onClick={() => navigate("/admin/add-user")}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition"
        >
          <UserPlus className="w-4 h-4" /> Add User
        </button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search by name, email or address..."
          />
        </div>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
        >
          {ROLES.map((r) => (
            <option key={r} value={r}>
              {r || "All Roles"}
            </option>
          ))}
        </select>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {["name", "email", "address", "role"].map((f) => (
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
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-8">
                    <Loading />
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5}>
                    <EmptyState title="No users found" />
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr
                    key={u.id}
                    className="border-b border-slate-50 hover:bg-slate-50 transition"
                  >
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {u.name}
                    </td>
                    <td className="px-4 py-3 text-slate-500">{u.email}</td>
                    <td className="px-4 py-3 text-slate-500 max-w-xs truncate">
                      {u.address || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleBadge[u.role] || ""}`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => navigate(`/admin/users/${u.id}`)}
                        className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 text-xs font-medium"
                      >
                        <Eye className="w-3.5 h-3.5" /> View
                      </button>
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
