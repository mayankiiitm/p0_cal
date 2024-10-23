const date = require('../../helper/date')

const scheduleToDateSlots = (schedule, startDate, endDate, timeZone = '') => {
	// eslint-disable-next-line no-param-reassign
	if (!timeZone) timeZone = schedule.timeZone
	const start = date.convertDateWithTimeZone(startDate, schedule.timeZone, timeZone)
	const end = date.convertDateWithTimeZone(endDate, schedule.timeZone, timeZone, 'end')
	const dailyAvailability = date.getAvailability(schedule, start, end)
	if (schedule.timeZone === timeZone) {
		return dailyAvailability
	}
	const targetAvailability = date.convertTimeSlots(
		dailyAvailability,
		schedule.timeZone,
		timeZone,
	)
	return targetAvailability
}

const makeSchedule = (schedule, startDate, endDate, timeZone) => {
	const targetAvailability = scheduleToDateSlots(
		schedule,
		startDate,
		endDate,
		timeZone,
	)
	return targetAvailability
}
module.exports = {
	makeSchedule,
}
