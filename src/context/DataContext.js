import React, { createContext, useEffect, useState, useContext } from "react";
import { getUser, getUserEmpresa } from "../service/AuthService"

export const DataContext = createContext();

export const useAuth = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

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
    getUser().then(setUser) 
    getUserEmpresa(user.id).then(setData);
  }, [user]);
  useEffect(() => {
    const loggedUserJSON = localStorage.getItem('loggedAppUser')
    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
    }
  }, [])

  return (
    <DataContext.Provider value={{ data, setUser, user }}>
      {children}
    </DataContext.Provider>
  );
}
