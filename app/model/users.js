const { getInstance } = require('../resource/mongo')

const collection = getInstance('user')

module.exports = collection
