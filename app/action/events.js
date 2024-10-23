const userEvents = require('../model/userEvents')

const create = async (req, res) => {
	const {
		name, duration, dateRange, minNotice, bufferTime,
	} = req.body
	const success = await userEvents.create({
		name, userId: req.user._id, duration, dateRange, minNotice, bufferTime,
	})
	res.send({ success: !!success })
}
module.exports = {
	create,
}
