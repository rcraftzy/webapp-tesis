import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { postEmpresa, postEmpresaUser } from "../service/EmpresaService";
import { useNavigate } from "react-router-dom";
import { emptyEmpresa } from "../service/emptyServie";

import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ProductService } from "../service/ProductService";
import { useAuth } from "../context/DataContext";

function EmpresaForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [empresa, setEmpresa] = useState(emptyEmpresa);

  const [dropdownItem, setDropdownItem] = useState(null);
  const [dropdownItems, setDropdownItems] = useState(null);

  const [redirect, setRedirect] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  if (redirect) {
    navigate("/empresa");
  }
  const onInputChangeEmpresa = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...empresa };
    _product[`${name}`] = val;

    setEmpresa(_product);
  };

  useEffect(() => {
    const ciudad = new ProductService();
    ciudad.getCiudad().then((data) => setDropdownItems(data));
  }, []);

  const saveEmpresa = () => {
    setSubmitted(true);

    if (empresa.nombre.trim()) {
      if (empresa.id) {
      } else {
        postEmpresa({
          ruc: empresa.ruc,
          nombre: empresa.nombre,
          direccion: empresa.direccion,
          ciudad_id: 1,
          telefono: empresa.telefono,
          email: empresa.email,
          porcentajeIVA: parseFloat(empresa.porcentajeIVA),
        }).then((res) => {
          if (res === 401) {
          } else {
            postEmpresaUser({ user_id: user.id, empresa_id: res.data.id });
            setEmpresa(res);
            setRedirect(true);
          }
        });
        toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: "EmpresaCreada",
          life: 3000,
        });
      }
      setEmpresa(emptyEmpresa);
    }
  };

  return (
    <div className="col-12">
      <Toast ref={toast} />
      <div className="card">
        <div className="field col-12">
          <label htmlFor="ruc">Ruc</label>
          <InputText
            id="ruc"
            value={empresa.ruc}
            onChange={(e) => onInputChangeEmpresa(e, "ruc")}
            required
            autoFocus
            maxLength="13"
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            className={classNames({
              "p-invalid": submitted && !empresa.ruc,
            })}
          />
          {submitted && !empresa.ruc && (
            <small className="p-invalid">
              El numero de ruc de la empresa es requerido.
            </small>
          )}
        </div>
        <div className="field col-12">
          <label htmlFor="nombre">Nombre</label>
          <InputText
            id="nombre"
            value={empresa.nombre}
            onChange={(e) => onInputChangeEmpresa(e, "nombre")}
            required
            className={classNames({
              "p-invalid": submitted && !empresa.nombre,
            })}
          />
          {submitted && !empresa.nombre && (
            <small className="p-invalid">
              El nombre de la empresa es es requerido.
            </small>
          )}
        </div>
        <div className="field col-12">
          <label htmlFor="direccion">Dirección</label>
          <InputText
            id="direccion"
            value={empresa.direccion}
            onChange={(e) => onInputChangeEmpresa(e, "direccion")}
            required
            className={classNames({
              "p-invalid": submitted && !empresa.direccion,
            })}
          />
          {submitted && !empresa.direccion && (
            <small className="p-invalid">
              La dirección de la empresa es requerido.
            </small>
          )}
        </div>
        <div className="field col-12">
          <label htmlFor="Ciudad">Provincia</label>
          <Dropdown
            id="Ciudad"
            value={dropdownItem}
            onChange={(e) => setDropdownItem(e.value)}
            options={dropdownItems}
            optionLabel="nombre"
            placeholder="Selecciona una Ciudad"
          >
          </Dropdown>
        </div>
        <div className="field col-12">
          <label htmlFor="telefono">Teléfono</label>
          <InputText
            id="telefono"
            value={empresa.telefono}
            onChange={(e) => onInputChangeEmpresa(e, "telefono")}
            required
            maxLength="9"
            onKeyPress={(event) => {
              if (!/[0-9]/.test(event.key)) {
                event.preventDefault();
              }
            }}
            className={classNames({
              "p-invalid": submitted && !empresa.telefono,
            })}
          />
          {submitted && !empresa.telefono && (
            <small className="p-invalid">
              El número de telefono de la empresa es requerido.
            </small>
          )}
        </div>
        <div className="field col-12">
          <label htmlFor="email">E-mail</label>
          <InputText
            id="email"
            value={empresa.email}
            onChange={(e) => onInputChangeEmpresa(e, "email")}
            required
            className={classNames({
              "p-invalid": submitted && !empresa.email,
            })}
          />
          {submitted && !empresa.email && (
            <small className="p-invalid">
              El correo electrónico de la empresa es requerido.
            </small>
          )}
        </div>
        <div className="field lg:col-4">
          <label htmlFor="iva">IVA</label>
          <span className="p-input-icon-right">
            <InputText
              id="porcentajeIVA"
              value={empresa.porcentajeIVA}
              onChange={(e) => onInputChangeEmpresa(e, "porcentajeIVA")}
              required
              maxLength="2"
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
              className={classNames({
                "p-invalid": submitted && !empresa.porcentajeIVA,
              })}
            />
            <i className="pi pi-percentage" />
          </span>
          {submitted && !empresa.porcentajeIVA && (
            <small className="p-invalid">
              El porcentaje de IVA es requerido.
            </small>
          )}
        </div>
        <Button
          label="Guardar"
          icon="pi pi-check"
          className="p-button-text"
          onClick={saveEmpresa}
        />
      </div>
    </div>
  );
}
export default EmpresaForm;
