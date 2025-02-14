const userAvailability = require('../model/userAvailability')
const userEvents = require('../model/userEvents')
const { makeSchedule } = require('./lib/schedule')
const { findOverlaps } = require('../helper/date')

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
const getScheduleOverLap = async (req, res) => {
	const id = req.params
	const { startDate, endDate, timeZone } = req.query
	const [meSchedule, userEvent] = await Promise.all([
		userAvailability.getDefaultSchedule(),
		userEvents.getById(id),
	])
	const meSlots = makeSchedule(meSchedule, startDate, endDate, timeZone)
	let { schedule } = userEvent
	if (userEvent.scheduleId) {
		schedule = await userAvailability.getById(userEvent.scheduleId)
	}
	const eventSlots = makeSchedule(schedule, startDate, endDate, timeZone)
	const overlap = findOverlaps(meSlots, eventSlots)
	res.send({ success: true, overlap })
}
module.exports = {
	create,
	get,
	getSchedule,
	getScheduleOverLap,
}
