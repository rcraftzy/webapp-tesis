import React, { useContext } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { DataContext } from "./context/DataContext";

export const AppTopbar = (props) => {

  const {setUser} = useContext(DataContext)

  const logout = async () => {
    await fetch("http://localhost:9090/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    setUser("");
    window.localStorage.removeItem("loggedAppUser");
  };

  return (
    <div className="layout-topbar">
      <Link to="/" className="layout-topbar-logo">
        <img
          src="images/Logo.jpeg"
          alt="logo"
        />
        <span>SERVICIO TÉCNICO</span>
      </Link>

      <button
        type="button"
        className="p-link  layout-menu-button layout-topbar-button"
        onClick={props.onToggleMenuClick}
      >
        <i className="pi pi-bars" />
      </button>

      <button
        type="button"
        className="p-link layout-topbar-menu-button layout-topbar-button"
        onClick={props.onMobileTopbarMenuClick}
      >
        <i className="pi pi-ellipsis-v" />
      </button>

      <ul
        className={classNames("layout-topbar-menu lg:flex origin-top", {
          "layout-topbar-menu-mobile-active": props.mobileTopbarMenuActive,
        })}
      >
        <li>
          <a
            className="p-link layout-topbar-button"
            href="/login"
            onClick={logout}
          >
            <i className="pi pi-sign-out" />
            <span>Salir</span>
          </a>
        </li>
      </ul>
    </div>
  );
};
