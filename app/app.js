const express = require('express')
const {
	signup, approveEmail, isUser, login,
} = require('./action/signup')
const auth = require('./middleware/auth')
const user = require('./action/user')
const authorized = require('./middleware/authorized')

const app = express()
app.use(express.json())
app.get('/health', async (req, res) => {
	res.send('ok')
})
app.use(auth)
app.get('/user/isuser', isUser)
app.post('/user', signup)
app.post('/user/approve', approveEmail)
app.post('/user/login', login)
app.get('/user/me', authorized, user.me)
app.listen(4000, () => {
	console.log('now listening for "requests" on port 4000')
})
