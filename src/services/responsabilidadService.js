const { config } = require('../config')

const url = `${config.apiUrl2}/responsabilidad`;

function getAllResponsabilidad() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export {
  getAllResponsabilidad
}