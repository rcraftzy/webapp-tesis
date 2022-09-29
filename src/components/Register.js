import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [redirect, setRedirect] = useState(false);

  const submit = async (e) => {
    e.preventDefault();

    await fetch("http://localhost:9090/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    setRedirect(true);
  };

  if (redirect) {
    navigate("/login");
  }

  useEffect(() => {
    (
      async () => {
        const response = await fetch(
          "http://localhost:9090/api/v1.0/roleUser",
          {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          },
        );

        const content = await response.json();
        setRole(content)
      }
    )();
  });

  return (
    <div className="container-grid">
      <div className="column-left">
        <img className="img" src="images/loginImg.png" alt="imagen de portada"/>
      </div>

      <div className="column-right">
        <span className="contain-txt-register">
          <Link to="/login">Volver al inicio de sesion</Link>
        </span>
        <form onSubmit={submit}>

          <div className="div-logo">
            <img className="logo-login" src="images/Logo.jpeg" alt="logo del instituto"/>
          </div>
             
          <h1 className="title">Registro de Servicio Tecnico</h1>

          <input
            className="input-user"
            placeholder="Ingrese un nombre de usuario"
            required
            onChange={(e) => setName(e.target.value)}
          />

          <br />
          <input
            type="email"
            className="input-email"
            placeholder="Ingrese su direccion e-mail"
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
            Registrarse
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
