import React from "react";
import { useAuth } from "../context/DataContext";
// import { DataContext } from "../context/DataContext";
import { Navigate } from "react-router-dom";

const Home = () => {

  const {user} =  useAuth();

  return (
    <div>
      {user.name ? "Hi " + user.name : <Navigate to="/login" />}
    </div>
  );
};

export default Home;
