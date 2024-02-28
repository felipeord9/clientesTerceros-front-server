import Cookies from 'js-cookie';
import axios from 'axios'

const { config } = require('../config')

const url = `${config.apiUrl2}/precios`;

function getAllPrecios() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export const findOnePrecio = async (id) => {
  const token = Cookies.get('token')
  const { data } = await axios.get(`${url}/${id}`,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const createPrecio = async (body) => {
  /* const token = JSON.parse(localStorage.getItem("token")) */
  const token = Cookies.get('token')

  const { data } = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const updatePrecio = async (id, body) => {
  /* const token = JSON.parse(localStorage.getItem("token")) */
  const token = Cookies.get('token')

  const { data } = await axios.patch(`${url}/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const deletePrecio = (id) => {
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
  getAllPrecios
}