import axios from 'axios'
import { config } from "../config";

const url = `${config.apiUrl2}/certificados`;

export const findCertificados = async () => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const findAll = async(tercero)=>{
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.get(`${url}/tercero/${tercero}`,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const findByTercero = async(tercero)=>{
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.get(`${url}/numero/${tercero}`,{
    headers:{
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const createCretificado = async (body) => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.post(url, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const updateCertificado = async (id, body) => {
  const token = JSON.parse(localStorage.getItem("token"))
  const { data } = await axios.patch(`${url}/${id}`, body, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  return data
}

export const sendCertificado = async (body)=>{
  try{
    const { data } = await axios.post(`${url}/send/certificado`, body)
    return data
  } catch(error){
    throw error
  }
}

export const sendCertiIVA = async (body)=>{
  try{
    const { data } = await axios.post(`${url}/enviar/certificado/iva`, body)
    return data
  } catch(error){
    throw error
  }
}

export const sendCertifiRFTE = async (body)=>{
  try{
    const { data } = await axios.post(`${url}/certificado/rfte`, body)
    return data
  } catch(error){
    throw error
  }
}

