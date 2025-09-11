import { Navigate, useLocation } from "react-router-dom";
import useAuthStore from "../../store/authStore";

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isLoading } = useAuthStore();
  const location = useLocation();

  console.log("user", user);

  if (isLoading) return null;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};
