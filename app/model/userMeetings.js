const { getCollection } = require('../resource/mongo')

const userMeetings = getCollection('userMeetings')
module.exports = {
	isUserAvailable: async (userId, startTime, endTime) => {
		const meeting = await userMeetings.findOne({
			userId,
			startTime: { $lt: endTime },
			endTime: { $gt: startTime },
		})
		return !meeting
	},
	create: (meeting) => userMeetings.insertOne(meeting),
}
