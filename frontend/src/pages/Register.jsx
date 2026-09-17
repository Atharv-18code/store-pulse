import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import { useToast } from "../components/Toast";
import { Eye, EyeOff, Store } from "lucide-react";

const passwordRules =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    address: "",
  });
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const navigate = useNavigate();

  const validate = () => {
    const e = {};
    if (form.name.length < 20) e.name = "Name must be at least 20 characters";
    if (form.name.length > 60) e.name = "Name must be at most 60 characters";
    if (!form.email.includes("@")) e.email = "Invalid email address";
    if (!passwordRules.test(form.password))
      e.password = "Password: 8-16 chars, one uppercase, one special character";
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
      await register(form);
      toast("success", "Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast("error", err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const set = (k, v) => {
    setForm((p) => ({ ...p, [k]: v }));
    setErrors((p) => ({ ...p, [k]: "" }));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-700 text-slate-900">Create account</h1>
          <p className="text-slate-500 text-sm mt-1">Join the platform today</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
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
              <p className="text-xs text-slate-400 mt-1">
                8-16 characters, one uppercase, one special character
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
