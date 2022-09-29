import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const Login = ({ setData }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:9090/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const content = await response.json();

    setRedirect(true);
    setData(content.name);
  };

  if (redirect) {
    navigate("/");
  }

  return (
    <div className="container-grid">
      <div className="column-left">
        <img className="img" src="images/loginImg.png" alt="una imagen"/>
      </div>

      <div className="column-right">
      <span className="contain-txt-register">
        ¿No estas registrado?<Link to="/register">Registrate ahora</Link>
      </span>
        <form onSubmit={submit}>
          <div className="div-logo">
            <img className="logo-login" src="images/Logo.jpeg" alt="logo del instituto"/>
          </div>
          <h1 className="title">Servicio Tecnico</h1>
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
