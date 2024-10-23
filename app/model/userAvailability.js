const { ObjectId } = require('mongodb')
const { getCollection } = require('../resource/mongo')

const userAvailability = getCollection('userAvailability')
module.exports = {
	create: (data) => userAvailability.insertOne(data),
	getById: (id) => userAvailability.findOne({ _id: new ObjectId(id) }),
}
