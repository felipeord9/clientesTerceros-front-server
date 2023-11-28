const { config } = require('../config')

const url = `${config.apiUrl2}/detalles`;

function getAllDetalles() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export {
  getAllDetalles
}