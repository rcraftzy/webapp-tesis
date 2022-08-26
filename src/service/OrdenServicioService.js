import axios from "axios";

export class OrdenServicioService {
  getOrdernes() {
    try {
      return axios.get("http://localhost:9090/api/v1.0/ordenServicio").then((
        res,
      ) => res.data.result);
    } catch (error) {
      console.log(error);
    }
  }
  postOrden(orden) {
    return axios.post("http://localhost:9090/api/v1.0/ordenServicio", orden);
  }
  putOrden(orden) {
    return axios.put("http://localhost:9090/api/v1.0/ordenServicio", orden);
  }
  deleteOrden(id) {
    return axios.delete("http://localhost:9090/api/v1.0/ordenServicio/" + id);
  }

  // Detalle orden servicio
  getDetalles() {
    try {
      return axios.get("http://localhost:9090/api/v1.0/detalleordenServicio").then((
        res,
      ) => res.data.result);
    } catch (error) {
      console.log(error);
    }
  }
  postDetalle(detalle) {
    return axios.post("http://localhost:9090/api/v1.0/detalleordenServicio", detalle);
  }
  putDetalle(detalle) {
    return axios.put("http://localhost:9090/api/v1.0/detalleordenServicio", detalle);
  }
  deleteDetalle(id) {
    return axios.delete("http://localhost:9090/api/v1.0/detalleordenServicio/" + id);
  }
}
