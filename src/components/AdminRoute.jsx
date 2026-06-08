import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const isAdmin = localStorage.getItem("adminLoggedIn") === "true";
  return isAdmin ? children : <Navigate to="/admin" replace />;
}
