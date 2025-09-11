import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";
import PublicLayout from "./components/shared/PublicLayout";
import {
  adminRoutes,
  customerRoutes,
  notFoundRoute,
  publicRoutes,
} from "./routes";
import { ProtectedRoute } from "./components/shared/ProtectedRoute";
import PrivateLayout from "./components/shared/PrivateLayout";
import useAuthStore from "./store/authStore";

import "./App.css";

const App = () => {
  const { user } = useAuthStore();

  const getDefaultRoute = () => {
    if (!user) return "/login";
    if (user.role === "Client") return "/customer/dashboard";
    if (user.role === "Admin") return "/admin/dashboard";
    return "/login";
  };

  return (
    <>
      <Toaster
        position="top-right"
        expand={false}
        richColors
        style={{
          padding: "16px",
        }}
        toastOptions={{
          style: {
            padding: "16px",
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<Navigate to={getDefaultRoute()} replace />} />
        {/* Public Routes */}
        {publicRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <PublicLayout>
                <route.element />
              </PublicLayout>
            }
          />
        ))}

        {/* Customer Routes */}
        {customerRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute allowedRoles={["Client"]}>
                <PrivateLayout>
                  <route.element />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
        ))}

        {/* Admin Routes */}
        {adminRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <PrivateLayout>
                  <route.element />
                </PrivateLayout>
              </ProtectedRoute>
            }
          />
        ))}

        {/* 404 Route - Always keep this last */}
        <Route
          path={notFoundRoute.path}
          element={
            <PublicLayout>
              <notFoundRoute.element />
            </PublicLayout>
          }
        />
      </Routes>
    </>
  );
};

export default App;
