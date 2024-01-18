import axios from 'axios'
import { config } from "../config";
const url = `${config.apiUrl2}/pre/aprovacion`;

const findPreAprovacion = async () => {
    const token = JSON.parse(localStorage.getItem("token"))
    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return data
} 

const validarPreAprovacion = async (cedula)=>{
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.get(`${url}/numero/${cedula}`,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

const createPreAprovacion = (body) => {
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

export const updatePreAprovacion = async (id, body) => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.patch(`${url}/update/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

const deletePreAprovacion = (id) => {
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
    findPreAprovacion,
    createPreAprovacion,
    deletePreAprovacion,
    validarPreAprovacion,
    deleteByCedula,
}