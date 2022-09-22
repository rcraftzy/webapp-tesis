import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { EmpresaService } from "../service/EmpresaService";
import { ColorPicker } from "primereact/colorpicker";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";

import { DataView } from "primereact/dataview";

import classNames from "classnames";

import * as API from "../service/EstadoService";
import * as APIEmpresa from "../service/EmpresaService";

const Empresa = ({ props }) => {
  let emptyEmpresa = {
    id: null,
    ruc: "",
    nombre: "",
    direccion: "",
    ciudad: "",
    telefono: "",
    email: "",
    porcentajeIVA: "",
  };
  let emptyEstado = {
    id: null,
    state: "",
    color: "",
    empresa_id: 0,
  };

  const [empresa, setEmpresa] = useState(emptyEmpresa);
  const [empresas, setEmpresas] = useState(null);
  const [dropdownItem, setDropdownItem] = useState(null);
  const [dropdownItems, setDropdownItems] = useState(null);
  const [estados, setEstados] = useState(null);
  const [estado, setEstado] = useState(emptyEstado);
  const [colorValue, setColorValue] = useState("1976D2");

  const [deleteEstadoDialog, setDeleteEstadoDialog] = useState(false);

  const [estadoDialog, setEstadoDialog] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    API.getEstados().then((data) => setEstados(data));
    APIEmpresa.getEmpresas().then((data) => setEmpresas(data));
  }, []);

  const editProduct = (product) => {
    setEstado({ ...product });
    setEstadoDialog(true);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <div className="actions">
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-success mr-2"
          onClick={() => editProduct(rowData)}
        />
       <Button
        icon="pi pi-trash"
        className="p-button-rounded p-button-warning mt-2"
        onClick={() => confirmDeleteEstado(rowData)}
      />
      </div>
    );
  };

  const confirmDeleteEstado = (product) => {
    setEstado(product);
    setDeleteEstadoDialog(true);
  };

  const saveProduct = () => {
    setSubmitted(true);

    if (estado.state.trim()) {
      let _products = [...estados];
      let _product = { ...estado };
      if (estado.id) {
        const index = findIndexById(estado.id);

        _products[index] = _product;

        API.putEstado(estado.id, {
          state: estado.state,
          color: colorValue,
          empresa_id: 1,
        });
        toast.current.show({
          severity: "success",
          summary: "Petición exitosa",
          detail: "Estado de orden se servicio actualizado",
          life: 3000,
        });
      } else {
        API.postEstado({state: estado.state, color: colorValue, empresa_id: 1})

        _products.push(_product);

        toast.current.show({
          severity: "success",
          summary: "Petición exitosa",
          detail: "Estado de orden de servicio creado",
          life: 3000,
        });
      }

      setEstados(_products);
      setEstadoDialog(false);
      setEstado(emptyEstado);
    }
  };
  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < estados.length; i++) {
      if (estados[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };
  const hideDialog = () => {
    setSubmitted(false);
    setEstadoDialog(false);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...estado };
    _product[`${name}`] = val;

    setEstado(_product);
  };

  const estadoDialogFooter = (
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
  const openNew = () => {
    setEstado(emptyEstado);
    setSubmitted(false);
    setEstadoDialog(true);
  };
  const hideDeleteProductDialog = () => {
    setDeleteEstadoDialog(false);
  };

  const deleteProduct = () => {
    let _products = estados.filter((val) => val.id !== estados.id);
    setEstados(_products);
    setDeleteEstadoDialog(false);
    setEstado(emptyEstado);

    API.deleteEstado(estado.id)

    toast.current.show({
      severity: "success",
      summary: "Exito!",
      detail: "Estado de orden de servicio eliminada",
      life: 3000,
    });
  };
  const deleteEstadoDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
        />
      <Button
        label="Yes"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProduct}
        />
      </>
  );
  const itemEmpresa = (data) => {
    return (
      <div className="col-12">
        <div className="flex-1 text-center md:text-left">
          <div className="mb-3">
            <strong>Ruc:</strong>
            <span>{data.ruc}</span>
          </div>
          <div className="mb-3">
            <strong>Nombre:</strong>
            <span>{data.nombre}</span>
          </div>
          <div className="mb-3">
            <strong>Direccion:</strong>
            <span>{data.direccion}</span>
          </div>
          <div className="mb-3">
            <strong>Provincia:</strong>
            <span>{data.ciudad.provincia.nombre}</span>
          </div>
          <div className="mb-3">
            <strong>Ciudad:</strong>
            <span>{data.ciudad.nombre}</span>
          </div>
          <div className="mb-3">
            <strong>Telefono:</strong>
            <span>{data.telefono}</span>
          </div>
          <div className="mb-3">
            <strong>E-mail:</strong>
            <span>{data.email}</span>
          </div>
          <div className="mb-3">
            <strong>IVA:</strong>
            <span>{data.porcentajeIVA}</span>
          </div>
        </div>
        <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-success mr-2"
          />
        </div>
      </div>
    );
  };

  const colorBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Color</span>
        <ColorPicker
            value={rowData.color}
            style={{ width: "2rem" }}
          />
        </>
    );
  };

  return (
    <div className="grid p-fluid">
      <div className="col-12 xl:col-6">
        <div className="card">
          <h5>Datos de la empresa</h5>
          <DataView
            value={empresas}
            layout="grid"
            rows={4}
            itemTemplate={itemEmpresa}
          >
          </DataView>
        </div>
      </div>
      <div className="col-12 md:col-6">
        <div className="card">
          <h5>Estados de orden de servicio</h5>
          <DataTable
            ref={dt}
            value={estados}
            dataKey="id"
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            emptyMessage="Registros no encontrados."
            responsiveLayout="scroll"
          >
            <Column
              field="state"
              header="Nombre del estado"
              headerStyle={{ width: "43%", minWidth: "10rem" }}
            >
            </Column>
            <Column
              field="color"
              header="Color"
              body={colorBodyTemplate}
              headerStyle={{ width: "10%", minWidth: "8rem" }}
            >
            </Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>
            <Button
            label="Nuevo"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNew}
          />
        </div>
      </div>
      <Dialog
        visible={estadoDialog}
        style={{ width: "350px" }}
        header="Estado de orden de servicio"
        modal
        className="p-fluid"
        footer={estadoDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="state">Nombre</label>
          <InputText
            id="state"
            value={estado.state}
            onChange={(e) => onInputChange(e, "state")}
            required
            autoFocus
            className={classNames({
              "p-invalid": submitted && !estado.state,
            })}
          />
          {submitted && !estado.state && (
            <small className="p-invalid">
              El nombre del estado es requerido.
            </small>
          )}
        </div>
        <div className="field">
          <label htmlFor="state">Color</label>
          <br />
          <ColorPicker
            value={colorValue}
            onChange={(e) => setColorValue(e.value)}
            style={{ width: "2rem" }}
          />
        </div>
      </Dialog>
        <Dialog
          visible={deleteEstadoDialog}
          style={{ width: "450px" }}
          header="Confirm"
          modal
          footer={deleteEstadoDialogFooter}
          onHide={hideDeleteProductDialog}
        >
          <div className="flex align-items-center justify-content-center">
            <i
              className="pi pi-exclamation-triangle mr-3"
              style={{ fontSize: "2rem" }}
            />
            {estado && (
              <span>
                Are you sure you want to delete <b>{estado.state}</b>?
              </span>
            )}
          </div>
        </Dialog>
    </div>
  );
};
export default Empresa;
