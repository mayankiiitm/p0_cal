const express = require('express')
const user = require('./model/users')

const app = express()
app.get('/health', async (req, res) => {
	const data = await user.find({}).toArray()
	res.send(data)
})
app.listen(4000, () => {
	console.log('now listening for "requests" on port 4000')
})
