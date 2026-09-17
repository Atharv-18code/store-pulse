import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../components/Toast";
import { ArrowLeft } from "lucide-react";
import api from "../../services/api";

export default function AddStore() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (form.name.length < 20) e.name = "Name must be at least 20 characters";
    if (form.name.length > 60) e.name = "Name must be at most 60 characters";
    if (form.address.length > 400)
      e.address = "Address must be at most 400 characters";
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
      await api.post("/admin/stores", form);
      toast("success", "Store created successfully");
      navigate("/admin/stores");
    } catch (err) {
      toast("error", err.response?.data?.message || "Failed to create store");
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
      <h2 className="text-xl font-semibold text-slate-900 mb-1">Add Store</h2>
      <p className="text-sm text-slate-500 mb-6">
        Register a new store on the platform
      </p>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { key: "name", label: "Store Name", type: "text", required: true },
            { key: "email", label: "Email", type: "email", required: true },
            { key: "address", label: "Address", type: "text", required: false },
            {
              key: "ownerId",
              label: "Owner ID (optional)",
              type: "text",
              required: false,
            },
          ].map(({ key, label, type, required }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {label}
              </label>
              <input
                type={type}
                required={required}
                value={form[key]}
                onChange={(e) => set(key, e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors[key] ? "border-rose-400" : "border-slate-200 focus:border-indigo-400"}`}
              />
              {errors[key] && (
                <p className="text-xs text-rose-500 mt-1">{errors[key]}</p>
              )}
            </div>
          ))}
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
              {loading ? "Creating..." : "Create Store"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
