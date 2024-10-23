const { ObjectId } = require('mongodb')
const { getCollection } = require('../resource/mongo')

const userAvailability = getCollection('userAvailability')
module.exports = {
	create: (data) => userAvailability.insertOne(data),
	getById: (id) => userAvailability.findOne({ _id: new ObjectId(id) }),
	makeDefault: (id) => userAvailability.findOneAndUpdate(
		{ _id: new ObjectId(id) },
		{
			$set:
			{ isDefault: 1 },
		},
		{
			returnDocument: 'after',
			upsert: false,
		},
	),
	removeDefault: (userId) => userAvailability.updateMany(
		{ userId },
		{
			$set:
			{ isDefault: 0 },
		},
		{
			returnDocument: 'after',
			upsert: false,
		},
	),
	getDefaultSchedule: () => userAvailability.findOne({ isDefault: 1 }),
}
