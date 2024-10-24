const express = require('express')
const route = require('./route')

const app = express()
app.use(express.json())
app.get('/health', async (req, res) => {
	res.send('ok')
})
app.use(route.route)
app.use(route.authorizedRoute)
const port = process.env.port || 80
app.listen(port, () => {
	console.log(`now listening for ${port} on port 4000`)
})
