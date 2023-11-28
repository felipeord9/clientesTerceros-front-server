import axios from 'axios'
import { config } from "../config";
const url = `${config.apiUrl2}/proveedor`;

const findProveedores = async () => {
    const token = JSON.parse(localStorage.getItem("token"))
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return data
} 

const createProveedor = (body) => {
    const token = JSON.parse(localStorage.getItem("token"))
    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
        
      },
      body: JSON.stringify(body),
    })
      .then((res) => res.json())
      .then((res) => res);
};

const deleteProveedor = (id) => {
  return fetch(`${url}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((res) => res.json())
    .then((res) => res);
};


export {
    findProveedores,
    createProveedor,
    deleteProveedor
}