const { ObjectId } = require('mongodb')
const { getCollection } = require('../resource/mongo')

const userEvents = getCollection('userEvents')
module.exports = {
	create: (eventDetail) => userEvents.insertOne(eventDetail),
	getById: (id) => userEvents.findOne({ _id: new ObjectId(id) }),
}
