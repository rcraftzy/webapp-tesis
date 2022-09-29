import axios from "axios";

export class ClienteService {
  async getClientes() {
    return await axios.get("http://localhost:9090/api/v1.0/clientes")
      .then((res) => res.data);
  }

  postClientes(cli) {
    return axios.post("http://localhost:9090/api/v1.0/clientes", cli);
  }

  putClientes(id, clien) {
    return axios.put("http://localhost:9090/api/v1.0/clientes/"+id, clien);
  }
}
