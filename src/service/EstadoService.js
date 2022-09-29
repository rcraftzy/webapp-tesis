import axios from "axios";

export class EstadoService {
  getEstados() {
    return axios.get("http://localhost:9090/api/v1.0/estadoordenservicio").then(
      (
        res,
      ) => res.data
    );
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

export const getEstados = () => {
  return axios.get("http://localhost:9090/api/v1.0/estadoordenservicio").then((
    res,
  ) => res.data);
};
export const putEstado = (id, estado) => {
  return axios.put(
    "http://localhost:9090/api/v1.0/estadoordenservicio/" + id,
    estado,
  );
};
export const postEstado = (estado) => {
  return axios.post(
    "http://localhost:9090/api/v1.0/estadoordenservicio",
    estado,
  );
};
export const deleteEstado = (id) => {
  return axios.delete(
    "http://localhost:9090/api/v1.0/estadoordenservicio/" + id,
  );
};
