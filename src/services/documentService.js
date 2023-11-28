const { config } = require('../config')

const url = `${config.apiUrl2}/documents`;

function getAllDocuments() {
  return fetch(url)
    .then(res => res.json())
    .then(res => res.data)
}

export {
  getAllDocuments
}