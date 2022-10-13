import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/DataContext";

function ProtectedRoute() {
  const { auth, data } = useAuth();

  if (!data.empresa) {
    return <Navigate to="crear" />;
  }
  return !auth ? <Outlet /> : <Navigate to="/empresa" />;
}
export default ProtectedRoute;
