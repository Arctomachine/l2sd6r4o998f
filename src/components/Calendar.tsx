import { useState } from 'react'
import styles from './Calendar.module.css'

type DayObject = {
	id: string
	day: number | null
}

/**
 * Список дней в выбранном месяце
 * @param year
 * @param month
 */
function getMonthDays(year: number, month: number): DayObject[] {
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
function getWeekDays() {
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
function moveMonth(date: [number, number], up: boolean): [number, number] {
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

function Calendar() {
	const date = new Date()
	const year = date.getFullYear()
	const month = date.getMonth() + 1

	const [currentYearMonth, setCurrentYearMonth] = useState<[number, number]>([
		year,
		month,
	])
	const monthDays = getMonthDays(currentYearMonth[0], currentYearMonth[1])

	return (
		<>
			<h1>
				{Intl.DateTimeFormat(undefined, {
					year: 'numeric',
					month: 'long',
				}).format(new Date(currentYearMonth[0], currentYearMonth[1]))}
			</h1>
			<button
				type="button"
				onClick={() =>
					setCurrentYearMonth((prevState) => moveMonth(prevState, false))
				}
			>
				Назад
			</button>
			<button
				type="button"
				onClick={() =>
					setCurrentYearMonth((prevState) => moveMonth(prevState, true))
				}
			>
				Вперед
			</button>
			<section className={styles.gridContainer}>
				<div className={styles.grid}>
					{getWeekDays().map((day) => (
						<div key={day} className={styles.day}>
							{day}
						</div>
					))}
				</div>
				<div className={styles.grid}>
					{monthDays.map((day) => (
						<Day key={day.id} day={day.day} />
					))}
				</div>
			</section>
		</>
	)
}

function Day(props: { day: DayObject['day'] }) {
	if (props.day === null) {
		return <div className={styles.day} />
	}
	return <div className={styles.day}>{props.day}</div>
}

export default Calendar
