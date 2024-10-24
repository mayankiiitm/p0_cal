const { DateTime } = require('luxon')

const getAvailability = (data, startDate, endDate) => {
	const result = {}
	const end = new Date(endDate)
	const dayNames = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
	const currentDate = new Date(startDate)
	while (currentDate <= end) {
		const dayOfWeek = dayNames[currentDate.getDay()]
		const formattedDate = currentDate.toISOString().split('T')[0]
		if (data.dateSlots[formattedDate]) {
			result[formattedDate] = data.dateSlots[formattedDate]
		} else if (data.weeklySlots[dayOfWeek]) {
			result[formattedDate] = data.weeklySlots[dayOfWeek]
		}
		currentDate.setDate(currentDate.getDate() + 1)
	}
	return result
}

// Function to convert time slots with overflow/underflow and split handling
// written mostly with the help of chatGPT, so might have some bugs
const convertTimeSlots = (timeSlots, sourceTimeZone, targetTimeZone) => {
	const convertedSlots = {}

	Object.entries(timeSlots).forEach(([date, slots]) => {
		slots.forEach((slot) => {
			const [startTime, endTime] = slot.split('-')

			// Parse the start and end times in the source time zone
			const startDateTime = DateTime.fromISO(`${date}T${startTime}`, { zone: sourceTimeZone })
			const endDateTime = DateTime.fromISO(`${date}T${endTime}`, { zone: sourceTimeZone })

			// Convert to the target time zone
			const startConverted = startDateTime.setZone(targetTimeZone)

			const endConverted = endDateTime.setZone(targetTimeZone)

			const startDateKey = startConverted.toISODate() // Start date in target zone
			const endDateKey = endConverted.toISODate() // End date in target zone

			// Handle splitting the slot across two dates in the target time zone
			if (startDateKey !== endDateKey) {
				// Part of the slot belongs to the start date
				if (!convertedSlots[startDateKey]) {
					convertedSlots[startDateKey] = []
				}
				convertedSlots[startDateKey].push(`${startConverted.toFormat('HH:mm')}-23:59`)

				// Part of the slot belongs to the next date
				if (!convertedSlots[endDateKey]) {
					convertedSlots[endDateKey] = []
				}
				convertedSlots[endDateKey].push(`00:00-${endConverted.toFormat('HH:mm')}`)
			} else {
				// No date split, the slot stays on the same day
				if (!convertedSlots[startDateKey]) {
					convertedSlots[startDateKey] = []
				}
				convertedSlots[startDateKey].push(`${startConverted.toFormat('HH:mm')}-${endConverted.toFormat('HH:mm')}`)
			}
		})
	})

	return convertedSlots
}

const convertDateWithTimeZone = (dateString, sourceTimeZone, targetTimeZone, timeCase = 'start') => {
	// Set the time based on the timeCase ('start' for 00:00:00, 'end' for 23:59:59)
	const time = timeCase === 'end' ? '23:59:59' : '00:00:00'

	// Create a Date object with the specified time
	const date = new Date(`${dateString}T${time}`)

	// Get the equivalent date in the source time zone
	const sourceDateInUTC = date.toLocaleString('en-US', { timeZone: sourceTimeZone })
	const sourceDate = new Date(sourceDateInUTC)

	// Prepare options for formatting the date in the target time zone
	const targetOptions = {
		timeZone: targetTimeZone,
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}

	// Format the date in the target time zone and extract parts
	const targetDateParts = new Intl.DateTimeFormat('en-US', targetOptions).formatToParts(sourceDate)

	// Extract year, month, and day
	const year = targetDateParts.find((part) => part.type === 'year').value
	const month = targetDateParts.find((part) => part.type === 'month').value
	const day = targetDateParts.find((part) => part.type === 'day').value

	// Construct the final formatted date string in "yyyy-mm-dd" format
	const formattedTargetDate = `${year}-${month}-${day}`

	return formattedTargetDate
}

const timeToMinutes = (time) => {
	const [hours, minutes] = time.split(':').map(Number)
	return hours * 60 + minutes
}

const minutesToTime = (minutes) => {
	const hours = Math.floor(minutes / 60).toString().padStart(2, '0')
	const mins = (minutes % 60).toString().padStart(2, '0')
	return `${hours}:${mins}`
}

// Function to find all overlaps regardless of duration(chatGPT, potential bugs)
const findOverlaps = (slot1, slot2) => {
	const overlaps = {}
	// eslint-disable-next-line no-restricted-syntax
	for (const date in slot1) {
		if (slot2[date]) {
			slot1[date].forEach((meSlot) => {
				const [meStart, meEnd] = meSlot.split('-').map(timeToMinutes)
				slot2[date].forEach((eventSlot) => {
					const [eventStart, eventEnd] = eventSlot.split('-').map(timeToMinutes)

					// Find the overlap between slot1 and slot2
					const overlapStart = Math.max(meStart, eventStart)
					const overlapEnd = Math.min(meEnd, eventEnd)

					// Check if there is any overlap
					if (overlapEnd > overlapStart) {
						const overlapRange = `${minutesToTime(overlapStart)}-${minutesToTime(overlapEnd)}`

						// Store overlaps in an array for each date
						if (!overlaps[date]) {
							overlaps[date] = []
						}

						// Add unique overlaps
						if (!overlaps[date].includes(overlapRange)) {
							overlaps[date].push(overlapRange)
						}
					}
				})
			})
		}
	}
	return overlaps
}

module.exports = {
	getAvailability,
	convertTimeSlots,
	convertDateWithTimeZone,
	findOverlaps,
}
