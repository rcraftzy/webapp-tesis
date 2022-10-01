import React, { useEffect, useRef, useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { ColorPicker } from "primereact/colorpicker";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { ProductService } from "../service/ProductService";

import { DataView } from "primereact/dataview";

import classNames from "classnames";

import * as API from "../service/EstadoService";
import * as APIEmpresa from "../service/EmpresaService";

const Empresa = (props) => {
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
  const [empresas, setEmpresas] = useState(props.empresas);
  const [dropdownItem, setDropdownItem] = useState(null);
  const [dropdownItems, setDropdownItems] = useState(null);
  // const [dropdownItemCiudad, setDropdownItemCiudad] = useState(null);
  // const [dropdownItemsCiudad, setDropdownItemsCiudad] = useState(null);
  const [estados, setEstados] = useState(null);
  const [estado, setEstado] = useState(emptyEstado);
  const [colorValue, setColorValue] = useState("1976D2");

  const [deleteEstadoDialog, setDeleteEstadoDialog] = useState(false);

  const [estadoDialog, setEstadoDialog] = useState(false);
  const [empresaDialog, setEmpresaDialog] = useState(false);

  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);
  const dt = useRef(null);
  
  useEffect(() => {
    API.getEstados().then((data) => setEstados(data));
    // API.getEstado().then((data) => setEstados(data));
    const ciudad = new ProductService();
    setEmpresas(props.empresa)
    // APIEmpresa.getEmpresas().then((data) => setEmpresas(data))
    // ciudad.getProducts().then((data) => setDropdownItems(data));
    ciudad.getCiudad().then((data) => setDropdownItems(data));
  }, [props]);
  const editProduct = (product) => {
    setEstado({ ...product });
    setEstadoDialog(true);
  };
  const editEmpresa = (empresa) => {
    setEmpresa({ ...empresa });
    setEmpresaDialog(true);
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

  const saveEmpresa = () => {
    setSubmitted(true);

    if (empresa.nombre.trim()) {
      let _products = [...empresas];
      let _product = { ...empresa };
      if (empresa.id) {
        const index = findIndexById(empresa.id);

        _products[index] = _product;

        APIEmpresa.putEmpresas(empresa.id, {
          ruc: empresa.ruc,
          nombre: empresa.nombre, 
          direccion: empresa.direccion,
          ciudad_id: dropdownItem.id, 
          telefono: empresa.telefono,
          email: empresa.email,
          porcentajeIVA: parseFloat(empresa.porcentajeIVA),
        });
        toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: "Datos de la empresa actualizados",
          life: 3000,
        });
      } else {
          toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: "No puedes crear otra empresa",
          life: 3000,
        });
      }

      setEmpresa(_products);
      setEmpresaDialog(false);
      setEmpresa(emptyEmpresa);
    }
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
        API.postEstado({
          state: estado.state,
          color: colorValue,
          empresa_id: 1,
        });

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
  const hideDialogEmpresa = () => {
    setSubmitted(false);
    setEmpresaDialog(false);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...estado };
    _product[`${name}`] = val;

    setEstado(_product);
  };

  const onInputChangeEmpresa = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...empresa };
    _product[`${name}`] = val;

    setEmpresa(_product);
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
  const empresaDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialogEmpresa}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveEmpresa}
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

    API.deleteEstado(estado.id);

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
          <div className="mb-3"> <strong>Telefono:</strong> <span>{data.telefono}</span>
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
            onClick={() => editEmpresa(data)}
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
          {
          empresas && <DataView
            value={empresas}
            layout="grid"
            rows={4}
            itemTemplate={itemEmpresa}
            emptyMessage="Datos no econtrados"
          >
          </DataView>}
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
        visible={empresaDialog}
        style={{ width: "350px" }}
        header="Empresa"
        modal
        className="p-fluid"
        footer={empresaDialogFooter}
        onHide={hideDialogEmpresa}
      >
        <div className="field">
          <label htmlFor="ruc">Ruc</label>
          <InputText
            id="ruc"
            value={empresa.ruc}
            onChange={(e) => onInputChangeEmpresa(e, "ruc")}
            required
            autoFocus
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
        <div className="field">
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
        <div className="field">
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
        <div className="field">
          <label htmlFor="Ciudad">Provincia</label>
          <Dropdown
            id="Ciudad"
            value={empresa.ciudad}
            onChange={(e) => setDropdownItem(e.value)}
            options={dropdownItems}
            optionLabel="nombre"
            placeholder="Selecciona una Ciudad"
          >
          </Dropdown>
        </div>
        <div className="field">
          <label htmlFor="telefono">Teléfono</label>
          <InputText
            id="telefono"
            value={empresa.telefono}
            onChange={(e) => onInputChangeEmpresa(e, "telefono")}
            required
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
        <div className="field">
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
              El correo electronico de la empresa es requerido.
            </small>
          )}
        </div>
        <div className="field">
          <label htmlFor="iva">IVA</label>
                              <div className="p-inputgroup">
          <InputText
            id="porcentajeIVA"
            value={empresa.porcentajeIVA}
            onChange={(e) => onInputChangeEmpresa(e, "porcentajeIVA")}
            required
            className={classNames({
              "p-invalid": submitted && !empresa.porcentajeIVA,
            })}
            />
                      <span className="p-inputgroup-addon">%</span>
        </div>
          {submitted && !empresa.porcentajeIVA && (
            <small className="p-invalid">
              El porcentaje de IVA es requerido.
            </small>
          )}
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
export default React.memo(Empresa);
