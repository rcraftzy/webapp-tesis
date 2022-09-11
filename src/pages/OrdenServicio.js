import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { FileUpload } from "primereact/fileupload";
import { Rating } from "primereact/rating";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataView, DataViewLayoutOptions } from "primereact/dataview";

import { ProductService } from "../service/ProductService";
import { OrdenServicioService } from "../service/OrdenServicioService";
import { ClienteService } from "../service/ClienteService";
import { TecnicoService } from "../service/TecnicoService";
import { EstadoService } from "../service/EstadoService";
import { ProductoService } from "../service/ProductoService";

import { Tag } from 'primereact/tag';
// Import for form
import { InputTextarea } from "primereact/inputtextarea";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import { CountryService } from "../service/CountryService";
import { NodeService } from "../service/NodeService";

import { OverlayPanel } from "primereact/overlaypanel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

const OrdenServicio = () => {
  let emptyDetalleOrdenServicio = {
    id: null,
    orden_servicio: {},
    cantidad: null,
    producto: {},
    descripcion: "",
    precio_unitario: null,
    descuento: null,
    porcentaje_IVA: null,
    valor_IVA: null,
    total: null,
    diagnostico_recepcion: "",
    diagnostico_tecnico: "",
    descripcion_diagnostico_tecnico: "",
    estado_orden_servcio: {},
  };
  let emptyOrdenServicio = {
    id: null,
    numero_orden: "",
    empresa: {
      id: null,
      ruc: "",
      nombre: "",
      direccion: "",
      ciudad: "",
      telefono: "",
      email: "",
      porcentajeIVA: null,
    },
    cliente: {
      id: null,
      nombres: "",
      apellidos: "",
      dni: "",
      direccion: "",
      telefono: "",
      celular: "",
      email: "",
      estado: "",
    },
    fecha_emision: "",
    estado_orden_servicio: {
      id: null,
      state: "",
      empresa: {
        id: null,
        ruc: "",
        nombre: "",
        direccion: "",
        ciudad: "",
        telefono: "",
        email: "",
        porcentajeIVA: null,
      },
    },
    sub_total_con_IVA: "",
    sub_total_sin_IVA: "",
    tecnico: {
      id: null,
      cedula: null,
      nombre: "",
      apellido: "",
      email: "",
      telefono: "",
      direccion: "",
    },
    descuento: "",
    valor_IVA: "",
    total: "",
    observaciones: "",
  };

  const [ordenesServicio, setOrdenesServicio] = useState(null);
  const [detalleOrdenesServicio, setDetalleOrdenesServicio] = useState(null);

  const [productDialog, setProductDialog] = useState(false);
  const [deleteProductDialog, setDeleteProductDialog] = useState(false);
  const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

  const [sortOrder, setSortOrder] = useState(null);
  const [layout, setLayout] = useState("grid");
  const [sortField, setSortField] = useState(null);

  const [ordenServicio, setOrdenServicio] = useState(emptyOrdenServicio);
  const [detalleOrdenServicio, setDetalleOrdenServicio] = useState(
    emptyOrdenServicio,
  );

  const [selectedOrdenesServicio, setSelectedOrdenesServicio] = useState(null);
  const [selectedDetalleOrdenesServicio, setSelectedDetalleOrdenesServicio] =
    useState(null);

  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const [autoValue, setAutoValue] = useState(null);
  const [selectedAutoValue, setSelectedAutoValue] = useState(null);
  const [autoFilteredValue, setAutoFilteredValue] = useState([]);
  const [calendarValue, setCalendarValue] = useState(null);
  const [checkboxValue, setCheckboxValue] = useState([]);
  const [dropdownValue, setDropdownValue] = useState(null);
  const [treeSelectNodes, setTreeSelectNodes] = useState(null);

  const [clientes, setClientes] = useState(null);
  const [tecnicos, setTecnicos] = useState(null);
  const [estados, setEstados] = useState(null);
  const [productos, setProductos] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [selectedTecnico, setSelectedTecnico] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);
  const op2 = useRef(null);
  const op1 = useRef(null);
  const op3 = useRef(null);

  useEffect(() => {
    const ordenServicioService = new OrdenServicioService();
    ordenServicioService.getOrdenes().then((data) => setOrdenesServicio(data));
    ordenServicioService.getDetalles().then((data) =>
      setDetalleOrdenesServicio(data)
    );

    const clienteService = new ClienteService();
    clienteService.getClientes().then((data) => setClientes(data));

    const tecnicoService = new TecnicoService();
    tecnicoService.getTecnicos().then((data) => setTecnicos(data));

    const estadoService = new EstadoService();
    estadoService.getEstados().then((data) => setEstados(data));

    const productoService = new ProductoService();
    productoService.getProductos().then((data) => setProductos(data));

    const countryService = new CountryService();
    const nodeService = new NodeService();
    countryService.getCountries().then((data) => setAutoValue(data));
    nodeService.getTreeNodes().then((data) => setTreeSelectNodes(data));
  }, []);

  const onProductSelect = (event) => {
    op2.current.hide();
    toast.current.show({
      severity: "info",
      summary: "Product Selected",
      detail: event.data.name,
      life: 3000,
    });
  };
  const onTecnicoSelect = (event) => {
    op1.current.hide();
    toast.current.show({
      severity: "info",
      summary: "Product Selected",
      detail: event.data.name,
      life: 3000,
    });
  };
  const onProductoSelect = (event) => {
    op1.current.hide();
    toast.current.show({
      severity: "info",
      summary: "Product Selected",
      detail: event.data.name,
      life: 3000,
    });
  };
  const searchCountry = (event) => {
    setTimeout(() => {
      if (!event.query.trim().length) {
        setAutoFilteredValue([...autoValue]);
      } else {
        setAutoFilteredValue(
          autoValue.filter((country) => {
            return country.name.toLowerCase().startsWith(
              event.query.toLowerCase(),
            );
          }),
        );
      }
    }, 250);
  };

  const menubarEndTemplate = () => {
    return (
      <span className="p-input-icon-left">
        <i className="pi pi-search" />
        <InputText type="text" placeholder="Search" />
      </span>
    );
  };
  const toggleDataTable = (event) => {
    op2.current.toggle(event);
  };
  const toggleDataTableTecnico = (event) => {
    op1.current.toggle(event);
  };
  const toggleDataTableProducto = (event) => {
    op3.current.toggle(event);
  };
  const formatCurrency = (value) => {
    return value.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const openNew = () => {
    setOrdenServicio(emptyOrdenServicio);
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

    if (ordenServicio.nombre.trim()) {
      let _ordenesServicio = [...ordenesServicio];
      let _ordenServicio = { ...ordenServicio };
      if (ordenServicio.id) {
        const index = findIndexById(ordenServicio.id);

        _ordenesServicio[index] = _ordenServicio;

        productService.putProvincia(_ordenServicio);

        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        productService.postProvincia(_ordenServicio);

        /*  _product.id = createId();
                _product.image = "product-placeholder.svg"; */
        _ordenesServicio.push(_ordenServicio);
        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Created",
          life: 3000,
        });
      }

      setOrdenesServicio(_ordenesServicio);
      setProductDialog(false);
      setOrdenServicio(emptyOrdenServicio);
    }
  };

  const editProduct = (product) => {
    setOrdenServicio({ ...product });
    setProductDialog(true);
  };

  const confirmDeleteProduct = (product) => {
    setOrdenServicio(product);
    setDeleteProductDialog(true);
  };

  const deleteProduct = () => {
    let _products = ordenesServicio.filter((val) =>
      val.id !== ordenServicio.id
    );
    setOrdenesServicio(_products);
    setDeleteProductDialog(false);
    setOrdenServicio(emptyOrdenServicio);

    const prov = new ProductService();
    prov.deleteProvincia(ordenesServicio.id);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Product Deleted",
      life: 3000,
    });
  };

  const findIndexById = (id) => {
    let index = -1;
    for (let i = 0; i < ordenesServicio.length; i++) {
      if (ordenesServicio[i].id === id) {
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
    let _ordenesServicio = ordenesServicio.filter((val) =>
      !selectedOrdenesServicio.includes(val)
    );
    setOrdenesServicio(_ordenesServicio);
    setDeleteProductsDialog(false);
    setSelectedOrdenesServicio(null);
    toast.current.show({
      severity: "success",
      summary: "Successful",
      detail: "Products Deleted",
      life: 3000,
    });
  };

  const onCategoryChange = (e) => {
    let _product = { ...ordenServicio };
    _product["category"] = e.value;
    setOrdenServicio(_product);
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...ordenServicio };
    _product[`${name}`] = val;

    setOrdenServicio(_product);
  };

  const onInputNumberChange = (e, name) => {
    const val = e.value || 0;
    let _product = { ...ordenServicio };
    _product[`${name}`] = val;

    setOrdenServicio(_product);
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
  const dataviewListItem = (data) => {
    return (
      <div className="col-12">
        <div className="card m-3 border-1 surface-border">
          <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
            <div className="flex-1 text-center md:text-left">
              <div>
                <i className="pi pi-hashtag" />
                <span>{data.orden_servicio.numOrden}</span>
              </div>
              <div className="mt-2 mb-2">
                Técnico<span className="font-semibold m-2">
                  {`${data.orden_servicio.tecnico.nombre} ${data.orden_servicio.tecnico.apellido}`}
                </span>
              </div>
              <div className="mb-3">
                <i className="pi pi-calendar" />
                <span>{data.orden_servicio.fecha_emision}</span>
              </div>
            </div>
            <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
              <Tag className="mr-2" severity={`${data.orden_servicio.estado_orden_servicio.state == 'En proceso' ? "warning" : ""}`} value={data.orden_servicio.estado_orden_servicio.state}/>
              <span className="p-buttonset">
                <Button label="Editar" icon="pi pi-pencil" />
                <Button label="Eliminar" icon="pi pi-trash" />
              </span>
            </div>
          </div>

          <Accordion>
            <AccordionTab header="Detalles">
              <section>
                <article>
                  <strong>Descripción:</strong>
                  <p></p>
                </article>
                <article>
                  <strong>Diagnostico en recepcion:</strong>
                  <p></p>
                </article>
                <article>
                  <strong>Diagnostico Tecnico:</strong>
                  <p></p>
                </article>
                <article>
                  <strong>Descripción:</strong>
                  <p></p>
                </article>
                <article>
                  <strong>Productos:</strong>
                  <p></p>
                </article>
                <article>
                  <strong>Precio unitario:</strong>23
                </article>
                <article>
                  <strong>Cantidad:</strong>
                </article>
                <article>
                  <strong>Descuento:</strong>
                </article>
                <article>
                  <strong>Porcentaje IVA:</strong>
                </article>
                <article>
                  <strong>Total IVA:</strong>
                </article>
                <article>
                  <strong>Total:</strong>
                </article>
              </section>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
    );
  };
  const itemTemplate = (data) => {
    return dataviewListItem(data);
  };

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
          <DataView
            value={detalleOrdenesServicio}
            layout={layout}
            paginator
            rows={9}
            sortOrder={sortOrder}
            sortField={sortField}
            itemTemplate={itemTemplate}
          >
          </DataView>
        </div>
        <Dialog
          visible={productDialog}
          style={{ width: "850px" }}
          header="Orden servicio"
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
        >
          {ordenServicio.image && (
            <img
              src={`assets/demo/images/product/${ordenServicio.image}`}
              alt={ordenServicio.image}
              width="150"
              className="mt-0 mx-auto mb-5 block shadow-2"
            />
          )}
          <div className="field">
            <div className="grid p-fluid">
              <div className="col-12 md:col-6">
                <div className="card">
                  <h5>Cliente</h5>
                  <Button
                    type="button"
                    label="DataTable"
                    onClick={toggleDataTable}
                    className="p-button-success"
                  />
                  <OverlayPanel
                    ref={op2}
                    appendTo={document.body}
                    showCloseIcon
                    id="overlay_panel"
                    style={{ width: "450px" }}
                  >
                    <DataTable
                      value={clientes}
                      selection={selectedProduct}
                      onSelectionChange={(e) => setSelectedProduct(e.value)}
                      selectionMode="single"
                      responsiveLayout="scroll"
                      paginator
                      rows={5}
                      onRowSelect={onProductSelect}
                    >
                      <Column
                        field="dni"
                        header="Cedula"
                        sortable
                        headerStyle={{ minWidth: "10rem" }}
                      />
                      <Column
                        field="nombres"
                        header="Nombres"
                        sortable
                        headerStyle={{ minWidth: "10rem" }}
                      />
                      <Column
                        field="apellidos"
                        header="Apellidos"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />

                      <Column
                        field="celular"
                        header="Celular"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />
                      <Column
                        field="telefono"
                        header="Telefono"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />
                      <Column
                        field="email"
                        header="E-mail"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />
                      <Column
                        field="direccion"
                        header="Direccion"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />
                    </DataTable>
                  </OverlayPanel>

                  <h5>Tecnico</h5>
                  <Button
                    type="button"
                    label="DataTable"
                    onClick={toggleDataTableTecnico}
                    className="p-button-success"
                  />
                  <OverlayPanel
                    ref={op1}
                    appendTo={document.body}
                    showCloseIcon
                    id="overlay_panel"
                    style={{ width: "450px" }}
                  >
                    <DataTable
                      value={tecnicos}
                      selection={selectedTecnico}
                      onSelectionChange={(e) => setSelectedTecnico(e.value)}
                      selectionMode="single"
                      responsiveLayout="scroll"
                      paginator
                      rows={5}
                      onRowSelect={onTecnicoSelect}
                    >
                      <Column
                        field="cedula"
                        header="Cedula"
                        sortable
                        headerStyle={{ minWidth: "10rem" }}
                      />
                      <Column
                        field="nombre"
                        header="Nombres"
                        sortable
                        headerStyle={{ minWidth: "10rem" }}
                      />
                      <Column
                        field="apellido"
                        header="Apellidos"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />

                      <Column
                        field="celular"
                        header="Celular"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />
                      <Column
                        field="telefono"
                        header="celular"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />
                      <Column
                        field="email"
                        header="E-mail"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />
                      <Column
                        field="direccion"
                        header="Direccion"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />
                    </DataTable>
                  </OverlayPanel>
                  <h5>Estado</h5>
                  <Dropdown
                    value={dropdownValue}
                    onChange={(e) => setDropdownValue(e.value)}
                    options={estados}
                    optionLabel="state"
                    placeholder="Selecciona un estado"
                  />
                  <h5>Precio</h5>
                  <div className="grid p-fluid">
                    <div className="col-12 md:col-6">
                      <div className="p-inputgroup">
                        <span className="p-float-label">
                          <InputText placeholder="Sub total sin IVA" />
                          <span className="p-inputgroup-addon">$</span>
                        </span>
                      </div>
                    </div>

                    <div className="col-12 md:col-6">
                      <div className="p-inputgroup">
                        <InputText placeholder="Valor IVA" />
                        <span className="p-inputgroup-addon">%</span>
                      </div>
                    </div>

                    <div className="col-12 md:col-6">
                      <div className="p-inputgroup">
                        <InputText placeholder="Sub total sin IVA" />
                        <span className="p-inputgroup-addon">$</span>
                      </div>
                    </div>

                    <div className="col-12 md:col-6">
                      <div className="p-inputgroup">
                        <InputText placeholder="Descuento" />
                        <span className="p-inputgroup-addon">%</span>
                      </div>
                    </div>

                    <div className="col-12 md:col-6">
                      <div className="p-inputgroup">
                        <InputText placeholder="Total" disabled />
                        <span className="p-inputgroup-addon">$</span>
                      </div>
                    </div>
                  </div>

                  <h5>Observaciones</h5>
                  <InputTextarea
                    placeholder="Observacion..."
                    autoResize
                    rows="3"
                    cols="30"
                  />

                  <h5>Fecha de emision</h5>
                  <Calendar
                    showIcon
                    showButtonBar
                    value={calendarValue}
                    onChange={(e) => setCalendarValue(e.value)}
                  >
                  </Calendar>
                </div>
              </div>

              <div className="col-12 md:col-6">
                <div className="card">
                  <h5>Diagnostico en recepción</h5>
                  <InputTextarea
                    placeholder="Decripcion del cliente..."
                    autoResize
                    rows="3"
                    cols="30"
                  />
                  <h5>Diagnostico del tecnico</h5>
                  <InputTextarea
                    placeholder="Observaciones..."
                    autoResize
                    rows="3"
                    cols="30"
                  />
                  <h5>Descripcion del diagnostico tecnico</h5>
                  <InputTextarea
                    placeholder="Descripcion..."
                    autoResize
                    rows="3"
                    cols="30"
                  />

                  <h5>Producto</h5>
                  <Button
                    type="button"
                    label="DataTable"
                    onClick={toggleDataTableProducto}
                    className="p-button-success"
                  />
                  <OverlayPanel
                    ref={op3}
                    appendTo={document.body}
                    showCloseIcon
                    id="overlay_panel"
                    style={{ width: "450px" }}
                  >
                    <DataTable
                      value={productos}
                      selection={selectedProducto}
                      onSelectionChange={(e) => setSelectedProducto(e.value)}
                      selectionMode="single"
                      responsiveLayout="scroll"
                      paginator
                      rows={5}
                      onRowSelect={onProductoSelect}
                    >
                      <Column
                        field="cedula"
                        header="Cedula"
                        sortable
                        headerStyle={{ minWidth: "10rem" }}
                      />
                      <Column
                        field="nombre"
                        header="Nombres"
                        sortable
                        headerStyle={{ minWidth: "10rem" }}
                      />
                      <Column
                        field="apellido"
                        header="Apellidos"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />

                      <Column
                        field="celular"
                        header="Celular"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />
                      <Column
                        field="telefono"
                        header="celular"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />
                      <Column
                        field="email"
                        header="E-mail"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />
                      <Column
                        field="direccion"
                        header="Direccion"
                        sortable
                        headerStyle={{ minWidth: "8rem" }}
                      />
                    </DataTable>
                  </OverlayPanel>
                </div>
              </div>
            </div>
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
            {ordenServicio && (
              <span>
                Are you sure you want to delete <b>{ordenServicio.nombre}</b>?
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
            {ordenServicio && (
              <span>
                Are you sure you want to delete the selected products?
              </span>
            )}
          </div>
        </Dialog>
      </div>
    </div>
  );
};

const comparisonFn = function (prevProps, nextProps) {
  return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(OrdenServicio, comparisonFn);
