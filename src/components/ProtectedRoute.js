import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/DataContext";

function ProtectedRoute (){
  const {user} = useAuth() 

  return user.name ? <Outlet /> : <Navigate to="/login" />;
}
export default ProtectedRoute;
