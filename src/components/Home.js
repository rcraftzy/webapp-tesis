import React from "react"
// import { useAuth } from "../context/AuthContext";

const Home = ({ data }) => {
    return (
        <div>
            {data.name ? 'Hi ' + data.name : 'You are not logged in'}
        </div>
    );
};

export default Home;

