const jwt = require('../helper/jwt')

module.exports = async (req, res, next) => {
	const token = req.headers.authorization
	if (!token) {
		return next()
	}
	const user = await jwt.decode(token)
	if (!user || !user._id) {
		return next()
	}
	req.user = user
	return next()
}
