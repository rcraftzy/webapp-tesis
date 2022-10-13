import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DataContext } from "../context/DataContext";

const Login = () => {
  const { auth, setAuth } = useContext(DataContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const Navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:9090/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => {
      if (res.status === 200) {
        setAuth(true);
        window.localStorage.setItem("loggedAppUser", JSON.stringify(auth));
        Navigate("/empresa");
      } else {
        window.localStorage.setItem("loggedAppUser", JSON.stringify(auth));
      }
    });
  };
  return (
    <div className="container-grid">
      <div className="column-left">
        <img className="img" src="images/loginImg.png" alt="una imagen" />
      </div>

      <div className="column-right">
        <span className="contain-txt-register">
          ¿No estas registrado?<Link to="/register">Registrate ahora</Link>
        </span>
        <form onSubmit={submit}>
          <div className="div-logo">
            <img
              className="logo-login"
              src="images/Logo.jpeg"
              alt="logo del instituto"
            />
          </div>
          <h1 className="title">Servicio Técnico</h1>
          <br />
          <input
            type="email"
            className="input-email"
            placeholder="Ingrese su correo"
            required
            onChange={(e) => setEmail(e.target.value)}
          />

          <br />
          <input
            type="password"
            className="input-password"
            placeholder="Contraseña"
            required
            onChange={(e) => setPassword(e.target.value)}
          />
          <br />

          <button className="button" type="submit">
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
