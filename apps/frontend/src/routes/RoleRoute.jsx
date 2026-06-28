import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function RoleRoute({ allowedRole, children }) {
  const { userRole, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center text-xl">
        Loading...
      </div>
    );
  }

  if (userRole !== allowedRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default RoleRoute;