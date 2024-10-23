const date = require('../helper/date')
const userAvailability = require('../model/userAvailability')

module.exports = {
	create: async (req, res) => {
		const {
			startDate, endDate, weeklySlots, dateSlots, timeZone, name,
		} = req.body
		await userAvailability.create({
			startDate, endDate, weeklySlots, dateSlots, timeZone, name, userId: req.user._id,
		})
		res.send({ success: true })
	},
	get: async (req, res) => {
		const { id } = req.params
		const schedule = await userAvailability.getById(id)
		const startDate = date.convertDateWithTimeZone(
			req.query.startDate,
			schedule.timeZone,
			req.query.timeZone,
		)
		const endDate = date.convertDateWithTimeZone(
			req.query.endDate,
			schedule.timeZone,
			req.query.timeZone,
			'end',
		)
		const dailyAvailability = date.getAvailability(schedule, startDate, endDate)
		const targetAvailability = date.convertTimeSlots(
			dailyAvailability,
			schedule.timeZone,
			req.query.timeZone,
		)
		res.send({ success: true, availability: targetAvailability })
	},
}
