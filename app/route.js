const express = require('express')
const auth = require('./middleware/auth')
const authorized = require('./middleware/authorized')
const {
	signup, approveEmail, isUser, login,
} = require('./action/signup')
const user = require('./action/user')
const events = require('./action/events')
const availability = require('./action/availability')
const meeting = require('./action/meeting')

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
authorizedRoute.post('/user/me/availability/:id/default', availability.makeDefault)
authorizedRoute.get('/event/:id', events.get)
authorizedRoute.get('/event/:id/schedule', events.getSchedule)
authorizedRoute.get('/event/:id/overlap', events.getScheduleOverLap)
authorizedRoute.post('/event/:id/book', meeting.bookMeeting)
module.exports = {
	route,
	authorizedRoute,
}
