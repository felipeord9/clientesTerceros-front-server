const { config } = require('../config')

const url = `${config.apiUrl2}/tipo/formulario`;

function getAllTipoFormularios() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export {
  getAllTipoFormularios
}