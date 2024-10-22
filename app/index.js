require('dotenv').config()
const mongo = require('./resource/mongo')

Promise.all([mongo.connect()])
	.then(() => {
		// eslint-disable-next-line global-require
		require('./app')
	})
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
