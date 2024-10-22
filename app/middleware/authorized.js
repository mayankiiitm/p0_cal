module.exports = async (req, res, next) => {
	if (!req.user || !req.user._id) {
		return res.status(401).send({ success: false })
	}
	return next()
}
