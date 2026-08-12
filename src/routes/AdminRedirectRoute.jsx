import { Navigate, useLocation } from "react-router-dom";

function AdminRedirectRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  const location = useLocation();

  if (
    user &&
    user.role === "admin" &&
    !location.pathname.startsWith("/movie/")
  ) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}

export default AdminRedirectRoute;