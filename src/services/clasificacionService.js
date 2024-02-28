import axios from 'axios';
import Cookies from 'js-cookie';

const { config } = require('../config')

const url = `${config.apiUrl2}/clasificacion`;

function getAllClasificaciones() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export const findOneClasificacion = async (id) => {
  const token = Cookies.get('token')
  const { data } = await axios.get(`${url}/${id}`,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const createClasificacion = async (body) => {
  /* const token = JSON.parse(localStorage.getItem("token")) */
  const token = Cookies.get('token')

  const { data } = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const updateClasificacion = async (id, body) => {
  /* const token = JSON.parse(localStorage.getItem("token")) */
  const token = Cookies.get('token')

  const { data } = await axios.patch(`${url}/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const deleteClasificacion = (id) => {
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
  getAllClasificaciones
}