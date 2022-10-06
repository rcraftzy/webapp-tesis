import React, { lazy, Suspense } from "react";
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
import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";

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
  return (
    <DataProvider>
      <Suspense fallback={<div />}>
        <Routes>
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
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
          <Route element={<ProtectedRoute />}>
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
                  <Empresa />
                </Layout>
              }
            />
          </Route>
        </Routes>
      </Suspense>
    </DataProvider>
  );
};

export default App;
