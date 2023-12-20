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

const validarProveedor = async (cedula)=>{
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.get(`${url}/numero/${cedula}`,{
    headers:{
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

export const updateProveedor = async (id, body) => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.patch(`${url}/update/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

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

const deleteByCedula = (cedula) => {
  return fetch(`${url}/delete/${cedula}`, {
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
    deleteProveedor,
    validarProveedor,
    deleteByCedula,
    
}