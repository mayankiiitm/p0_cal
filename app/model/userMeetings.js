const { getCollection } = require('../resource/mongo')

const userMeetings = getCollection('userMeetings')
module.exports = {
	isUserAvailable: async (userId, startTime, endTime) => {
		const meeting = await userMeetings.findOne({
			$or: [{
				userId,
				startTime: { $lt: endTime },
				endTime: { $gt: startTime },
			}, {
				ownerId: userId,
				startTime: { $lt: endTime },
				endTime: { $gt: startTime },
			}],
		})
		return !meeting
	},
	create: (meeting) => userMeetings.insertOne(meeting),
	getBookings: (userId, startDate, endDate) => userMeetings.find({
		$or: [{
			userId,
			startTime: { $lt: endDate },
			endTime: { $gt: startDate },
		}, {
			ownerId: userId,
			startTime: { $lt: endDate },
			endTime: { $gt: startDate },
		}],
	}).toArray(),
}
