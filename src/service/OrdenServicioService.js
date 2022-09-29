import axios from "axios";

export class OrdenServicioService {
  getOrdenes() {
      return axios.get("http://localhost:9090/api/v1.0/ordenServicio").then((res) => res.data);
  }
  postOrden(orden) {
    return axios.post("http://localhost:9090/api/v1.0/ordenServicio", orden);
  }
  putOrden(id, orden) {
    return axios.put("http://localhost:9090/api/v1.0/ordenServicio/"+id, orden);
  }
  deleteOrden(id) {
    return axios.delete("http://localhost:9090/api/v1.0/ordenServicio/" + id);
  }

  // Detalle orden servicio
  getDetalles() {
    try {
      return axios.get("http://localhost:9090/api/v1.0/detalleordenServicio").then((
        res,
      ) => res.data);
    } catch (error) {
      console.log(error);
    }
  }
  async getDetallesO(id) {
    return await axios.get("http://localhost:9090/api/v1.0/detalleordenServicio/"+id).then((
      res,
    ) => res.data);
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
