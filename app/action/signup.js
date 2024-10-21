const users = require('../model/users')
const sendMail = require('../helper/sendMail')
const getOtp = require('../helper/getOtp')
const { hashPassword, matchPassword } = require('../helper/password')

const isUser = async (req, res) => {
	const { email } = req.query
	const user = await users.findByEmail(email)
	let isNewUser = true
	if (user) {
		isNewUser = false
	}
	return res.send({ success: true, isNewUser })
}

const signup = async (req, res) => {
	const { email, password } = req.body
	if (!email || !password) {
		return res.send({ success: false })
	}
	const user = await users.findByEmail(email)
	if (user) {
		return res.send({ success: false })
	}
	const passwordHash = await hashPassword(password)
	const otp = getOtp()
	await users.signup({
		email, otp, password: passwordHash, isEmailApproved: 0,
	})
	sendMail(otp)
	return res.send({ success: true })
}
const login = async (req, res) => {
	const { email, password } = req.body
	if (!email) {
		return res.send({ success: false })
	}
	const user = await users.findByEmail(email)
	if (!user) {
		return res.send({ success: false })
	}
	console.log(user.password, password)
	const match = await matchPassword(password, user.password)
	if (match) {
		return res.send({ success: true })
	}
	return res.send({ success: false })
}
const approveEmail = async (req, res) => {
	const { email, otp } = req.body
	const user = await users.findByEmail(email)
	if (!user) {
		return res.send({ success: false })
	}
	// eslint-disable-next-line eqeqeq
	if (otp && otp == user.otp) {
		await users.approveEmail(email)
		return res.send({ success: true })
	}
	return res.send({ success: false })
}
module.exports = {
	signup,
	approveEmail,
	isUser,
	login,
}
