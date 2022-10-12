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

import { DataProvider } from "./context/DataContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Pdf from "./pages/Pdf"

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
          <Route path="/pdf-orden" element={<Pdf />} />
          
          <Route path="*" element={<Layout/>}>
            <Route element={<ProtectedRoute />}>
              <Route
                path="ciudad"
                element={<CrudCuidad />}
                />
              <Route
                path="dashboard"
                element={
                <Dashboard />
              }
                />
              <Route
                path="provincia"
                element={<Crud />}
                />
              <Route
                path="orden-de-servicio"
                element={<OrdenServicio />}
                />
              <Route
                path="tecnico"
                element={<Tecnico />}
                />
              <Route
                path="cliente"
                element={<Cliente />}
                />
              <Route
                path="producto"
                element={<Producto />}
                />
              <Route
                path="empresa"
                element={<Empresa />}
                />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </DataProvider>
  );
};

export default App;
