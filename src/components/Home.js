import React from "react";
// import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Home = ({ data }) => {

  const navigate = useNavigate();

  if (data.name) {
  } else {
    navigate("/login");
  }
  return (
    <div>
      {data.name ? "Hi " + data.name : "You are not logged in"}
    </div>
  );
};

export default Home;
