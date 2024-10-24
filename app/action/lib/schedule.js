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

const makeMeetingSlot = (schedule, startTime, timeZone, duration) => {
	const endTime = date.addSecondsToTime(startTime, duration)
	const startTz = date.convertTimezone(`${startTime}`, timeZone, schedule.timeZone)
	const endTz = date.convertTimezone(`${endTime}`, timeZone, schedule.timeZone)
	const [startDate, stime] = startTz.split('T')
	const [endDate, etime] = endTz.split('T')
	const slot = {}
	if (startDate === endDate) {
		slot[startDate] = [`${stime}-${etime}`]
	} else {
		slot[startDate] = [`${stime}-23:59`]
		if (etime !== '00:00') {
			slot[endDate] = [`00:00-${etime}`]
		}
	}
	return slot
}
const isInSchedule = (testDate, startTime, endTime, schedule) => {
	const isTimeInRange = (slot, sTime, eTime) => {
		const [slotStart, slotEnd] = slot.split('-')
		return sTime >= slotStart && eTime <= slotEnd
	}

	const { weeklySlots, dateSlots } = schedule

	// Parse the testDate string into a Date object
	const parsedDate = new Date(testDate)

	const formattedDate = parsedDate.toISOString().split('T')[0]

	// Check for date-specific slots
	// eslint-disable-next-line no-prototype-builtins
	if (dateSlots.hasOwnProperty(formattedDate)) {
		const dateSpecificSlots = dateSlots[formattedDate]
		return dateSpecificSlots.some((slot) => isTimeInRange(slot, startTime, endTime))
	}

	// Get the day of the week from the parsed date
	const dayOfWeek = parsedDate.toLocaleString('en-US', { weekday: 'short' }).toLowerCase()
	// eslint-disable-next-line no-prototype-builtins
	if (weeklySlots.hasOwnProperty(dayOfWeek)) {
		const weeklyDaySlots = weeklySlots[dayOfWeek]
		return weeklyDaySlots.some((slot) => isTimeInRange(slot, startTime, endTime))
	}

	return false
}
const isCorrectTime = (eventSchedule, eventSlot) => {
	// eslint-disable-next-line no-restricted-syntax
	for (const slotDate of Object.keys(eventSlot)) {
		const [start, end] = eventSlot[slotDate][0].split('-')
		if (!isInSchedule(slotDate, start, end, eventSchedule)) {
			return false
		}
	}
	return true
}

module.exports = {
	makeSchedule,
	makeMeetingSlot,
	isCorrectTime,
}
