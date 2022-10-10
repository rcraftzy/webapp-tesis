import React, { createContext, useEffect, useState, useContext } from "react";
import { getUserEmpresa, getUser } from "../service/AuthService"
import { emptyEmpresaUser } from "../service/emptyServie"

export const DataContext = createContext();

export const useAuth = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export function DataProvider({ children }) {

  const [data, setData] = useState(emptyEmpresaUser);
  const [user, setUser] = useState(() => JSON.parse(window.localStorage.getItem('loggedAppUser') || "{}"));

  useEffect(() => {
    getUser().then(setUser)
  }, []);

  useEffect(() => {
    getUserEmpresa(user.id).then(setData);
  }, [user.id])


    return (
    <DataContext.Provider value={{ data, setUser, user }}>
      {children}
    </DataContext.Provider>
  );
}
