import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./components/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminStores from "./pages/admin/AdminStores";
import AddUser from "./pages/admin/AddUser";
import AddStore from "./pages/admin/AddStore";
import UserDetails from "./pages/admin/UserDetails";
import UserLayout from "./pages/user/UserLayout";
import UserDashboard from "./pages/user/UserDashboard";
import Stores from "./pages/user/Stores";
import UpdatePassword from "./pages/user/UpdatePassword";
import OwnerLayout from "./pages/owner/OwnerLayout";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import OwnerUpdatePassword from "./pages/owner/OwnerUpdatePassword";
import Profile from "./pages/Profile";

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role === "ADMIN") return <Navigate to="/admin" replace />;
  if (user.role === "STORE_OWNER") return <Navigate to="/owner" replace />;
  return <Navigate to="/user" replace />;
}

export default function App() {
  return (
    <BrowserRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<RootRedirect />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={["ADMIN"]}>
                    <AdminLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="users/:id" element={<UserDetails />} />
              <Route path="stores" element={<AdminStores />} />
              <Route path="add-user" element={<AddUser />} />
              <Route path="add-store" element={<AddStore />} />
              <Route path="profile" element={<Profile />} />
            </Route>
            <Route
              path="/user"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={["USER"]}>
                    <UserLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="stores" element={<Stores />} />
              <Route path="password" element={<UpdatePassword />} />
            </Route>
            <Route
              path="/owner"
              element={
                <ProtectedRoute>
                  <RoleRoute roles={["STORE_OWNER"]}>
                    <OwnerLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route index element={<OwnerDashboard />} />
              <Route path="password" element={<OwnerUpdatePassword />} />
            </Route>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
