import { useEffect, useState } from 'react'
import { getDayOffData } from '../data/IsDayOffApi.ts'
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

	const [calendarIsReady, setCalendarIsReady] = useState(false)
	const [offDaysArray, setOffDaysArray] = useState<string[]>([])

	function onMonthMove(up: boolean) {
		setCalendarIsReady(false)
		setCurrentYearMonth(moveMonth(currentYearMonth, up))
	}

	useEffect(() => {
		getDayOffData(currentYearMonth[0], currentYearMonth[1])
			.then((res) => {
				setOffDaysArray(res)
			})
			.catch((err) => {
				alert(err)
			})
			.finally(() => {
				setCalendarIsReady(true)
			})
	}, [currentYearMonth[0], currentYearMonth[1]])

	return (
		<>
			<h1>
				{Intl.DateTimeFormat(undefined, {
					year: 'numeric',
					month: 'long',
				}).format(new Date(currentYearMonth[0], currentYearMonth[1] - 1))}
			</h1>
			<button
				type="button"
				onClick={() => onMonthMove(false)}
				disabled={!calendarIsReady}
			>
				Назад
			</button>
			<button
				type="button"
				onClick={() => onMonthMove(true)}
				disabled={!calendarIsReady}
			>
				Вперед
			</button>
			<section className={styles.gridContainer}>
				<div className={styles.grid}>
					{getWeekDays().map((day) => (
						<div key={day} className={[styles.day, styles.label].join(' ')}>
							{day}
						</div>
					))}
				</div>
				<div className={styles.grid}>
					{calendarIsReady
						? monthDays.map((day) => (
								<Day
									key={day.id}
									day={day.day}
									isOff={
										typeof day.day === 'number' &&
										offDaysArray[day.day - 1] === '1'
									}
								/>
							))
						: null}
				</div>
			</section>
		</>
	)
}

function Day(props: {
	day: DayObject['day']
	isOff: boolean
}) {
	return (
		<div
			className={[
				styles.day,
				props.isOff && styles.off,
				props.day === null && styles.null,
			].join(' ')}
		>
			{props.day}
		</div>
	)
}

export default Calendar
