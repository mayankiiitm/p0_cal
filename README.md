# Harbor Take Home Project
p0_cal API

## Features
- Sign Up and Login
- Multiple Availability Template
- Create Different Event schedule
- Multiple Time Zone Support
- Booking of event

## Deployment
`http://43.205.61.40`
- API mounnt point is `/` 
## To Run Locally
- clone this repo
- rename `.env.sample` to `.env` and change the values as per your environment
- run `npm install`
- to start the app, run `node app/index.js`
- Developed locally on node version 22

## Potential Bugs
- Timezone conversion might cause issues in cases where one event starts immediately after another.
- Time slot calculation may return very short time ranges, such as 09:00-09:01.
- Race conditions may occur when an event time range crosses the midnight boundary.

## Improvements
- Add user to meeting
- Rewrite timezone handling functionality
- Add basic CRUD api end points for events, meetings, availability