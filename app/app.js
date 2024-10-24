const express = require('express')
const route = require('./route')

const app = express()
app.use(express.json())
app.get('/health', async (req, res) => {
	res.send('ok')
})
app.use(route.route)
app.use(route.authorizedRoute)
app.listen(process.env.port || 80, () => {
	console.log('now listening for "requests" on port 4000')
})
