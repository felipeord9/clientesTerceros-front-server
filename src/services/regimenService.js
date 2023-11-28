const { config } = require('../config')

const url = `${config.apiUrl2}/regimen`;

function getAllRegimen() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export {
  getAllRegimen
}