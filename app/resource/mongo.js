const { MongoClient } = require('mongodb')
const conf = require('../config')

const url = conf.mongUrl
console.log(url)
let db

module.exports = {
	connect: async () => {
		if (db) return db
		const client = new MongoClient(url)
		await client.connect()
		db = client.db(process.env.DB_NAME)
		return db
	},

	getInstance: (collection) => {
		if (!db) throw new Error('No db Connection')
		return collection ? db.collection(collection) : db
	},

}
