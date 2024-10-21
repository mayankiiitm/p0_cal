const { MongoClient, Collection } = require('mongodb')
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
	getInstance: () => {
		if (!db) throw new Error('No db Connection')
		return db
	},
	/**
	 * Gets a collection from the database.
	 * @param {string} collection - The name of the collection to retrieve.
	 * @returns {Collection} The MongoDB collection.
	 */
	getCollection: (collection) => module.exports.getInstance().collection(collection),

}
