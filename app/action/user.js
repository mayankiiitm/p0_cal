const users = require('../model/users')

module.exports = {
	me: async (req, res) => {
		const user = await users.findByEmail(req.user.email)
		delete user.password
		delete user.otp
		return res.send({ success: true, me: user })
	},
}
