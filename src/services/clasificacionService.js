import axios from 'axios';

const { config } = require('../config')

const url = `${config.apiUrl2}/clasificacion`;

function getAllClasificaciones() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export {
  getAllClasificaciones
}