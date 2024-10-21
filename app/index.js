require('dotenv').config()
const mongo = require('./resource/mongo')

Promise.all([mongo.connect()])
	.then(() => {
		console.log('connected')
		// eslint-disable-next-line global-require
		require('./app')
	})
	.catch((e) => {
		console.error(e)
		process.exit(1)
	})
