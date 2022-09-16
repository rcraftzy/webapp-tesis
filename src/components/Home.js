import React from "react"
// import { useAuth } from "../context/AuthContext";

const Home = ({ name }) => {
    return (
        <div>
            {name ? 'Hi ' + name : 'You are not logged in'}
        </div>
    );
};

export default Home;

