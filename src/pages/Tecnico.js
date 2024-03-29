import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import * as API from "../service/TecnicoService";
import * as APICiudad from "../service/CiudadService";

import { Dropdown } from "primereact/dropdown";

const Tecnico = () => {
  let emptyTecnico = {
    id: null,
    cedula: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    direccion: "",
    ciudad: {
      id: null,
      nombre: "",
      provincia: {
        id: null,
        nombre: "",
      },
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
      porcentajeIVA: "",
    },
  };

  const [tecnicos, setTecnicos] = useState(null);
  const [tecnicoDialog, setTecnicoDialog] = useState(false);
  const [tecnico, setTecnico] = useState(emptyTecnico);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);

  const [dropdownItem, setDropdownItem] = useState(null);
  const [dropdownItems, setDropdownItems] = useState(null);

  useEffect(() => {
    API.getTecnicos().then((data) => setTecnicos(data));
    APICiudad.getCiudades().then((data) => setDropdownItems(data));
  }, []);
  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...tecnico };
    _product[`${name}`] = val;

    setTecnico(_product);
  };
  const openNew = () => {
    setTecnico(emptyTecnico);
    setDropdownItem(null);
    setSubmitted(false);
    setTecnicoDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setTecnicoDialog(false);
  };
  const saveProduct = () => {
    setSubmitted(true);

    if (tecnico.nombre.trim()) {
      let _products = [...tecnicos];
      let _product = { ...tecnico };
      if (tecnico.id) {

        API.putTecnicos(tecnico.id, {
          cedula: tecnico.cedula,
          nombre: tecnico.nombre,
          apellido: tecnico.apellido,
          email: tecnico.email,
          telefono: tecnico.telefono,
          direccion: tecnico.direccion,
          ciudad_id: dropdownItem.id,
          empresa_id: 1,
        });
        const index = findIndexById(tecnico.id);
        _products[index] = _product;
        setTecnicos(_products);

        toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: "Técnico actualizado",
          life: 3000,
        });
      } else {
        API.postTecnicos({
          cedula: tecnico.cedula,
          nombre: tecnico.nombre,
          apellido: tecnico.apellido,
          email: tecnico.email,
          telefono: tecnico.telefono,
          direccion: tecnico.direccion,
          ciudad_id: dropdownItem.id,
          empresa_id: 1,
        }).then((res) => {
            if (res === 401) {
            }else{
              _products.push(res.data)
              setTecnicos(_products);
            }
          });
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Técnico creado",
          life: 3000,
        });
      }
      setTecnicoDialog(false);
      setTecnico(emptyTecnico);
    }
  };
  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < tecnicos.length; i++) {
      if (tecnicos[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const editProduct = (product) => {
    setTecnico({ ...product });
    setDropdownItem(product.ciudad);
    setTecnicoDialog(true);
  };
  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editProduct(rowData)}
        />
      </div>
    );
  };

  const leftToolbarTemplate = () => {
    return (
      <Button
        label="Nuevo"
        icon="pi pi-plus"
        className="p-button-success mr-2"
        onClick={openNew}
      />
    );
  };
  const productDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialog}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveProduct}
      />
    </>
  );
  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Tecnicos</h5>
      <span className="block mt-2 md:mt-0 p-input-icon-left">
        <i className="pi pi-search" />
        <InputText
          type="search"
          onInput={(e) => setGlobalFilter(e.target.value)}
          placeholder="Buscar..."
        />
      </span>
    </div>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
          <DataTable
            value={tecnicos}
            selectionMode="single"
            responsiveLayout="scroll"
            emptyMessage="Registros no encontrados."
            paginator
            className="datatable-responsive"
            rows={10}
            globalFilter={globalFilter}
            header={header}
          >
            <Column
              field="cedula"
              header="Cédula"
              headerStyle={{ width: "8%", minWidth: "8rem" }}
            />
            <Column
              field="nombre"
              header="Nombres"
              headerStyle={{ minWidth: "10rem" }}
            />
            <Column
              field="apellido"
              header="Apellidos"
              headerStyle={{ minWidth: "10rem" }}
            />
            <Column
              field="telefono"
              header="Celular"
              headerStyle={{ minWidth: "7rem" }}
            />
            <Column
              field="email"
              header="E-mail"
              headerStyle={{ minWidth: "8rem" }}
            />
            <Column
              field="direccion"
              header="Direccion"
              headerStyle={{ minWidth: "8rem" }}
            />
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={tecnicoDialog}
            style={{ width: "450px" }}
            header="Técnico"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="cedula">Cédula</label>
              <InputText
                id="cedula"
                value={tecnico.cedula}
                onChange={(e) => onInputChange(e, "cedula")}
                required
                autoFocus
                maxLength="10"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                className={classNames({
                  "p-invalid": submitted && !tecnico.cedula,
                })}
              />
              {submitted && !tecnico.cedula && (
                <small className="p-invalid">
                  El numero de cédula del técnico es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <InputText
                id="nombre"
                value={tecnico.nombre}
                onChange={(e) => onInputChange(e, "nombre")}
                required
                onKeyPress={(event) => {
                  if (!/[A-Za-z]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                className={classNames({
                  "p-invalid": submitted && !tecnico.nombre,
                })}
              />
              {submitted && !tecnico.nombre && (
                <small className="p-invalid">
                  El nombre del técnico es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="apellido">Apellido</label>
              <InputText
                id="apellido"
                value={tecnico.apellido}
                onChange={(e) => onInputChange(e, "apellido")}
                required
                onKeyPress={(event) => {
                  if (!/[A-Za-z]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                className={classNames({
                  "p-invalid": submitted && !tecnico.apellido,
                })}
              />
              {submitted && !tecnico.apellido && (
                <small className="p-invalid">
                  El apellido del técnico es necesario.
                </small>
              )}
            </div>

            <div className="field">
              <label htmlFor="telefono">Celular</label>
              <InputText
                id="telefono"
                value={tecnico.telefono}
                onChange={(e) => onInputChange(e, "telefono")}
                required
                maxLength="10"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                className={classNames({
                  "p-invalid": submitted && !tecnico.telefono,
                })}
              />
              {submitted && !tecnico.telefono && (
                <small className="p-invalid">
                  El numero de teléfono del técnico es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="direccion">Dirección</label>
              <InputText
                id="direccion"
                value={tecnico.direccion}
                onChange={(e) => onInputChange(e, "direccion")}
                required
                className={classNames({
                  "p-invalid": submitted && !tecnico.direccion,
                })}
              />
              {submitted && !tecnico.direccion && (
                <small className="p-invalid">
                  La dirección del técnico es necesaria.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <InputText
                id="email"
                value={tecnico.email}
                onChange={(e) => onInputChange(e, "email")}
                required
                className={classNames({
                  "p-invalid": submitted && !tecnico.email,
                })}
              />
              {submitted && !tecnico.email && (
                <small className="p-invalid">
                  La dirección e-mail del técnico es necesaria.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="nombre">Ciudad</label>
              <Dropdown
                id="nombre"
                value={dropdownItem}
                onChange={(e) => setDropdownItem(e.value)}
                options={dropdownItems}
                optionLabel="nombre"
                placeholder="Selecciona una ciudad"
              >
              </Dropdown>
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
export default React.memo(Tecnico);
