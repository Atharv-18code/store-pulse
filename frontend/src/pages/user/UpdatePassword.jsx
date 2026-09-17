import { useState } from "react";
import { useToast } from "../../components/Toast";
import { Eye, EyeOff } from "lucide-react";
import { updatePassword } from "../../services/userService";

const passwordRules =
  /^(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,16}$/;

export default function UpdatePassword() {
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [show, setShow] = useState({ curr: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validate = () => {
    const e = {};
    if (!passwordRules.test(form.newPassword))
      e.newPassword =
        "Password: 8-16 chars, one uppercase, one special character";
    if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = "Passwords do not match";
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
      await updatePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast("success", "Password updated successfully");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast(
        "error",
        err.response?.data?.message || "Failed to update password",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md">
      <h2 className="text-xl font-semibold text-slate-900 mb-1">
        Update Password
      </h2>
      <p className="text-sm text-slate-500 mb-6">
        Choose a strong new password
      </p>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            {
              key: "currentPassword",
              label: "Current Password",
              showKey: "curr",
            },
            { key: "newPassword", label: "New Password", showKey: "new" },
            {
              key: "confirmPassword",
              label: "Confirm New Password",
              showKey: "confirm",
            },
          ].map(({ key, label, showKey }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                {label}
              </label>
              <div className="relative">
                <input
                  type={show[showKey] ? "text" : "password"}
                  required
                  value={form[key]}
                  onChange={(e) => {
                    setForm((p) => ({ ...p, [key]: e.target.value }));
                    setErrors((p) => ({ ...p, [key]: "" }));
                  }}
                  className={`w-full px-3 py-2 pr-10 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 transition ${errors[key] ? "border-rose-400" : "border-slate-200 focus:border-indigo-400"}`}
                />
                <button
                  type="button"
                  onClick={() =>
                    setShow((p) => ({ ...p, [showKey]: !p[showKey] }))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {show[showKey] ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors[key] && (
                <p className="text-xs text-rose-500 mt-1">{errors[key]}</p>
              )}
            </div>
          ))}
          <p className="text-xs text-slate-400">
            8-16 characters · one uppercase · one special character
          </p>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
