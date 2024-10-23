const userAvailability = require('../model/userAvailability')
const { makeSchedule } = require('./lib/schedule')

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
		const targetAvailability = makeSchedule(
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
