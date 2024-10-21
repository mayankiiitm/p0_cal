module.exports = (otp) => {
	if (!otp) {
		throw new Error('No OTP provided')
	}
	// send mail logic

	return otp
}
