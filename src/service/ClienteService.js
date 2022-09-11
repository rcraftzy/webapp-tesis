import axios from "axios";

export class ClienteService {
  getClientes() {
    return axios.get("http://localhost:9090/api/v1.0/clientes").then((
      res,
    ) => res.data.result);
  }
  postCliente(id) {
    return axios.post("http://localhost:9090/api/v1.0/ordenServicio", id);
  }
  putOrden(orden) {
    return axios.put("http://localhost:9090/api/v1.0/ordenServicio", orden);
  }
  deleteOrden(id) {
    return axios.delete("http://localhost:9090/api/v1.0/ordenServicio/" + id);
  }
}
