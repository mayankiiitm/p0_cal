const jwt = require('jsonwebtoken')

const secret = process.env.JWT_SECRET || 'd8A%pX3fZb2$1q@G#yM!wL0cR^&iKsVjX7Uo9$H6*NtEzP4Q'
const expiresIn = process.env.JWT_EXPIRESIN || '10h'
module.exports = {
	sign: (payload) => {
		// eslint-disable-next-line no-param-reassign
		const options = {
			expiresIn,
		}
		return jwt.sign(payload, secret, options)
	},
	decode: (token) => new Promise((resolve) => {
		jwt.verify(token, secret, (err, decoded) => {
			if (err) {
				resolve(null)
			} else {
				resolve(decoded)
			}
		})
	}),
}
