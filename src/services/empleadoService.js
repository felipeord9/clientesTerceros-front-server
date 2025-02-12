import axios from 'axios'
import { config } from "../config";
import Cookies from 'js-cookie';

const url = `${config.apiUrl2}/empleados`;

const findEmpleados = async () => {
    /* const token = JSON.parse(localStorage.getItem("token")) */
    const token = Cookies.get('token')

    const { data } = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    return data
} 

const findEmpleadoByCedula = async (cedula) => {
  const token = Cookies.get('token')

  const { data } = await axios.get(`${url}/cedula/${cedula}`,{
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

const sendMail = async ()=>{
  try{
    const { data } = await axios.post(`${url}/send/mail`)
    return data
  } catch(error){
    throw error
  }
}

const createEmpleado = (body) => {
    /* const token = JSON.parse(localStorage.getItem("token")) */
    const token = Cookies.get('token')

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

export const updateEmpleado = async (id, body) => {
  /* const token = JSON.parse(localStorage.getItem("token")) */
  const token = Cookies.get('token')

  const { data } = await axios.patch(`${url}/update/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

const deleteEmpleado = (id) => {
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
    findEmpleados,
    findEmpleadoByCedula,
    createEmpleado,
    deleteEmpleado,
    sendMail,
}