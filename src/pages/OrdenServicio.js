import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";
import { Accordion, AccordionTab } from "primereact/accordion";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataView } from "primereact/dataview";

import { OrdenServicioService } from "../service/OrdenServicioService";
import { ClienteService } from "../service/ClienteService";
import { getTecnicos } from "../service/TecnicoService";
import { EstadoService } from "../service/EstadoService";
import { ProductoService } from "../service/ProductoService";

// Import for form
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";

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
    precio_unitario: 0,
    descuento: "0",
    porcentaje_IVA: 12,
    valor_IVA: 1.2,
    total: 0,
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

  const [ordenServicio, setOrdenServicio] = useState(emptyOrdenServicio);
  const [detalleOrdenServicio, setDetalleOrdenServicio] = useState(
    emptyOrdenServicio,
  );

  const [submitted, setSubmitted] = useState(false);
  const toast = useRef(null);

  const [dropdownValue, setDropdownValue] = useState(null);

  const [clientes, setClientes] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [tecnicos, setTecnicos] = useState(null);
  const [tecnico, setTecnico] = useState(null);
  const [estados, setEstados] = useState(null);
  const [estado, setEstado] = useState(null);
  const [productos, setProductos] = useState(null);
  const [producto, setProducto] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [ordenDialog, setOrdenDialog] = useState(false);

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

    getTecnicos().then((data) => setTecnicos(data));

    const estadoService = new EstadoService();
    estadoService.getEstados().then((data) => setEstados(data));

    const productoService = new ProductoService();
    productoService.getProductos().then((data) => setProductos(data));
  }, []);

  const getDetallesForOrden = async (id) => {
    const ordenServicioService = new OrdenServicioService();
    ordenServicioService.getDetallesO(id).then((data) =>
      setDetalleOrdenesServicio(data)
    );
  };

  const onProductSelect = (event) => {
    op2.current.hide();
    setCliente(event.data);
    toast.current.show({
      severity: "info",
      summary: "Cliente seleccionado",
      detail: event.data.nombres + " " + event.data.apellidos,
      life: 3000,
    });
  };
  const onTecnicoSelect = (event) => {
    op1.current.hide();
    setTecnico(event.data);
    toast.current.show({
      severity: "info",
      summary: "Técnico seleccionado",
      detail: event.data.nombre + " " + event.data.apellido,
      life: 3000,
    });
  };
  const onProductoSelect = (event) => {
    op1.current.hide();
    setProducto(event.data);
    toast.current.show({
      severity: "info",
      summary: "Producto seleccionado",
      detail: event.data.nombre,
      life: 3000,
    });
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

  const openNew = () => {
    setOrdenServicio(emptyOrdenServicio);
    setSubmitted(false);
    setProductDialog(true);
  };

  const openNewDetalle = () => {
    setDetalleOrdenServicio(emptyDetalleOrdenServicio);
    setSubmitted(false);
    setOrdenDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setProductDialog(false);
  };
  const hideDialogOrden = () => {
    setSubmitted(false);
    setOrdenDialog(false);
  };
  const saveOrden = () => {
    setSubmitted(true);
    const orden = new OrdenServicioService();

    if (ordenServicio.observaciones.trim()) {
      console.log("first if");
      let _ordenesServicio = [...ordenesServicio];
      let _ordenServicio = { ...ordenServicio };
      if (ordenServicio.id) {
        console.log("second if");
        const index = findIndexById(ordenServicio.id);

        _ordenesServicio[index] = _ordenServicio;

        orden.putProvincia(_ordenServicio);
        orden.putOrden(ordenServicio.id, {
          numOrden: "4",
          empresa_id: 1,
          cliente_id: cliente.id,
          fecha_emision: "2022-09-28",
          estado_orden_servicio_id: estado.id,
          sub_total_con_IVA: 0.0,
          sub_total_sin_IVA: 0.0,
          tecnico_id: tecnico.id,
          descuento: 0.0,
          valor_IVA: 12.0,
          total: 0.0,
          observaciones: ordenServicio.observaciones,
        });
        toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: "Orden se servicio actualizado",
          life: 3000,
        });
      } else {
        orden.postOrden({
          numero_orden: "4",
          empresa_id: 1,
          cliente_id: cliente.id,
          fecha_emision: "2022-05-03",
          estado_orden_servicio_id: estado.id,
          sub_total_con_IVA: 0.0,
          sub_total_sin_IVA: 0.0,
          tecnico_id: tecnico.id,
          descuento: 0.0,
          valor_IVA: 12.0,
          total: 0.0,
          observaciones: ordenServicio.observaciones,
        });

        toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: "Orden de servicio creado",
          life: 3000,
        });
      }
      setOrdenesServicio(_ordenesServicio);
      setProductDialog(false);
      setOrdenServicio(emptyOrdenServicio);
    }
  };

  const saveDetalle = () => {
    setSubmitted(true);
    const detalle = new OrdenServicioService();

    if (detalleOrdenServicio.descuento.trim()) {
      let _ordenesServicio = [...detalleOrdenesServicio];
      let _ordenServicio = { ...detalleOrdenServicio };
      if (detalleOrdenServicio.id) {
        const index = findIndexById(detalleOrdenServicio.id);

        _ordenesServicio[index] = _ordenServicio;

        toast.current.show({
          severity: "success",
          summary: "Successful",
          detail: "Product Updated",
          life: 3000,
        });
      } else {
        console.log(dropdownValue);
        detalle.postDetalle({
          orden_servicio_id: 1,
          cantidad: 1,
          producto_id: producto.id,
          descripcion: producto.nombre,
          precio_unitario: producto.precioVenta,
          descuento: parseFloat(detalleOrdenServicio.descuento),
          porcentaje_IVA: 12,
          valor_IVA: 1.2,
          total: 20,
          diagnostico_recepcion: "",
          diagnostico_tecnico: "",
          descripcion_diagnostico_tecnico: "",
          estado_orden_servcio_id: dropdownValue.id,
        });

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

  const leftToolbarTemplate = () => {
    return (
      <div>
        <Button
          label="Nuevo"
          type="button"
          icon="pi pi-plus"
          className="p-button-success mr-2"
          onClick={openNew}
          style={{ marginRight: ".25em" }}
        />
      </div>
    );
  };

  const ordenDialogFooter = (
    <>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        className="p-button-text"
        onClick={hideDialogOrden}
      />
      <Button
        label="Guardar"
        icon="pi pi-check"
        className="p-button-text"
        onClick={saveDetalle}
      />
    </>
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
        onClick={saveOrden}
      />
    </>
  );
  const Etiqueta = ({ children, data }) => {
    let background = {
      backgroundColor: `#${data.estado_orden_servicio.color}`,
      padding: "7px",
      borderRadius: "8px",
    };
    return <strong style={background}>{children}</strong>;
  };

  const editOrden = (orden) => {
    setOrdenServicio({ ...orden });
    setProductDialog(true);
  };

  const itemTemplate = (data) => {
    return (
      <div className="col-12">
        <div className="card border-1 surface-border">
          <div className="flex flex-column md:flex-row align-items-center w-full">
            <div className="flex-1 text-center md:text-left">
              <div>
                <i className="pi pi-hashtag" />
                <span>{data.numOrden}</span>
              </div>
              <div className="mt-2 mb-2">
                Técnico<span className="font-semibold m-2">
                  {`${data.tecnico.nombre} ${data.tecnico.apellido}`}
                </span>
              </div>
              <div className="mb-1">
                <i className="pi pi-calendar" />
                <span>{data.fecha_emision}</span>
              </div>
            </div>
            <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
              <Etiqueta data={data}>
                {data.estado_orden_servicio.state}
              </Etiqueta>

              <div className="mt-2 mb-2">
                <Button
                  icon="pi pi-pencil"
                  className="p-button-rounded p-button-success mr-2"
                  onClick={() => editOrden(data)}
                />
              </div>
            </div>
          </div>

          <Accordion>
            <AccordionTab header="Detalles">
              <DataTable
                value={detalleOrdenesServicio}
                responsiveLayout="scroll"
                rows={15}
              >
                <Column
                  field="codigo"
                  header="Código"
                  body={codigoBodyTemplate}
                  headerStyle={{ minWidth: "7rem" }}
                />
                <Column
                  field="descripcion"
                  header="Descripción"
                  headerStyle={{ minWidth: "14rem" }}
                />
                <Column
                  field="cantidad"
                  header="Cantidad"
                  headerStyle={{ minWidth: "7rem" }}
                />

                <Column
                  field="precio_unitario"
                  header="Precio Unitario"
                  headerStyle={{ minWidth: "8rem" }}
                />
                <Column
                  field="descuento"
                  header="Descuento"
                  headerStyle={{ minWidth: "7rem" }}
                />
                <Column
                  field="porcentaje_IVA"
                  header="% IVA"
                  headerStyle={{ minWidth: "8rem" }}
                />
                <Column
                  field="valor_IVA"
                  header="Valor IVA"
                  headerStyle={{ minWidth: "7rem" }}
                />
                <Column
                  field="total"
                  header="Total"
                  headerStyle={{ minWidth: "8rem" }}
                />
              </DataTable>
            </AccordionTab>
          </Accordion>
        </div>
      </div>
    );
  };
  const codigoBodyTemplate = (rowData) => (
    <>
      <span className="p-column-title">Código</span>
      {rowData.producto.codigo}
    </>
  );

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...ordenServicio };
    _product[`${name}`] = val;

    setOrdenServicio(_product);
  };
  const itemTecnico = (data) => {
    return ( 
    <div className="col-12">
        <div className="flex-1 text-center md:text-left">
          <div className="mb-3">
            <strong>Cedula:</strong>
            <span>{data.cedula}</span>
          </div>
          <div className="mb-3">
            <strong>Nombre:</strong>
            <span>{data.nombre}</span>
          </div>
            <div className="mb-3">
            <strong>Apellido:</strong>
            <span>{data.apellido}</span>
          </div>
          <div className="mb-3">
            <strong>Direccion:</strong>
            <span>{data.direccion}</span>
          </div>
          <div className="mb-3">
            <strong>Telefono:</strong>
            <span>{data.telefono}</span>
          </div>
          <div className="mb-3">
            <strong>Ciudad:</strong>
            <span>{data.ciudad.nombre}</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="grid crud-demo">
      <div className="col-12">
        <div className="card">
          <Toast ref={toast} />
          <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
          <DataView
            value={ordenesServicio}
            layout="grid"
            paginator
            rows={9}
            itemTemplate={itemTemplate}
          >
          </DataView>
        </div>
        <Dialog
          visible={productDialog}
          style={{ width: "1000px", minHeight: "100vh" }}
          header="Orden servicio"
          modal
          className="p-fluid"
          footer={productDialogFooter}
          onHide={hideDialog}
        >
          <div className="grid p-fluid">
            <div className="col-12 mb-2 lg:col-6 lg:mb-0">
              <div className="grid p-fluid">
                <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                  <h5>Técnico</h5>
                </div>
                <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                  <Button
                    type="button"
                    label="Seleccionar de técnico"
                    onClick={toggleDataTableTecnico}
                    className="p-button-success"
                  />
                </div>
                <DataView
                  value={tecnico}
                  layout="grid"
                  rows={4}
                  emptyMessage=" "
                  itemTemplate={itemTecnico}
                  />
              </div>
              <OverlayPanel
                ref={op1}
                appendTo={document.body}
                showCloseIcon
                id="overlay_panel_Tecnico"
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
                </DataTable>
              </OverlayPanel>
              <div className="grid p-fluid">
                <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                  <h5>Cliente</h5>
                </div>
                <div className="col-12 mb-2 lg:col-6 lg:mb-0">
                  <Button
                    type="button"
                    label="Seleccionar cliente"
                    onClick={toggleDataTable}
                    className="p-button-success"
                  />
                </div>
              </div>
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
                </DataTable>
              </OverlayPanel>
              <h5>Estado</h5>
              <Dropdown
                value={ordenServicio.estado_orden_servicio}
                onChange={(e) => setEstado(e.value)}
                options={estados}
                optionLabel="state"
                placeholder="Selecciona un estado"
              />
            </div>
            <div className="col-12 mb-2 lg:col-6 lg:mb-0">
              <h5>Observaciones</h5>
              <InputTextarea
                id="observaciones"
                value={ordenServicio.observaciones}
                onChange={(e) => onInputChange(e, "observaciones")}
                placeholder="Observaciones..."
                autoResize
                rows="3"
                cols="30"
              />
            </div>
          </div>

          <h5>Detalles de la orden</h5>
          <Button
            label="Nuevo"
            type="button"
            icon="pi pi-plus"
            className="p-button-success mr-2"
            onClick={openNewDetalle}
            style={{ marginRight: ".25em" }}
          />
          <DataTable
            value={detalleOrdenesServicio}
            responsiveLayout="scroll"
            paginator
            rows={5}
          >
            <Column
              field="codigo"
              header="Código"
              body={codigoBodyTemplate}
              headerStyle={{ minWidth: "7rem" }}
            />
            <Column
              field="descripcion"
              header="Descripción"
              headerStyle={{ minWidth: "14rem" }}
            />
            <Column
              field="cantidad"
              header="Cantidad"
              headerStyle={{ minWidth: "7rem" }}
            />

            <Column
              field="precio_unitario"
              header="Precio Unitario"
              headerStyle={{ minWidth: "8rem" }}
            />
            <Column
              field="descuento"
              header="Descuento"
              headerStyle={{ minWidth: "7rem" }}
            />
            <Column
              field="porcentaje_IVA"
              header="% IVA"
              headerStyle={{ minWidth: "8rem" }}
            />
            <Column
              field="valor_IVA"
              header="Valor IVA"
              headerStyle={{ minWidth: "7rem" }}
            />
            <Column
              field="total"
              header="Total"
              headerStyle={{ minWidth: "8rem" }}
            />
          </DataTable>
        </Dialog>
        <Dialog
          visible={ordenDialog}
          style={{ width: "550px" }}
          header="Detalle de orden"
          modal
          className="p-fluid"
          footer={ordenDialogFooter}
          onHide={hideDialogOrden}
        >
          <div className="field">
            <div className="grid p-fluid">
              <div className="col-12 md:col-6">
                <h5>Precio</h5>
                <div className="grid p-fluid">
                  {
                    /*
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
                    */
                  }
                  <div className="col-12 md:col-6">
                    <div className="p-inputgroup">
                      <InputText
                        id="descuento"
                        value={detalleOrdenServicio.descuento}
                        onChange={(e) => onInputChange(e, "descuento")}
                        autoFocus
                        placeholder="Descuento"
                        className={classNames({
                          "p-invalid": submitted &&
                            !detalleOrdenServicio.descuento,
                        })}
                      />
                      <span className="p-inputgroup-addon">%</span>
                    </div>
                  </div>

                  {
                    /*
                  <div className="col-12 md:col-6">
                    <div className="p-inputgroup">
                      <InputText placeholder="Total" disabled />
                      <span className="p-inputgroup-addon">$</span>
                    </div>
                  </div>
                    */
                  }
                </div>
              </div>

              <div className="col-12 md:col-6">
                {
                  /*
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
                  */
                }

                <h5>Producto</h5>
                <Button
                  type="button"
                  label="Seleccionar el producto"
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
                  </DataTable>
                </OverlayPanel>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default OrdenServicio;
