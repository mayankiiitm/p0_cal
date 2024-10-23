const userAvailability = require('../model/userAvailability')
const userEvents = require('../model/userEvents')
const { makeSchedule } = require('./lib/schedule')

const create = async (req, res) => {
	const {
		name, duration, dateRange, minNotice, bufferTime, schedule, scheduleId, timeZone,
	} = req.body
	const success = await userEvents.create({
		name,
		userId: req.user._id,
		duration,
		dateRange,
		minNotice,
		bufferTime,
		schedule,
		scheduleId,
		timeZone,
	})
	res.send({ success: !!success })
}
const get = async (req, res) => {
	const { id } = req.params
	const userEvent = await userEvents.getById(id)
	return res.send({ event: userEvent })
}
const getSchedule = async (req, res) => {
	const { id } = req.params
	const { startDate, endDate, timeZone } = req.query
	const userEvent = await userEvents.getById(id)
	let { schedule } = userEvent
	if (userEvent.scheduleId) {
		schedule = await userAvailability.getById(userEvent.scheduleId)
	}
	const availability = makeSchedule(schedule, startDate, endDate, timeZone)
	return res.send({ success: true, availability })
}
module.exports = {
	create,
	get,
	getSchedule,
}
