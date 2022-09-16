import React, {useEffect, useState} from "react";
import { Route, Routes } from "react-router-dom";

import Login from "./components/Login";
import Home from "./components/Home";
import Register from "./components/Register";
import Layout from "./components/Layout";

// import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./components/Dashboard";

import Crud from "./pages/Crud";
import CrudCuidad from "./pages/CrudCuidad";
import OrdenServicio from "./pages/OrdenServicio";
import Tecnico from "./pages/Tecnico";
import Cliente from "./pages/Cliente";
import Producto from "./pages/Producto";
import Empresa from "./pages/Empresa";

import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "./assets/demo/flags/flags.css";
import "./assets/demo/Demos.scss";
import "./assets/layout/layout.scss";
import "./App.scss";

// import { AuthProvider } from "./context/AuthContext";

const App = () => {

  const [name, setName] = useState('');
  const [data, setData] = useState('');

    useEffect(() => {
        (
            async () => {
                const response = await fetch('http://localhost:9090/api/user', {
                    headers: {'Content-Type': 'application/json'},
                    credentials: 'include',
                });

                const content = await response.json();

                setName(content.name);
                setData(content)
                console.log(name)
            }
        )();
    });
  return (
    <>
        <Routes>
          <Route path="/login" element={<Login setName={setName}/>} />
          <Route
            path="/"
            element={
                <Layout>
                  <Home  name={name}/>
                </Layout>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            exact
            element={
                <Layout>
                  <Dashboard name={name}/>
                </Layout>
            }
          />
          <Route
            path="/provincia"
            element={
                <Layout>
                  <Crud />
                </Layout>
            }
          />
          <Route
            path="/cuidad"
            element={
                <Layout>
                  <CrudCuidad />
                </Layout>
            }
          />
          <Route
            path="/orden-service"
            element={
                <Layout>
                  <OrdenServicio />
                </Layout>
            }
          />
          <Route
            path="/tecnico"
            element={
                <Layout>
                  <Tecnico />
                </Layout>
            }
          />
          <Route
            path="/cliente"
            element={
                <Layout>
                  <Cliente />
                </Layout>
            }
          />
          <Route
            path="/producto"
            element={
                <Layout>
                  <Producto />
                </Layout>
            }
          />
          <Route
            path="/empresa"
            element={
                <Layout>
                  <Empresa />
                </Layout>
            }
          />
        </Routes>
    </>
  );
};

export default App;
