import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProductoService } from "../service/ProductoService";
import { InputSwitch } from "primereact/inputswitch";
import * as API from "../service/ProductoService";

const Producto = () => {
  let emptyTecnico = {
    id: null,
    codigo: "",
    nombre: "",
    precioVenta: "",
    stockMin: "0",
    stockMax: "0",
    stock: "",
    controlaStock: false,
    aplicaIva: false,
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
    },
  };

  const [productos, setProductos] = useState(null);
  const [productoDialog, setProductoDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [producto, setProducto] = useState(emptyTecnico);
  const [selectedProductos, setSelectedProductos] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const [aplicaIva, setAlicaIva] = useState(false);

  useEffect(() => {
    API.getProductos().then((data) => setProductos(data))
  },[]);
  const openNew = () => {
    setProducto(emptyTecnico);
    setSubmitted(false);
    setProductoDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductoDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);

    const productoService = new ProductoService();

    console.log(producto)
    if (producto.nombre.trim()) {
      let _products = [...productos];
      let _product = { ...producto };
      if (producto.id) {
        const index = findIndexById(producto.id);

        _products[index] = _product;

        productoService.putProducto(producto.id, {
          codigo: producto.codigo,
          nombre: producto.nombre,
          precioVenta: parseFloat(producto.precioVenta),
          stockMin: parseFloat(producto.stockMin),
          stockMax: parseFloat(producto.stockMax),
          stock: parseFloat(producto.stock),
          controlaStock: false,
          aplicaIva: aplicaIva,
          empresa_id: 1,
        });
        toast.current.show({
          severity: "success",
          summary: "Petición exitosa",
          detail: "Técnico actualizado",
          life: 3000,
        });
      } else {
        productoService.postProducto({
          codigo: producto.codigo,
          nombre: producto.nombre,
          precioVenta: parseFloat(producto.precioVenta),
          stockMin: parseFloat(producto.stockMin),
          stockMax: parseFloat(producto.stockMax),
          stock: parseFloat(producto.stock),
          controlaStock: false,
          aplicaIva: aplicaIva,
          empresa_id: 1,
        });
        _products.push(_product);
        toast.current.show({
          severity: "success",
          summary: "Petición exitosa",
          detail: "Técnico creado",
          life: 3000,
        });
      }

      setProductos(_products);
      setProductoDialog(false);
      setProducto(emptyTecnico);
    }
  };

  const editProduct = (product) => {
    setProducto({ ...product });
    setProductoDialog(true);
  };

  const deleteProduct = () => {
    let _products = productos.filter((val) => val.id !== producto.id);
    setProductos(_products);
    setDeleteProductDialog(false);
    setProducto(emptyTecnico);
    const producserv = new ProductoService();
    producserv.deleteProductos(producto.id);
    toast.current.show({
      severity: "success",
      summary: "Petición exitosa",
      detail: "Producto eliminado",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < productos.length; i++) {
      if (productos[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const deleteSelectedProducts = () => {
    let _products = productos.filter((val) => !selectedProductos.includes(val));
    setProductos(_products);
    setDeleteProductsDialog(false);
    setSelectedProductos(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Productos eliminados",
      life: 3000,
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...producto };
    _product[`${name}`] = val;

    setProducto(_product);
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
      <h5 className="m-0">Productos</h5>
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
  const ivaBodyTemplate = (rowData) => {
    if (rowData.aplicaIva) {
      return (
        <strong
          style={{
            background: "#c8e6c9",
            padding: "5px",
            borderRadius: "6px",
            color: "#25602e",
          }}
        >
          Si aplica
        </strong>
      );
    } else {
      return (
        <strong
          style={{
            background: "#ffcdd2",
            padding: "5px",
            borderRadius: "6px",
            color: "#d33937",
          }}
        >
          No aplica
        </strong>
      );
    }
  };

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

          <DataTable
            ref={dt}
            value={productos}
            selection={selectedProductos}
            onSelectionChange={(e) => setSelectedProductos(e.value)}
            dataKey="id"
            paginator
            rows={10}
            rowsPerPageOptions={[5, 10, 25]}
            className="datatable-responsive"
            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink"
            globalFilter={globalFilter}
            emptyMessage="Registros no encontrados."
            header={header}
            responsiveLayout="scroll"
          >
            <Column
              field="codigo"
              header="Código"
              headerStyle={{ width: "14%", minWidth: "7rem" }}
            >
            </Column>
            <Column
              field="nombre"
              header="Nombre"
              headerStyle={{ width: "34%", minWidth: "10rem" }}
            >
            </Column>
            <Column
              field="precioVenta"
              header="Precio de venta"
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            >
            </Column>
            <Column
              field="stock"
              header="Stock"
              headerStyle={{ width: "6%", minWidth: "5rem" }}
            >
            </Column>
            <Column
              field="aplicaIva"
              header="Aplica IVA"
              body={ivaBodyTemplate}
              headerStyle={{ width: "14%", minWidth: "10rem" }}
            >
            </Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={productoDialog}
            style={{ width: "400px" }}
            header="Producto"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            <div className="field">
              <label htmlFor="codigo">Código</label>
              <InputText
                id="codigo"
                value={producto.codigo}
                onChange={(e) => onInputChange(e, "codigo")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !producto.codigo,
                })}
              />
              {submitted && !producto.codigo && (
                <small className="p-invalid">
                  El código del producto es necesario.
                </small>
              )}
            </div>
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <InputText
                id="nombre"
                value={producto.nombre}
                onChange={(e) => onInputChange(e, "nombre")}
                required
                className={classNames({
                  "p-invalid": submitted && !producto.nombre,
                })}
              />
              {submitted && !producto.nombre && (
                <small className="p-invalid">
                  El nombre del producto es necesario.
                </small>
              )}
            </div>
            <div className="grid p-fluid">
              <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                <div className="field">
                  <label htmlFor="precioVenta">Precio de venta</label>
                  <div className="p-inputgroup">
                    <span className="p-float-label">
                      <InputText
                        id="precioVenta"
                        value={producto.precioVenta}
                        onChange={(e) => onInputChange(e, "precioVenta")}
                        required
                        className={classNames({
                          "p-invalid": submitted && !producto.precioVenta,
                        })}
                      />
                      {submitted && !producto.precioVenta && (
                        <small className="p-invalid">
                          El precio de venta es necesario.
                        </small>
                      )}
                      <span className="p-inputgroup-addon">$</span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                <div className="field">
                  <label htmlFor="stock">Stock</label>
                  <div className="p-inputgroup">
                    <span className="p-float-label">
                      <InputText
                        id="stock"
                        value={producto.stock}
                        onChange={(e) => onInputChange(e, "stock")}
                        required
                        className={classNames({
                          "p-invalid": submitted && !producto.stock,
                        })}
                      />
                      {submitted && !producto.stock && (
                        <small className="p-invalid">
                          El stock del producto es necesario.
                        </small>
                      )}
                    </span>
                  </div>
                </div>
              </div>
              <div className="col-12 mb-2 lg:col-4 lg:mb-0">
                <div className="field">
                  <label htmlFor="aplicaIva">Aplica IVA</label>
                  <br />
                  <InputSwitch
                    checked={aplicaIva}
                    onChange={(e) => setAlicaIva(e.value)}
                  />
                </div>
              </div>
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
              {producto && (
                <span>
                  Está seguro de borrar el producto <b>{producto.nombre}</b>?
                </span>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductsDialog}
            style={{ width: "450px" }}
            header="Verificación"
            modal
            footer={deleteProductsDialogFooter}
            onHide={hideDeleteProductsDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {producto && <span>Está seguro de borrar estos productos?</span>}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};
export default React.memo(Producto);
