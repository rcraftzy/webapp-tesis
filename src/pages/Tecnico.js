import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { ProductService } from "../service/ProductService";
import { Dropdown } from "primereact/dropdown";

const Tecnico = () => {
  let emptyProduct = {
    id: 0,
    nombre: "",
    provincia: { id: null, nombre: "" },
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

  const [dropdownItem, setDropdownItem] = useState(null);
  const [dropdownItems, setDropdownItems] = useState(null);

  useEffect(() => {
    const productService = new ProductService();
    productService.getCuidad().then((data) => setProducts(data));
    productService.getProducts().then((data) => setDropdownItems(data));
  }, []);

  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

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

        productService.putCiudad(_product);

        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        productService.postCiudad({id: product.id, nombre: product.nombre, provincia: { id: dropdownItem.id, nombre: dropdownItem.nombre}});

        // _product.id = createId();
        // _product.image = "product-placeholder.svg";
        _products.push({id: product.id, nombre: product.nombre, provincia: { id: dropdownItem.id, nombre: dropdownItem.nombre}});
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
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
    const ciudad = ProductService();
    ciudad.deleteCiudad(product.id)
    let _products = products.filter((val) => val.id !== product.id);
    setProducts(_products);
    setDeleteProductDialog(false);
    setProduct(emptyProduct);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
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

const createId = () => {
  let id = "";
  let chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  for (let i = 0; i < 5; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return id;
};

const exportCSV = () => {
  dt.current.exportCSV();
};

const confirmDeleteSelected = () => {
  setDeleteProductsDialog(true);
};

const deleteSelectedProducts = () => {
  let _products = products.filter((val) => !selectedProducts.includes(val));
  setProducts(_products);
  setDeleteProductsDialog(false);
  setSelectedProducts(null);
  toast.current.show({
    severity: "success",
    summary: "Successful",
    detail: "Products Deleted",
    life: 3000,
  });
};

const onCategoryChange = (e) => {
  let _product = { ...product };
  _product["category"] = e.value;
  setProduct(_product);
};

const onInputChange = (e, name) => {
  const val = (e.target && e.target.value) || "";
  let _product = { ...product };
  _product[`${name}`] = val;

  setProduct(_product);
};

const onInputNumberChange = (e, name) => {
  const val = e.value || 0;
  let _product = { ...product };
  _product[`${name}`] = val;

  setProduct(_product);
};

const leftToolbarTemplate = () => {
  return (
    <React.Fragment>
      <div className="my-2">
        <Button
          label="Nuevo"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={openNew}
        />
      </div>
    </React.Fragment>
  );
};

const rightToolbarTemplate = () => {
  return (
    <React.Fragment>
      <FileUpload
        mode="basic"
        accept="image/*"
        maxFileSize={1000000}
        label="Import"
        chooseLabel="Import"
        className="mr-2 inline-block"
      />
      <Button
        label="Export"
        icon="pi pi-upload"
        className="p-button-help"
        onClick={exportCSV}
      />
    </React.Fragment>
  );
};

const codeBodyTemplate = (rowData) => {
  return (
    <>
      <span className="p-column-title">Code</span>
      {rowData.id}
    </>
  );
};

const nameBodyTemplate = (rowData) => {
  return (
    <>
      <span className="p-column-title">Ciudad</span>
      {rowData.nombre}
    </>
  );
};

const provinciaBodyTemplate = (rowData) => {
  return (
    <>
      <span className="p-column-title">Provincia</span>
      {rowData.provincia.nombre}
    </>
  );
};

const imageBodyTemplate = (rowData) => {
  return (
    <>
      <span className="p-column-title">Image</span>
      <img
        src={`assets/demo/images/product/${rowData.image}`}
        alt={rowData.image}
        className="shadow-2"
        width="100"
      />
    </>
  );
};

const priceBodyTemplate = (rowData) => {
  return (
    <>
      <span className="p-column-title">Price</span>
      {formatCurrency(rowData.price)}
    </>
  );
};

const categoryBodyTemplate = (rowData) => {
  return (
    <>
      <span className="p-column-title">Category</span>
      {rowData.category}
    </>
  );
};

const ratingBodyTemplate = (rowData) => {
  return (
    <>
      <span className="p-column-title">Reviews</span>
      <Rating value={rowData.rating} readonly cancel={false} />
    </>
  );
};

const statusBodyTemplate = (rowData) => {
  return (
    <>
      <span className="p-column-title">Status</span>
      <span
        className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}
      >
        {rowData.inventoryStatus}
      </span>
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
    <h5 className="m-0">Ciudades</h5>
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
      label="Yes"
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
      label="Yes"
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
          emptyMessage="No products found."
          header={header}
          responsiveLayout="scroll"
        >
          <Column selectionMode="multiple" headerStyle={{ width: "3rem" }}>
          </Column>
          <Column
            field="id"
            header="Id"
            body={codeBodyTemplate}
            headerStyle={{ width: "14%", minWidth: "10rem" }}
          >
          </Column>
          <Column
            field="nombre"
            header="Nombre Cuidad"
            body={nameBodyTemplate}
            headerStyle={{ width: "14%", minWidth: "10rem" }}
          >
          </Column>
          <Column
            field="nombre"
            header="Nombre Provincia"
            body={provinciaBodyTemplate}
            headerStyle={{ width: "14%", minWidth: "10rem" }}
          >
          </Column>
          <Column body={actionBodyTemplate}></Column>
        </DataTable>

        <Dialog
          visible={productDialog}
          style={{ width: "450px" }}
          header="Cuidad"
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
            <label htmlFor="name">Nombre Cuidad</label>
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
              <small className="p-invalid">
                El nombre de la ciudad es requerido.
              </small>
            )}
          </div>

          <div className="field col-12 md:col-6">
            <label htmlFor="state">Provincia</label>
            <Dropdown
              id="state"
              value={dropdownItem}
              onChange={(e) => setDropdownItem(e.value)}
              options={dropdownItems}
              optionLabel="nombre"
              placeholder="Select One"
            >
            </Dropdown>
          </div>
        </Dialog>

        <Dialog
          visible={deleteProductDialog}
          style={{ width: "450px" }}
          header="Confirm"
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
                Are you sure you want to delete <b>{product.name}</b>?
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

const comparisonFn = function (prevProps, nextProps) {
return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Tecnico, comparisonFn);
