import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProductService } from "../service/ProductService";

const Crud = () => {
  let emptyProduct = {
    id: null,
    nombre: "",
  };

  const [products, setProducts] = useState(null);
  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);
  const [product, setProduct] = useState(emptyProduct);
  const [selectedProducts, setSelectedProducts] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  useEffect(() => {
    const productService = new ProductService();
    productService.getProducts().then((data) => setProducts(data));
  }, []);

  const openNew = () => {
    setProduct(emptyProduct);
    setSubmitted(false);
    setProductDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };

  const hideDeleteProductDialog = () => {
    setDeleteProductDialog(false);
  };

  const hideDeleteProductsDialog = () => {
    setDeleteProductsDialog(false);
  };

  const saveProduct = () => {
    setSubmitted(true);
    const productService = new ProductService();

    if (product.nombre.trim()) {
      let _products = [...products];
      let _product = { ...product };
      if (product.id) {
        const index = findIndexById(product.id);

        _products[index] = _product;

        productService.putProvincia(product.id, _product);

        toast.current.show({
          severity: "success",
          summary: "Petición exitosa",
          detail: "Provincia actualizada",
          life: 3000,
        });
      } else {
        productService.postProvincia(_product);

        /*  _product.id = createId();
                _product.image = "product-placeholder.svg"; */
        _products.push(_product);
        toast.current.show({
          severity: "success",
          summary: "Petición exitosa",
          detail: "Provincia creada",
          life: 3000,
        });
      }

      setProducts(_products);
      setProductDialog(false);
      setProduct(emptyProduct);
    }
  };

  const editProduct = (product) => {
    setProduct({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setProduct(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = products.filter((val) => val.id !== product.id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);

    const prov = new ProductService();
    prov.deleteProvincia(product.id);
    toast.current.show({
      severity: "success",
      summary: "Petición exitosa",
      detail: "Provincia eliminada",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < products.length; i++) {
      if (products[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const deleteSelectedProducts = () => {
    let _products = products.filter((val) => !selectedProducts.includes(val));
    setProducts(_products);
    setDeleteProductsDialog(false);
    setSelectedProducts(null);
    toast.current.show({
      severity: "success",
      summary: "Petición exitosa",
      detail: "Provincia eliminada",
      life: 3000,
    });
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...product };
    _product[`${name}`] = val;

    setProduct(_product);
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
        {rowData.nombre}
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
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-warning mt-2"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </div>
    );
  };

  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
      <h5 className="m-0">Provincias</h5>
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
            value={products}
            selection={selectedProducts}
            onSelectionChange={(e) => setSelectedProducts(e.value)}
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
              field="name"
              header="Nombre de provincia"
              body={nameBodyTemplate}
              headerStyle={{ width: "86%", minWidth: "10rem" }}
            >
            </Column>
            <Column body={actionBodyTemplate}></Column>
          </DataTable>

          <Dialog
            visible={productDialog}
            style={{ width: "450px" }}
            header="Provincia"
            modal
            className="p-fluid"
            footer={productDialogFooter}
            onHide={hideDialog}
          >
            {product.image && (
              <img
                src={`assets/demo/images/product/${product.image}`}
                alt={product.image}
                width="150"
                className="mt-0 mx-auto mb-5 block shadow-2"
              />
            )}
            <div className="field">
              <label htmlFor="name">Nombre</label>
              <InputText
                id="nombre"
                value={product.nombre}
                onChange={(e) => onInputChange(e, "nombre")}
                required
                autoFocus
                className={classNames({
                  "p-invalid": submitted && !product.nombre,
                })}
              />
              {submitted && !product.nombre && (
                <small className="p-invalid">Se requiere el nombre de la provicia.</small>
              )}
            </div>
          </Dialog>

          <Dialog
            visible={deleteProductDialog}
            style={{ width: "450px" }}
            header="Confirmar"
            modal
            footer={deleteProductDialogFooter}
            onHide={hideDeleteProductDialog}
          >
            <div className="flex align-items-center justify-content-center">
              <i
                className="pi pi-exclamation-triangle mr-3"
                style={{ fontSize: "2rem" }}
              />
              {product && (
                <span>
                  Estas seguro de eliminar <b>{product.nombre}</b>?
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
              {product && (
                <span>
                  Are you sure you want to delete the selected products?
                </span>
              )}
            </div>
          </Dialog>
        </div>
      </div>
    </div>
  );
};

export default Crud;
