import React from "react";
// import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";

const Home = () => {

  const navigate = useNavigate();
  const {user} = React.useContext(DataContext);

  if (user.name) {
  } else {
    navigate("/login");
  }
  return (
    <div>
      {user.name ? "Hi " + user.name : "You are not logged in"}
    </div>
  );
};

export default Home;
