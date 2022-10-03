import React, { createContext, useEffect, useState } from "react";

export const DataContext = createContext();

export function DataProvider({ children }) {
  let empty = {
    id: null,
    user: {
      id: null,
      name: "",
      email: "",
    },
    empresa: {
      id: null,
      ruc: "",
      nombre: "",
      direccion: "",
      ciudad: {
        id: null,
        nombre: "",
        provincia: {
          id: null,
          nombre: "",
        },
      },
      telefono: "",
      email: "",
      porcentajeIVA: null,
    },
  };

  const [data, setData] = useState(empty);
  const [user, setUser] = useState("");

  useEffect(() => {
    (
      async () => {
        try {
          const response = await fetch("http://localhost:9090/api/user", {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });

          const content = await response.json();

          setUser(content);
          getUserEmpresa(content.id);
        } catch (e) {
          console.log(e);
        }
      }
    )();
  }, []);

  const getUserEmpresa = async (id) => {
    try {
      const response = await fetch(
        "http://localhost:9090/api/v1.0/empresaUser/" + id,
        {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        },
      );
      const content = await response.json();

      setData(content);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <DataContext.Provider value={{ data, setUser, user }}>
      {children}
    </DataContext.Provider>
  );
}
