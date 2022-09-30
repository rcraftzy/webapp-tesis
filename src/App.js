import React, { lazy, Suspense, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";

import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
import "./assets/demo/flags/flags.css";
import "./assets/demo/Demos.scss";
import "./assets/layout/layout.scss";
import "./App.scss";

// import { ProtectedRoute } from "./components/ProtectedRoute";
// import { AuthProvider } from "./context/AuthContext";
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Layout = lazy(() => import("./components/Layout"));
const Home = lazy(() => import("./components/Home"));
const Dashboard = lazy(() => import("./components/Dashboard"));

const Empresa = lazy(() => import("./pages/Empresa"));
const OrdenServicio = lazy(() => import("./pages/OrdenServicio"));
const Producto = lazy(() => import("./pages/Producto"));
const Crud = lazy(() => import("./pages/Crud"));
const CrudCuidad = lazy(() => import("./pages/CrudCuidad"));
const Cliente = lazy(() => import("./pages/Cliente"));
const Tecnico = lazy(() => import("./pages/Tecnico"));

const App = () => {
  const [data, setData] = useState("");
  const [empresa, setEmpresa] = useState("");

  useEffect(() => {
    (
      async () => {
        const response = await fetch("http://localhost:9090/api/user", {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        const content = await response.json();

        setData(content);
        getUserEmpresa(content.id);
      }
    )();
  }, []);

  const getUserEmpresa = async (id) => {
    const response = await fetch(
      "http://localhost:9090/api/v1.0/empresaUser/" + id,
      {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );

    const content = await response.json();

    setEmpresa(content);
  };

  return (
    <>
      <Suspense fallback={<div />}>
        <Routes>
          <Route path="/login" element={<Login setData={data} />} />
          <Route
            path="/"
            exact
            element={
              <Layout>
                <Home data={data} />
              </Layout>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard data={data} />
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
            path="/orden-de-servicio"
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
                <Empresa {...empresa} />
              </Layout>
            }
          />
        </Routes>
      </Suspense>
    </>
  );
};

export default App;
