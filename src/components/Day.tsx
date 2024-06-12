import { useState } from 'react'
import type { Profile } from '../data/ProfilesApi.ts'
import { getTodosByDay } from '../data/TodoListApi.ts'
import type { DayObject } from '../functions.ts'
import AddTodo from './AddTodo.tsx'
import styles from './Calendar.module.css'
import ModalWrapper from './ModalWrapper.tsx'
import TodoList from './TodoList.tsx'

export function Day(props: {
	day: DayObject['day']
	isOff: boolean
	year: number
	month: number
	profile?: Profile['id']
}) {
	const [isOpen, setIsOpen] = useState(false)

	// для работы с реальным сервером лучше загружать весь список в родительском компоненте
	const [dayTodos, setDayTodos] = useState(
		props.day ? getTodosByDay(props.year, props.month, props.day) : null,
	)

	function updateDayTodos() {
		const dayTodos = props.day
			? getTodosByDay(props.year, props.month, props.day)
			: null

		setDayTodos(dayTodos)
	}

	const todosByProfile = dayTodos
		? dayTodos.todos.filter((t) => t.profileId === props.profile)
		: null

	return (
		<>
			<div
				className={[
					styles.day,
					props.isOff && styles.off,
					props.day === null && styles.null,
				].join(' ')}
			>
				{props.day === null ? null : (
					<>
						<button
							type="button"
							aria-label={Intl.DateTimeFormat(undefined, {
								year: 'numeric',
								month: 'long',
								day: 'numeric',
							}).format(new Date(props.year, props.month - 1, props.day))}
							onClick={() => setIsOpen(true)}
						>
							{props.day}
						</button>
						<div className={styles.info}>
							{todosByProfile && todosByProfile.length > 0 ? (
								<>
									<div>☑{todosByProfile.filter((t) => t.isDone).length}</div>
									<div>☐{todosByProfile.filter((t) => !t.isDone).length}</div>
								</>
							) : null}
						</div>
					</>
				)}
			</div>
			{props.day === null ? null : (
				<ModalWrapper
					open={isOpen}
					onClose={() => setIsOpen(false)}
					header={Intl.DateTimeFormat(undefined, {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
					}).format(new Date(props.year, props.month - 1, props.day))}
				>
					<>
						<AddTodo
							year={props.year}
							month={props.month}
							day={props.day}
							onReady={updateDayTodos}
							profileId={props.profile}
						/>
						{todosByProfile ? (
							<TodoList list={todosByProfile} onChange={updateDayTodos} />
						) : null}
					</>
				</ModalWrapper>
			)}
		</>
	)
}
