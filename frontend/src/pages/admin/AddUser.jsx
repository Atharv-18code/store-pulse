import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import api from "../../services/api";

const passwordRules =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

export default function AddUser() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
    role: "USER",
    storeId: "",
  });
  const [stores, setStores] = useState([]);
  const [storesLoading, setStoresLoading] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (form.role !== "STORE_OWNER" && form.storeId) set("storeId", "");
    if (form.role !== "STORE_OWNER") return;
    setStoresLoading(true);
    api
      .get("/admin/stores", { params: { limit: 100 } })
      .then((response) =>
        setStores(response.data.stores.filter((store) => !store.ownerId)),
      )
      .catch((err) =>
        toast("error", err.response?.data?.message || "Failed to load stores"),
      )
      .finally(() => setStoresLoading(false));
  }, [form.role]);

  const validate = () => {
    const e = {};
    if (form.name.length < 20) e.name = "Name must be at least 20 characters";
    if (form.name.length > 60) e.name = "Name must be at most 60 characters";
    if (!passwordRules.test(form.password))
      e.password = "Password: 8-16 chars, one uppercase, one special character";
    if (form.address.length > 400)
      e.address = "Address must be at most 400 characters";
    if (form.role === "STORE_OWNER" && !form.storeId)
      e.storeId = "Select a store for this owner";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await api.post("/admin/users", form);
      toast("success", "User created successfully");
      navigate("/admin/users");
    } catch (err) {
      toast("error", err.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  return (
    <div className="p-6 max-w-lg">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 mb-6"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </button>
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Add User</h2>
      <p className="text-sm text-slate-500 mb-6">Create a new user account</p>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {["name", "email", "address"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5 capitalize">
                {field}
              </label>
              <input
                type={field === "email" ? "email" : "text"}
                required={field !== "address"}
                value={form[field]}
                onChange={(e) => set(field, e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors[field] ? "border-rose-400" : "border-slate-200 focus:border-indigo-400"}`}
              />
              {errors[field] && (
                <p className="text-xs text-rose-500 mt-1">{errors[field]}</p>
              )}
            </div>
          ))}
          {form.role === "STORE_OWNER" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Store
              </label>
              <select
                required
                value={form.storeId}
                onChange={(e) => set("storeId", e.target.value)}
                disabled={storesLoading}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white ${errors.storeId ? "border-rose-400" : "border-slate-200"}`}
              >
                <option value="">
                  {storesLoading
                    ? "Loading stores..."
                    : stores.length
                      ? "Select a store"
                      : "No unassigned stores available"}
                </option>
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
              {errors.storeId && (
                <p className="text-xs text-rose-500 mt-1">{errors.storeId}</p>
              )}
              {!storesLoading && !stores.length && (
                <p className="text-xs text-slate-500 mt-1">
                  Create a store first, or assign an unassigned store.
                </p>
              )}
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Role
            </label>
            <select
              value={form.role}
              onChange={(e) => set("role", e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white"
            >
              <option value="USER">Normal User</option>
              <option value="ADMIN">Administrator</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={show ? "text" : "password"}
                required
                value={form.password}
                onChange={(e) => set("password", e.target.value)}
                className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors.password ? "border-rose-400" : "border-slate-200 focus:border-indigo-400"}`}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                {show ? (
                  <EyeOff className="w-4 h-4" />
                ) : (
                  <Eye className="w-4 h-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-xs text-rose-500 mt-1">{errors.password}</p>
            )}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-2 border border-slate-200 text-sm font-medium text-slate-600 rounded-lg hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
            >
              {loading ? "Creating..." : "Create User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
