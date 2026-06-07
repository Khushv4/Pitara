import { Navigate } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";

function ProtectedRoute({
  children,
}) {
  const { user, loading } =
    useAuth();

  if (loading)
    return (
      <div className="p-10">
        Loading...
      </div>
    );

  if (!user)
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    );

  return children;
}

export default ProtectedRoute;