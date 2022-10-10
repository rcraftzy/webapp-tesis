import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ClienteService } from "../service/ClienteService";
import * as API from "../service/ClienteService";

const Cliente = () => {
  let emptyCliente = {
    id: null,
    nombres: "",
    apellidos: "",
    dni: "",
    direccion: "",
    telefono: "",
    celular: "",
    email: "",
    estado: null,
  };

  const [clientes, setClientes] = useState(null);
  const [clienteDialog, setClienteDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [cliente, setCliente] = useState(emptyCliente);
  const [selectedClientes, setSelectedClientes] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    API.getClientes().then((data) => setClientes(data));
  }, []);

  const openNew = () => {
    setCliente(emptyCliente);
    setSubmitted(false);
    setClienteDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setClienteDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);
    const clientserv = new ClienteService();

    if (cliente.nombres.trim()) {
      let _products = [...clientes];
      let _product = { ...cliente };
      if (cliente.id) {
        clientserv.putClientes(cliente.id, {
          nombres: cliente.nombres,
          apellidos: cliente.apellidos,
          dni: cliente.dni,
          direccion: cliente.direccion,
          telefono: cliente.telefono,
          celular: cliente.celular,
          email: cliente.email,
          estado: true,
        });
        const index = findIndexById(cliente.id);
        _products[index] = _product;
        setClientes(_products);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Cliente actualizado",
          life: 3000,
        });
      } else {
        clientserv.postClientes({
          nombres: cliente.nombres,
          apellidos: cliente.apellidos,
          dni: cliente.dni,
          direccion: cliente.direccion,
          telefono: cliente.telefono,
          celular: cliente.celular,
          email: cliente.email,
          estado: true,
        }).then((res) => {
            if(res === 401){
            }else{
              _products.push(res.data)
              setClientes(_products);
            }
          });
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Cliente creado",
          life: 3000,
        });
      }
      setClienteDialog(false);
      setCliente(emptyCliente);
    }
  };

  const editProduct = (product) => {
    setCliente({ ...product });
    setClienteDialog(true);
  };

  const deleteProduct = () => {
    let _products = clientes.filter((val) => val.id !== cliente.id);
    setClientes(_products);
    setDeleteProductDialog(false);
    setCliente(emptyCliente);
    const clientserv = new ClienteService();
    clientserv.deleteCuidades(cliente.id);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Cliente creado",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < clientes.length; i++) {
      if (clientes[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const deleteSelectedProducts = () => {
    let _products = clientes.filter((val) => !selectedClientes.includes(val));
    setClientes(_products);
    setDeleteProductsDialog(false);
    setSelectedClientes(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Clientes eliminados",
      life: 3000,
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...cliente };
    _product[`${name}`] = val;

    setCliente(_product);
  };

  const leftToolbarTemplate = () => {
    return (
      <div>
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={openNew}
        />
      </div>
    );
  };
  const nameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Name</span>
        {rowData.nombres}
      </>
    );
  };
  const surnameBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Surname</span>
        {rowData.apellidos}
      </>
    );
  };
  const dniBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">dni</span>
        {rowData.dni}
      </>
    );
  };
  const adressBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Adress</span>
        {rowData.direccion}
      </>
    );
  };
  const phoneBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Phone</span>
        {rowData.telefono}
      </>
    );
  };
  const cellphoneBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Cellphone</span>
        {rowData.celular}
      </>
    );
  };
  const emailBodyTemplate = (rowData) => {
    return (
      <>
        <span className="p-column-title">Email</span>
        {rowData.email}
      </>
    );
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

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Clientes</h5>
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
  const deleteProductDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteProduct}
      />
    </>
  );

  const deleteProductsDialogFooter = (
    <>
      <Button
        label="No"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDeleteProductsDialog}
      />
      <Button
        label="Si"
        icon="pi pi-check"
        className="p-button-text"
        onClick={deleteSelectedProducts}
      />
    </>
  );

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

          <DataTable
            ref={dt}
            value={clientes}
            selection={selectedClientes}
            onSelectionChange={(e) => setSelectedClientes(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            globalFilter={globalFilter}
            emptyMessage="No existen clientes registrados."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              field="dni"
              header="Cédula"
              body={dniBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            >
            </Column>
            <Column
              field="name"
              header="Nombres"
              body={nameBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            >
            </Column>
            <Column
              field="surname"
              header="Apellidos"
              body={surnameBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            >
            </Column>
            <Column
              field="adress"
              header="Dirección"
              body={adressBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            >
            </Column>
            <Column
              field="phone"
              header="Teléfono"
              body={phoneBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            >
            </Column>
            <Column
              field="cellphone"
              header="Celular"
              body={cellphoneBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            >
            </Column>
            <Column
              field="email"
              header="E-mail"
              body={emailBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            >
            </Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={clienteDialog}
            style={{ width: "450px" }}
            header="Cliente"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="dni">Cédula</label>
              <InputText
                id="dni"
                value={cliente.dni}
                onChange={(e) => onInputChange(e, "dni")}
                required
                autoFocus
                maxLength="10"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                className={classNames({
                  "p-invalid": submitted && !cliente.dni,
                })}
              />
              {submitted && !cliente.dni && (
                <small className="p-invalid">
                  El número de cedula del cliente es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="name">Nombres</label>
              <InputText
                id="nombres"
                value={cliente.nombres}
                onChange={(e) => onInputChange(e, "nombres")}
                required
                onKeyPress={(event) => {
                  if (!/[A-Za-z]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                className={classNames({
                  "p-invalid": submitted && !cliente.nombres,
                })}
              />
              {submitted && !cliente.nombres && (
                <small className="p-invalid">
                  El nombre del cliente es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="surname">Apellidos</label>
              <InputText
                id="apellidos"
                value={cliente.apellidos}
                onChange={(e) => onInputChange(e, "apellidos")}
                required
                onKeyPress={(event) => {
                  if (!/[A-Za-z]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                className={classNames({
                  "p-invalid": submitted && !cliente.apellidos,
                })}
              />
              {submitted && !cliente.apellidos && (
                <small className="p-invalid">
                  El apellido del cliente es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="direccion">Dirección</label>
              <InputText
                id="direccion"
                value={cliente.direccion}
                onChange={(e) => onInputChange(e, "direccion")}
                required
                className={classNames({
                  "p-invalid": submitted && !cliente.direccion,
                })}
              />
              {submitted && !cliente.direccion && (
                <small className="p-invalid">
                  La dirección del cliente es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="telefono">Teléfono</label>
              <InputText
                id="telefono"
                value={cliente.telefono}
                onChange={(e) => onInputChange(e, "telefono")}
                required
                maxLength="9"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                className={classNames({
                  "p-invalid": submitted && !cliente.telefono,
                })}
              />
              {submitted && !cliente.telefono && (
                <small className="p-invalid">
                  El número de teléfono del cliente es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="telefono">Celular</label>
              <InputText
                id="celular"
                value={cliente.celular}
                onChange={(e) => onInputChange(e, "celular")}
                required
                maxLength="10"
                onKeyPress={(event) => {
                  if (!/[0-9]/.test(event.key)) {
                    event.preventDefault();
                  }
                }}
                className={classNames({
                  "p-invalid": submitted && !cliente.celular,
                })}
              />
              {submitted && !cliente.celular && (
                <small className="p-invalid">
                  El número de celular del cliente es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <InputText
                id="email"
                value={cliente.email}
                onChange={(e) => onInputChange(e, "email")}
                required
                className={classNames({
                  "p-invalid": submitted && !cliente.email,
                })}
              />
              {submitted && !cliente.email && (
                <small className="p-invalid">
                  La dirección e-mail del cliente es necesario.
                </small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductDialog}
            style={{ width: "450px" }}
            header="Verificación"
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteProductDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {cliente && (
                <span>
                  Está seguro de borrar el cliente <b>{cliente.nombres}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductsDialog}
            style={{ width: "450px" }}
            header="Confirm"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {cliente && <span>Está seguro de borrar estos clientes?</span>}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
export default React.memo(Cliente);
