import axios from 'axios';
import { config } from '../config';

const url = config.apiUrl2

export const fileSend = async(formData) =>{
    try {
        const {data}= await axios.post(`${url}/uploadMultiple`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        return data;
      } catch (error) {
        throw error;
      }
    }

export const getArchivos = (folderName)=>{
   
}
    
export const deleteFile = (folderName)=>{
  return fetch(`${url}/uploadMultiple/${folderName}`,{
    method:'DELETE',
    headers:{
      "Content-Type": "application/json",
    },
  })
  .then((res) => res.json())
  .then((res) => res);
}
