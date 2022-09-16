import axios from "axios";

export class ProductService {
  getProducts() {
    return axios.get("http://localhost:9090/api/v1.0/provincia").then((res) =>
      res.data
    );
  }
  postProvincia(provincia) {
    return axios.post("http://localhost:9090/api/v1.0/provincia", provincia);
  }
  putProvincia(id, provincia) {
    return axios.put(
      "http://localhost:9090/api/v1.0/provincia/" + id,
      provincia,
    );
  }
  deleteProvincia(id) {
    return axios.delete("http://localhost:9090/api/v1.0/provincia/" + id);
  }

  getCuidad() {
    return axios.get("http://localhost:9090/api/v1.0/ciudad").then((res) =>
      res.data
    );
  }
  postCiudad(ciudad) {
    return axios.post("http://localhost:9090/api/v1.0/ciudad", ciudad);
  }
  putCiudad(id, ciudad) {
    return axios.put("http://localhost:9090/api/v1.0/ciudad/"+id, ciudad);
  }
  deleteCiudad(id) {
    return axios.delete("http://localhost:9090/api/v1.0/ciudad/" + id);
  }
}
