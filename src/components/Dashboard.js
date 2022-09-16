import React from "react";

const Dashboard = ({ name }) => {
  return (
    <div className="grid">
      <div className="col-12">
        <div className="card">
          <h5>Instituto Superior Tecnológico Luis Rogerio González</h5>
          <p>Estudiante: Roberto Carlos Toalongo Galabay</p>
          <p>
            {name ? "Hi " + name : "You are not logged in"}
          </p>
        </div>
      </div>
    </div>
  );
};
export default Dashboard
