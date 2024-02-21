const { config } = require('../config')

const url = `${config.apiUrl2}/categorias/rechazo`;

function getAllCategorias() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export {
  getAllCategorias
}