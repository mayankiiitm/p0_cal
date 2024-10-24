const userEvents = require('../model/userEvents')
const userAvailability = require('../model/userAvailability')
const {
	makeMeetingSlot, isCorrectTime,
} = require('./lib/schedule')
const { addSecondsToTime, convertTimezone } = require('../helper/date')
const userMeetings = require('../model/userMeetings')

const bookMeeting = async (req, res) => {
	const { id } = req.params
	const { startTime, timeZone } = req.body
	const userEvent = await userEvents.getById(id)
	const endTime = addSecondsToTime(startTime, userEvent.duration)
	const [startUTC, endUTC] = [convertTimezone(startTime, timeZone, 'utc'), convertTimezone(endTime, timeZone, 'utc')]
	let { schedule } = userEvent
	if (userEvent.scheduleId) {
		schedule = await userAvailability.getById(userEvent.scheduleId)
	}
	const meetingSlot = makeMeetingSlot(schedule, startTime, timeZone, userEvent.duration)
	if (!isCorrectTime(schedule, meetingSlot)) {
		// return res.send({ success: false, msg: 'wrong start time' })
	}
	const [meAvailable, userAvailable] = await Promise.all([
		userMeetings.isUserAvailable(req.user._id, startUTC, endUTC),
		userMeetings.isUserAvailable(userEvent.userId, startUTC, endUTC),
	])
	if (!meAvailable || !userAvailable) {
		return res.send({ success: false, msg: 'users unavailable' })
	}
	await userMeetings.create({
		event: userEvent,
		userId: req.user._id,
		startTime: startUTC,
		endTime: endUTC,
		ownerId: userEvent.userId,
	})
	return res.send({ success: true, meetingSlot })
}
const getMeetings = async (req, res) => {
	console.log(req.user._id)
	const meetings = await userMeetings.getByUser(req.user._id)
	console.log(meetings)
	res.send({ success: true, meetings })
}

const getOneMeeting = async (req, res) => {
	const meeting = await userMeetings.getById(req.params.id)
	res.send({ success: true, meeting })
}

module.exports = {
	bookMeeting,
	getMeetings,
	getOneMeeting,
}
