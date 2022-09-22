import axios from "axios";

export class ProductoService {
  getProductos() {
    return axios.get("http://localhost:9090/api/v1.0/producto").then((
      res,
    ) => res.data);
  }
  postProducto(producto) {
    return axios.post("http://localhost:9090/api/v1.0/producto", producto);
  }
  putProducto(id, prouducto) {
    return axios.put("http://localhost:9090/api/v1.0/producto/"+id, prouducto);
  }
  deleteOrden(id) {
    return axios.delete("http://localhost:9090/api/v1.0/producto/" + id);
  }
}
