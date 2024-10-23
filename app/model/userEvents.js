const { getCollection } = require('../resource/mongo')

const userEvents = getCollection('userEvents')
module.exports = {
	create: (eventDetail) => userEvents.insertOne(eventDetail),
}
