import { Navigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function ProtectedRoute({ children, ownerOnly = false }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/" replace />;
  if (ownerOnly && user.role !== "owner") return <Navigate to="/" replace />;
  return children;
} 