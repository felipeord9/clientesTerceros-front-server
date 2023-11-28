const { config } = require('../config')

const url = `${config.apiUrl2}/departamentos`;

function getAllDepartamentos() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export {
  getAllDepartamentos
}