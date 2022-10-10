import React, { useEffect, useRef, useState } from "react";
import classNames from "classnames";

import { Accordion, AccordionTab } from "primereact/accordion";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { DataView } from "primereact/dataview";
import { InputTextarea } from "primereact/inputtextarea";
import { Dropdown } from "primereact/dropdown";
import { OverlayPanel } from "primereact/overlaypanel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

import { OrdenServicioService } from "../service/OrdenServicioService";
import { ClienteService } from "../service/ClienteService";
import { getTecnicos } from "../service/TecnicoService";
import { EstadoService } from "../service/EstadoService";
import { ProductoService } from "../service/ProductoService";
import {
  emptyCliente,
  emptyDetalleOrdenServicio,
  emptyOrdenServicio,
  emptyProducto,
  emptyTecnico,
} from "../service/emptyServie";

const OrdenServicio = () => {
  
  const [clientes, setClientes] = useState(null);
  const [cliente, setCliente] = useState(null);
  const [tecnicos, setTecnicos] = useState(null);
  const [tecnico, setTecnico] = useState(null);
  const [estados, setEstados] = useState(null);
  const [estado, setEstado] = useState(null);
  const [productos, setProductos] = useState(null);
  const [producto, setProducto] = useState(null);
  const [ordenesServicio, setOrdenesServicio] = useState([]);
  const [ordenServicio, setOrdenServicio] = useState(emptyOrdenServicio);
  const [detalleOrdenesServicio, setDetalleOrdenesServicio] = useState([]);
  const [detalleOrdenServicio, setDetalleOrdenServicio] = useState(
    emptyDetalleOrdenServicio,
  );
  const [ordenId, setOrdenId] = useState({id: null});
  const [realationOrden, setRelationOrden] = useState([])

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedTecnico, setSelectedTecnico] = useState(null);
  const [selectedProducto, setSelectedProducto] = useState(null);

  const [globalFilter, setGlobalFilter] = useState(null);

  const [productDialog, setProductDialog] = useState(false);
  const [ordenDialog, setOrdenDialog] = useState(false);

  const [submitted, setSubmitted] = useState(false);

  const toast = useRef(null);
  const op1 = useRef(null);
  const op2 = useRef(null);
  const op3 = useRef(null);

  useEffect(() => {
    const ordenServicioService = new OrdenServicioService();
    ordenServicioService.getOrdenes().then((data) => setOrdenesServicio(data));

    const clienteService = new ClienteService();
    clienteService.getClientes().then((data) => setClientes(data));

    getTecnicos().then((data) => setTecnicos(data));

    const estadoService = new EstadoService();
    estadoService.getEstados().then((data) => setEstados(data));

    const productoService = new ProductoService();
    productoService.getProductos().then((data) => setProductos(data));
  }, []);

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
    op3.current.hide();
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
    setRelationOrden([])
    setTecnico(emptyTecnico);
    setCliente(emptyCliente);
    setSelectedTecnico(null)
    setSelectedProduct(null)
    setEstado(null);
    setProducto(emptyProducto);
    setSubmitted(false);
    setProductDialog(true);
  };

  const openNewDetalle = () => {
    setDetalleOrdenServicio(emptyDetalleOrdenServicio);
    setSelectedProducto(null)
    setProducto(emptyProducto);
    setOrdenId(ordenServicio.id)
    setEstado(ordenServicio.estado_orden_servicio);
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
      let _ordenesServicio = [...ordenesServicio];
      let _ordenServicio = { ...ordenServicio };
      if (ordenServicio.id) {
        const index = findIndexById(ordenServicio.id);

        _ordenesServicio[index] = _ordenServicio;

        orden.putOrden(ordenServicio.id, {
          numOrden: "1",
          empresa_id: 1,
          cliente_id: cliente.id,
          fecha_emision: "2022-10-11",
          estado_orden_servicio_id: estado.id,
          sub_total_con_IVA: 0.0,
          sub_total_sin_IVA: 0.0,
          tecnico_id: tecnico.id,
          descuento: 0.0,
          valor_IVA: 12.0,
          total: 0.0,
          observaciones: ordenServicio.observaciones,
          diagnostico_recepcion: ordenServicio.diagnostico_recepcion,
          diagnostico_tecnico: ordenServicio.diagnostico_tecnico,
        });
        toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: "Orden se servicio actualizado",
          life: 3000,
        });
      } else {
        orden.postOrden({
          numeOrden: ordenServicio.id,
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
          diagnostico_recepcion: ordenServicio.diagnostico_recepcion,
          diagnostico_tecnico: ordenServicio.diagnostico_tecnico,
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
    if (detalleOrdenServicio.cantidad.trim()) {
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
        detalle.postDetalle({
          orden_servicio_id: ordenId,
          cantidad: parseFloat(detalleOrdenServicio.cantidad),
          producto_id: producto.id,
          descripcion: producto.nombre,
          precio_unitario: producto.precioVenta,
          descuento: 12,
          porcentaje_IVA: 12,
          valor_IVA: 1.2,
          total: 20,
          diagnostico_recepcion: "",
          diagnostico_tecnico: "",
          estado_orden_servicio_id: estado.id,
        }).then((res) => {
            if(res === 401){
            }else{
              _ordenesServicio.push(res.data);
              setDetalleOrdenesServicio(_ordenesServicio);
              setRelationOrden(_ordenesServicio)
            }
          });
        toast.current.show({
          severity: "success",
          summary: "Exito",
          detail: "Detalle de la orden agregado",
          life: 3000,
        });
      }
      setOrdenDialog(false);
      setDetalleOrdenServicio(emptyDetalleOrdenServicio);
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
  const header = (
    <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
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
    const newValues = detalleOrdenesServicio.filter(detalle => detalle.orden_servicio.id === orden.id);
    setRelationOrden(newValues)
    setTecnico(orden.tecnico);
    setSelectedTecnico(orden.tecnico)
    setCliente(orden.cliente);
    setSelectedProduct(orden.cliente)
    setEstado(orden.estado_orden_servicio);
    setProductDialog(true);
  };

  const itemTemplate = (data) => {
    const newValues = detalleOrdenesServicio.filter(detalle => detalle.orden_servicio.id === data.id);
    const total = newValues.reduce((accumulator, current) => accumulator + current.total, 0);
    const descuento = newValues.reduce((accumulator, current) => accumulator + current.descuento, 0);
    const valor_IVA = newValues.reduce((accumulator, current) => accumulator + current.valor_IVA, 0);

     const sub_total_sin_IVA = newValues.filter(({valor_IVA}) => valor_IVA === 0)
    .reduce((accumulator, current) => accumulator + current.total, 0)
    
     const sub_total_con_IVA = newValues.filter(({valor_IVA}) => valor_IVA > 0)
    .reduce((accumulator, current) => accumulator + current.total, 0)
    return (
      <div className="col-12">
        <div className="card border-1 surface-border">
          <div className="flex flex-column md:flex-row align-items-center w-full">
            <div className="flex-1 text-center md:text-left">
              <div>
                <i className="pi pi-hashtag" />
                <span>{data.id}</span>
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
                value={newValues}
                responsiveLayout="scroll"
                emptyMessage="No se encontraron registros."
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
                  body={totalBodyTemplate}
                  headerStyle={{ minWidth: "8rem" }}
                />
              </DataTable>
              <br />

              <div className="grid">
                <div className="col-12 lg:col-8">
                  <div className="card border-1 surface-border">
                    <strong>Diagnostico en técnico:</strong>
                    <p>{data.diagnostico_tecnico}</p>
                  </div>
                  <div className="card border-1 surface-border">
                    <strong>Diagnostico en recepción:</strong>
                    <p>{data.diagnostico_recepcion}</p>
                  </div>
                </div>
                <div className="col-12 lg:col-4">
                  <div className="card border-1 surface-border">
                    <div>
                      <strong>Descuento:</strong>
                      <span>&nbsp;{descuento}</span>
                      <div>
                        <strong>Total IVA:</strong>
                        <span>&nbsp;{valor_IVA}</span>
                      </div>
                    </div>
                    <strong>Sub total sin IVA:</strong>
                    <span>&nbsp;{sub_total_sin_IVA}</span>
                    <div>
                      <strong>Sub total con IVA:</strong>
                      <span>&nbsp;{sub_total_con_IVA}</span>
                    </div>
                    <hr />
                    <strong>Total:</strong>
                    <span>&nbsp;{total}$</span>
                  </div>
                </div>
              </div>
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
  const totalBodyTemplate = (rowData) => {
    const totalWithCantidad = rowData.precio_unitario*rowData.cantidad
    const initialDiscount = (rowData.descuento/100)*totalWithCantidad
    const discount = rowData.precio_unitario-initialDiscount
    const iva = rowData.porcentaje_IVA
    const total = discount
    return(
    <>
      <span className="p-column-title">Código</span>
      {total}
    </>
    )
  }

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...ordenServicio };
    _product[`${name}`] = val;

    setOrdenServicio(_product);
  };
  const onInputChangeDetalle = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _product = { ...detalleOrdenServicio };
    _product[`${name}`] = val;

    setDetalleOrdenServicio(_product);
  };

  const itemTemplateProducto = (data) => {
    return (
      <div className="col-12">
        <div className="flex-1 text-center md:text-left">
          <div className="mb-3 ml-3">
            <strong>Código:</strong>
            <span>&nbsp;{data.codigo}</span>
          </div>
          <div className="mb-3 ml-3">
            <strong>Descripcion:</strong>
            <span>&nbsp;{data.nombre}</span>
          </div>
          <div className="mb-3 ml-3">
            <strong>Precio de venta:</strong>
            <span>&nbsp;{data.precioVenta}</span>
          </div>
        </div>
      </div>
    );
  };

  const itemCliente = (data) => {
    return (
      <div className="col-12">
        <div className="flex-1 text-center md:text-left">
          <div className="mb-3 ml-3">
            <strong>Cédula:</strong>
            <span>&nbsp;{data.dni}</span>
          </div>
          <div className="mb-3 ml-3">
            <strong>Nombre:</strong>
            <span>&nbsp;{data.nombres}</span>
          </div>
          <div className="mb-3 ml-3">
            <strong>Apellido:</strong>
            <span>&nbsp;{data.apellidos}</span>
          </div>
          <div className="mb-3 ml-3">
            <strong>Dirección:</strong>
            <span>&nbsp;{data.direccion}</span>
          </div>
          <div className="mb-3 ml-3">
            <strong>Teléfono:</strong>
            <span>&nbsp;{data.telefono}</span>
          </div>
          <div className="mb-3 ml-3">
            <strong>E-mail:</strong>
            <span>&nbsp;{data.email}</span>
          </div>
        </div>
      </div>
    );
  };
  const itemTecnico = (data) => {
    return (
      <div className="col-12">
        <div className="flex-1 text-center md:text-left">
          <div className="mb-3 ml-3">
            <strong>Cédula:</strong>
            <span>&nbsp;{data.cedula}</span>
          </div>
          <div className="mb-3 ml-3">
            <strong>Nombre:</strong>
            <span>&nbsp;{data.nombre}</span>
          </div>
          <div className="mb-3 ml-3">
            <strong>Apellido:</strong>
            <span>&nbsp;{data.apellido}</span>
          </div>
          <div className="mb-3 ml-3">
            <strong>Dirección:</strong>
            <span>&nbsp;{data.direccion}</span>
          </div>
          <div className="mb-3 ml-3">
            <strong>Teléfono:</strong>
            <span>&nbsp;{data.telefono}</span>
          </div>
          <div className="mb-3 ml-3">
            <strong>Ciudad:</strong>
            <span>&nbsp;{data.ciudad.nombre}</span>
          </div>
        </div>
      </div>
    );
  };

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
                    label="Seleccionar técnico"
                    onClick={toggleDataTableTecnico}
                    className="p-button-success"
                  />
                </div>
                <DataView
                  value={[tecnico]}
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
                  globalFilter={globalFilter}
                  header={header}
                >
                  <Column
                    field="cedula"
                    header="Cédula"
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
              <h5>Estado</h5>
              <Dropdown
                value={estado}
                onChange={(e) => setEstado(e.value)}
                options={estados}
                optionLabel="state"
                placeholder="Selecciona un estado"
              />
              <h5>Diagnostico técnico</h5>
              <InputTextarea
                id="diagnostico_tecnico"
                value={ordenServicio.diagnostico_tecnico}
                onChange={(e) => onInputChange(e, "diagnostico_tecnico")}
                placeholder="Diagnostico..."
                autoResize
                rows="5"
                cols="30"
              />
            </div>
            <div className="col-12 mb-2 lg:col-6 lg:mb-0">
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
                {cliente && (
                  <DataView
                    value={[cliente]}
                    layout="grid"
                    rows={4}
                    emptyMessage=" "
                    itemTemplate={itemCliente}
                  />
                )}
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
                  header={header}
                  globalFilter={globalFilter}
                >
                  <Column
                    field="dni"
                    header="Cédula"
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
              <h5>Diagnostico en recepción</h5>
              <InputTextarea
                id="diagnostico_recepcion"
                value={ordenServicio.diagnostico_recepcion}
                onChange={(e) => onInputChange(e, "diagnostico_recepcion")}
                placeholder="Observaciones..."
                autoResize
                rows="3"
                cols="30"
              />
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
            value={realationOrden}
            responsiveLayout="scroll"
            emptyMessage="No se encontraron registros."
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
              body={totalBodyTemplate}
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
                <h5>Producto</h5>
              </div>
              <div className="col-12 md:col-6">
                <Button
                  type="button"
                  label="Seleccionar el producto"
                  onClick={toggleDataTableProducto}
                  className="p-button-success"
                />
              </div>
            </div>
            {producto && (
              <DataView
                value={[producto]}
                layout="grid"
                rows={9}
                itemTemplate={itemTemplateProducto}
              >
              </DataView>
            )}
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
                globalFilter={globalFilter}
                header={header}
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
          <div className="field">
            <div className="col-12 md:col-6">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="cantidad">
                    <strong>Cantidad:&nbsp;</strong>
                  </label>
                </span>
                <span className="p-float-label">
                  <InputText
                    id="cantidad"
                    value={detalleOrdenServicio.cantidad}
                    onChange={(e) => onInputChangeDetalle(e, "cantidad")}
                    required
                    pattern="[0-9]+"
                    className={classNames({
                      "p-invalid": submitted && !detalleOrdenServicio.cantidad,
                    })}
                  />
                  {submitted && !detalleOrdenServicio.cantidad && (
                    <small className="p-invalid">
                      El precio de venta es necesario.
                    </small>
                  )}
                </span>
              </div>
            </div>
          </div>
          <div className="field">
            <div className="col-12 md:col-6">
              <div className="p-inputgroup">
                <span className="p-inputgroup-addon">
                  <label htmlFor="Descuento">
                    <strong>Descuento:&nbsp;</strong>
                  </label>
                </span>
                <span className="p-float-label">
                  <InputText
                    id="descuento"
                    value={detalleOrdenServicio.descuento}
                    onChange={(e) => onInputChangeDetalle(e, "descuento")}
                    required
                    mode="decimal"
                    className={classNames({
                      "p-invalid": submitted && !detalleOrdenServicio.descuento,
                    })}
                  />
                  <span className="p-inputgroup-addon">%</span>
                  {submitted && !detalleOrdenServicio.descuento && (
                    <small className="p-invalid">
                      <br />
                      El descuento es necesario.
                    </small>
                  )}
                </span>
              </div>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default React.memo(OrdenServicio);
