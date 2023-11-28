const { config } = require('../config')

const url = `${config.apiUrl2}/precios`;

function getAllPrecios() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export {
  getAllPrecios
}