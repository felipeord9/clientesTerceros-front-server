import axios from 'axios'
import { config } from "../config";
import Cookies from 'js-cookie';

const url = `${config.apiUrl2}/Rechazo`;

const createRechazo = (body) => {
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

export {
    createRechazo,
}