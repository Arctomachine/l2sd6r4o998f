import { useEffect, useState } from 'react'
import { getDayOffData } from '../data/IsDayOffApi.ts'
import { getLastUsedProfile } from '../data/ProfilesApi.ts'
import { getMonthDays, getWeekDays, moveMonth } from '../functions.ts'
import styles from './Calendar.module.css'
import { Day } from './Day.tsx'
import ProfilePicker from './ProfilePicker.tsx'

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

	const [currentProfile, setCurrentProfile] = useState(getLastUsedProfile())

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
			<ProfilePicker
				currentProfileId={currentProfile?.id || null}
				onProfileChange={setCurrentProfile}
			/>
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
									year={currentYearMonth[0]}
									month={currentYearMonth[1]}
									profile={currentProfile?.id}
								/>
							))
						: null}
				</div>
			</section>
		</>
	)
}

export default Calendar
