import axios from 'axios';
import Cookies from 'js-cookie';

const { config } = require('../config')

const url = `${config.apiUrl2}/cargos`;

function getAllCargos() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

function getOneCargo(codigo){
  return fetch(`${url}/${codigo}`)
    .then(res=>res.json())
    .then(res=>res.data)
}

export const findOne = async (id) => {
  const token = Cookies.get('token')
  const { data } = await axios.get(`${url}/${id}`,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const createCargo = async (body) => {
  /* const token = JSON.parse(localStorage.getItem("token")) */
  const token = Cookies.get('token')

  const { data } = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const updateCargo = async (id, body) => {
  /* const token = JSON.parse(localStorage.getItem("token")) */
  const token = Cookies.get('token')

  const { data } = await axios.patch(`${url}/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const deleteCargo = (id) => {
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
  getAllCargos,
  getOneCargo
}