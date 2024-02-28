import axios from 'axios';
import Cookies from 'js-cookie';

const { config } = require('../config')

const url = `${config.apiUrl2}/agencies`;

function getAllAgencies() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export const findOneAgency = async (id) => {
  const token = Cookies.get('token')
  const { data } = await axios.get(`${url}/${id}`,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const createAgency = async (body) => {
  /* const token = JSON.parse(localStorage.getItem("token")) */
  const token = Cookies.get('token')

  const { data } = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const updateAgency = async (id, body) => {
  /* const token = JSON.parse(localStorage.getItem("token")) */
  const token = Cookies.get('token')

  const { data } = await axios.patch(`${url}/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const deleteAgency = (id) => {
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
  getAllAgencies
}