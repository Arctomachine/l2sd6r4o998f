export type DayObject = {
	id: string
	day: number | null
}

/**
 * Список дней в выбранном месяце
 * @param year
 * @param month
 */
export function getMonthDays(year: number, month: number): DayObject[] {
	const daysInMonth: DayObject[] = []

	const firstDay = new Date(year, month - 1, 1)
	const firstDayOfWeek = firstDay.getDay()

	const startDay = new Date(firstDay)
	startDay.setDate(startDay.getDate() - ((firstDayOfWeek + 6) % 7))

	const MAX_WEEKS = 6 * 7
	for (let i = 0; i < MAX_WEEKS; i++) {
		const currentDay = new Date(startDay)
		currentDay.setDate(startDay.getDate() + i)

		if (currentDay.getMonth() + 1 === month) {
			daysInMonth.push({
				id: currentDay.toISOString(),
				day: currentDay.getDate(),
			})
		} else {
			daysInMonth.push({
				id: currentDay.toISOString(),
				day: null,
			})
		}
	}

	// убрать пустую неделю в конце месяца
	while (daysInMonth.slice(-7).every((day) => day.day === null)) {
		daysInMonth.splice(-7, 7)
	}

	return daysInMonth
}

/**
 * Названия дней недели
 */
export function getWeekDays() {
	const date = new Date()
	const locale = navigator.language

	const weekDays: string[] = []
	date.setDate(date.getDate() - ((date.getDay() + 6) % 7)) // понедельник
	for (let i = 0; i < 7; i++) {
		weekDays.push(date.toLocaleDateString(locale, { weekday: 'short' }))
		date.setDate(date.getDate() + 1)
	}

	return weekDays
}

/**
 * Добавляет или отнимает один месяц
 * @param date - дата в формате [год, месяц]
 * @param up - если true, то добавляет, если false, то отнимает
 */
export function moveMonth(
	date: [number, number],
	up: boolean,
): [number, number] {
	let [year, month] = date

	if (up) {
		month += 1
		if (month > 12) {
			month = 1
			year += 1
		}
	} else {
		month -= 1
		if (month < 1) {
			month = 12
			year -= 1
		}
	}

	return [year, month]
}
