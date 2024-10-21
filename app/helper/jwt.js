const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET
const jwtExpiresIn = process.env.JWT_EXPIRESIN || '10h'
module.exports = (payload) => {
	// eslint-disable-next-line no-param-reassign
	const options = {
		jwtExpiresIn,
	}
	return jwt.sign(payload, secret, options)
}
