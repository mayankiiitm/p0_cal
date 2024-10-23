const date = require('../helper/date')
const userAvailability = require('../model/userAvailability')

const scheduleToDateSlots = (schedule, startDate, endDate, timeZone = '') => {
	// eslint-disable-next-line no-param-reassign
	if (!timeZone) timeZone = schedule.timeZone
	const start = date.convertDateWithTimeZone(startDate, schedule.timeZone, timeZone)
	const end = date.convertDateWithTimeZone(endDate, schedule.timeZone, timeZone, 'end')
	const dailyAvailability = date.getAvailability(schedule, start, end)
	if (schedule.timeZone === timeZone) {
		return dailyAvailability
	}
	const targetAvailability = date.convertTimeSlots(
		dailyAvailability,
		schedule.timeZone,
		timeZone,
	)
	return targetAvailability
}
module.exports = {
	create: async (req, res) => {
		const {
			startDate, endDate, weeklySlots, dateSlots, timeZone, name,
		} = req.body
		await userAvailability.create({
			startDate,
			endDate,
			weeklySlots,
			dateSlots,
			timeZone,
			name,
			userId: req.user._id,
			isDefault: 0,
		})
		res.send({ success: true })
	},
	get: async (req, res) => {
		const { id } = req.params
		const schedule = await userAvailability.getById(id)
		const targetAvailability = scheduleToDateSlots(
			schedule,
			req.query.startDate,
			req.query.endDate,
			req.query.timeZone,
		)
		res.send({ success: true, availability: targetAvailability })
	},
	makeDefault: async (req, res) => {
		const { id } = req.params
		const schedule = await userAvailability.getById(id)
		if (schedule.userId !== req.user._id) {
			return res.send({ success: false })
		}
		await Promise.all([
			userAvailability.removeDefault(req.user._id),
			userAvailability.makeDefault(id),
		])
		return res.send({ success: true })
	},
}
