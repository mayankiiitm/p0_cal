const { getCollection } = require('../resource/mongo')

const users = getCollection('users')

module.exports = {
	findByEmail: (email) => users.findOne({ email }),
	signup: (user) => users.insertOne(user),
	approveEmail: (email) => users.findOneAndUpdate(
		{ email },
		{
			$set:
			{ isEmailApproved: 1, otp: '' },
		},
		{
			returnDocument: 'after',
			upsert: false,
		},
	),
}
