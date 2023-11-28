import axios from 'axios'
import { config } from "../config";

const url = `${config.apiUrl2}/bitacora`;

export const findBitacoras = async () => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
} 
export const createBitacora = (body) => {
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

export const updateBitacora = async (email, body) => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.patch(`${url}/${email}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}
export const deleteBitacora = (email) => {
    return fetch(`${url}/${email}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((res) => res);
  };