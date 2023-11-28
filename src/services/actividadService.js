const { config } = require('../config')

const url = `${config.apiUrl2}/actividad`;

function getAllActividad() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export {
  getAllActividad
}