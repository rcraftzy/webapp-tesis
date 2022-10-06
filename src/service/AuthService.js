export const getUser = async () => {
  try {
    const response = await fetch("http://localhost:9090/api/user", {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const content = await response.json();
    return content;
  } catch (error) {
    console.log(error);
  }
};

export const getUserEmpresa = async (id = 0) => {
  try {
    const response = await fetch(
      "http://localhost:9090/api/v1.0/empresaUser/" + id,
      {
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      },
    );
    const content = await response.json();
    return content;
  } catch (error) {
    console.log(error);
  }
};
/*
export const getUser = () => {
  return axios.get("http://localhost:9090/api/user").then((res) => console.log(res.data))
}
export const getUserEmpresa = async (id) => {
  return axios.get("http://localhost:9090/api/v1.0/empresaUser/"+id).then((res) => res.data)
}
 */
