import axios from "axios";

export const getTecnicos = () => {
  return axios.get("http://localhost:9090/api/v1.0/tecnico")
    .then((res) => res.data);
};
export const postTecnicos = (tec) => {
  return axios.post("http://localhost:9090/api/v1.0/tecnico", tec);
};
export const putTecnicos = (tecni) => {
  return axios.put("http://localhost:9090/api/v1.0/tecnico", tecni);
};

export const deleteTecnicos = (id) => {
  return axios.delete("http://localhost:9090/api/v1.0/tecnico/" + id);
};

export class TecnicoService {
  getTecnicos() {
    return axios.get("http://localhost:9090/api/v1.0/tecnico")
      .then((res) => res.data);
  }

  postTecnicos(tec) {
    return axios.post("http://localhost:9090/api/v1.0/tecnico", tec);
  }

  putTecnicos(id, tecni) {
    return axios.put("http://localhost:9090/api/v1.0/tecnico/"+id, tecni);
  }

  deleteTecnicos(id) {
    return axios.delete("http://localhost:9090/api/v1.0/tecnico/" + id);
  }
}
