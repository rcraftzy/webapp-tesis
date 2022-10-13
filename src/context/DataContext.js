import React, { createContext, useContext, useEffect, useState } from "react";
import { getUser, getUserEmpresa } from "../service/AuthService";
import { emptyEmpresaUser } from "../service/emptyServie";
import { useNavigate } from "react-router-dom";

export const DataContext = createContext();

export const useAuth = () => {
  const context = useContext(DataContext);
  if (!context) throw new Error("There is no Auth provider");
  return context;
};

export function DataProvider({ children }) {
  const [data, setData] = useState(emptyEmpresaUser);
  const [auth, setAuth] = useState(
    JSON.parse(window.localStorage.getItem("loggedAppUser") || false),
  );
  const [user, setUser] = useState("");
  const Navigate = useNavigate();

  useEffect(() => {
    getUser().then((res) => {
      if (res.id) {
        setAuth(true);
        setUser(res);
        getUserEmpresa(res.id).then((res) => {
          if (res.id) {
            setData(res);
          } else {
            Navigate("crear");
          }
        });
      }
    });
  }, [auth, Navigate]);

  useEffect(() => {
    window.localStorage.setItem("loggedAppUser", JSON.stringify(auth));
  }, [auth]);

  return (
    <DataContext.Provider value={{ data, setUser, user, auth, setAuth }}>
      {children}
    </DataContext.Provider>
  );
}
