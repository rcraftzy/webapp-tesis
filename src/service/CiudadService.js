import axios from "axios";

export function getCiudades() {
  return axios.get("http://localhost:9090/api/v1.0/ciudad").then((res) =>
    res.data
  );
}
export function postCiudad(ciudad) {
  return axios.post("http://localhost:9090/api/v1.0/ciudad", ciudad);
}
export function putCiudad(id, ciudad) {
  return axios.put("http://localhost:9090/api/v1.0/ciudad/" + id, ciudad);
}
export function deleteCiudad(id) {
  return axios.delete("http://localhost:9090/api/v1.0/ciudad/" + id);
}
