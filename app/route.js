const express = require('express')
const auth = require('./middleware/auth')
const authorized = require('./middleware/authorized')
const {
	signup, approveEmail, isUser, login,
} = require('./action/signup')
const user = require('./action/user')
const events = require('./action/events')
const availability = require('./action/availability')

const route = new express.Router()
route.get('/user/isuser', isUser)
route.post('/user', signup)
route.post('/user/approve', approveEmail)
route.post('/user/login', login)
const authorizedRoute = new express.Router()
authorizedRoute.use(auth)
authorizedRoute.use(authorized)
authorizedRoute.get('/user/me', user.me)
authorizedRoute.post('/event', events.create)
authorizedRoute.post('/user/me/availability', availability.create)
authorizedRoute.get('/user/me/availability/:id', availability.get)
module.exports = {
	route,
	authorizedRoute,
}
