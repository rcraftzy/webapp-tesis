import axios from "axios";

export class ProductService {
    getProductsSmall() {
        return axios.get("assets/demo/data/products-small.json").then((res) => res.data.data);
    }

    // getProducts() {
    //     return axios.get('assets/demo/data/products.json').then(res => res.data.data);
    // }
    getProducts() {
        return axios.get("http://localhost:9090/api/v1.0/provincia").then((res) => res.data.result);
    }
    postProvincia(provincia) {
        return axios.post("http://localhost:9090/api/v1.0/provincia", provincia);
    }
    putProvincia(provincia) {
        return axios.put("http://localhost:9090/api/v1.0/provincia", provincia);
    }
   deleteProvincia(id) {
        return axios.delete("http://localhost:9090/api/v1.0/provincia/"+id);
   }

    getCuidad() {
        return axios.get("http://localhost:9090/api/v1.0/ciudad").then((res) => res.data.result);
    }

   postCiudad(ciudad) {
        return axios.post("http://localhost:9090/api/v1.0/ciudad", ciudad);
    }
    putCiudad(ciudad) {
        return axios.put("http://localhost:9090/api/v1.0/ciudad", ciudad);
    }
   deleteCiudad(id) {
        return axios.delete("http://localhost:9090/api/v1.0/ciudad/"+id);
   }

    getProductsWithOrdersSmall() {
        return axios.get("assets/demo/data/products-orders-small.json").then((res) => res.data.data);
    }
}
