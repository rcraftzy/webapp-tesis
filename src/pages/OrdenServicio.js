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
import { ProductService } from "../service/ProductService";
import { Link } from "react-router-dom";
import { OrdenServicioService } from "../service/OrdenServicioService";

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

    const [switchValue, setSwitchValue] = useState(false);

    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [deleteProductsDialog, setDeleteProductsDialog] = useState(false);

    const [ordenServicio, setOrdenServicio] = useState(emptyOrdenServicio);
    const [detalleOrdenServicio, setDetalleOrdenServicio] = useState(emptyOrdenServicio);

    const [selectedOrdenesServicio, setSelectedOrdenesServicio] = useState(null);
    const [selectedDetalleOrdenesServicio, setSelectedDetalleOrdenesServicio] = useState(null);

    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    useEffect(() => {
        const ordenServicioService = new OrdenServicioService();
        ordenServicioService.getOrdenes().then((data) => setOrdenesServicio(data));
        ordenServicioService.getDetalles().then((data) => setDetalleOrdenesServicio(data));
    }, []);

    const menubarEndTemplate = () => {
        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="text" placeholder="Search" />
            </span>
        );
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
        let _products = ordenesServicio.filter((val) => val.id !== ordenServicio.id);
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
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
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
        let _ordenesServicio = ordenesServicio.filter((val) => !selectedOrdenesServicio.includes(val));
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
                    <Link to="/create-orden-servicio">
                        <Button label="Nuevo" icon="pi pi-plus" className="p-button-success mr-2" />
                    </Link>
                </div>
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
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
                <span className="p-column-title">Name</span>
                {rowData.nombre}
            </>
        );
    };

    const imageBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Image</span>
                <img src={`assets/demo/images/product/${rowData.image}`} alt={rowData.image} className="shadow-2" width="100" />
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
                <span className={`product-badge status-${rowData.inventoryStatus.toLowerCase()}`}>{rowData.inventoryStatus}</span>
            </>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning mt-2" onClick={() => confirmDeleteProduct(rowData)} />
            </div>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Provincias</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Buscar..." />
            </span>
        </div>
    );

    const productDialogFooter = (
        <>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </>
    );
    const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    );
    const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedProducts} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    <div className="grid">
                        <div className="col-12">
                            <div className="card m-3 border-1 surface-border">
                                <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                                    <div className="flex-1 text-center md:text-left">
                                        <div>
                                            <i className="pi pi-hashtag" />
                                            <span>22</span>
                                        </div>
                                        <div className="mt-2 mb-2">
                                            Técnico<span className="font-semibold m-2">Roberto Carlos Toalongo Galabay</span>
                                        </div>
                                        <div className="mb-3">
                                            <i className="pi pi-calendar" />
                                            <span>22/12/2022</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-row md:flex-column justify-content-between w-full md:w-auto align-items-center md:align-items-end mt-5 md:mt-0">
                                        <span className="text-2xl font-semibold mb-2 align-self-center md:align-self-end">$50</span>
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
                    </div>
                </div>
                <Dialog visible={productDialog} style={{ width: "450px" }} header="Provincia" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                    {ordenServicio.image && <img src={`assets/demo/images/product/${ordenServicio.image}`} alt={ordenServicio.image} width="150" className="mt-0 mx-auto mb-5 block shadow-2" />}
                    <div className="field">
                        <label htmlFor="name">Nombre</label>
                        <InputText
                            id="nombre"
                            value={ordenServicio.nombre}
                            onChange={(e) => onInputChange(e, "nombre")}
                            required
                            autoFocus
                            className={classNames({
                                "p-invalid": submitted && !ordenServicio.nombre,
                            })}
                        />
                        {submitted && !ordenServicio.nombre && <small className="p-invalid">Name is required.</small>}
                    </div>
                </Dialog>

                <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                        {ordenServicio && (
                            <span>
                                Are you sure you want to delete <b>{ordenServicio.nombre}</b>?
                            </span>
                        )}
                    </div>
                </Dialog>

                <Dialog visible={deleteProductsDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                    <div className="flex align-items-center justify-content-center">
                        <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                        {ordenServicio && <span>Are you sure you want to delete the selected products?</span>}
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
