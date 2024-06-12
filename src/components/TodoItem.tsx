import { type FormEvent, type MouseEvent, useState } from 'react'
import { type Todo, deleteTodo, updateTodo } from '../data/TodoListApi.ts'
import styles from './TodoList.module.css'

export function TodoItem(props: {
	todo: Todo
	onChange: () => void
}) {
	const [inputMode, setInputMode] = useState(false)
	const [deleteMode, setDeleteMode] = useState(false)

	const [title, setTitle] = useState(props.todo.title)

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		onAccept()
	}

	function onToggleDone() {
		updateTodo({ ...props.todo, isDone: !props.todo.isDone })
		props.onChange()
	}

	function onInputMode(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault()
		setInputMode(true)
	}

	function onDeleteMode(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault()
		setDeleteMode(true)
	}

	function onAccept() {
		if (inputMode) {
			setInputMode(false)
			updateTodo({ ...props.todo, title })
		}

		if (deleteMode) {
			deleteTodo(props.todo.id)
		}

		props.onChange()
	}

	function onCancel() {
		if (inputMode) {
			setInputMode(false)
			setTitle(props.todo.title)
		}

		if (deleteMode) {
			setDeleteMode(false)
		}
	}

	return (
		<li>
			<form onSubmit={onSubmit}>
				<input
					type="checkbox"
					checked={props.todo.isDone}
					onChange={onToggleDone}
				/>
				{inputMode || deleteMode ? (
					<>
						<button type="submit" onClick={onAccept}>
							✓
						</button>
						<button type="reset" onClick={onCancel}>
							✕
						</button>
					</>
				) : (
					<>
						<button type="button" onClick={onInputMode} title="Редактировать">
							✎
						</button>
						<button type="button" onClick={onDeleteMode} title="Удалить">
							🗑
						</button>
					</>
				)}
				{inputMode ? (
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
					/>
				) : (
					<>
						{deleteMode ? 'Удалить? ' : null}
						<span className={props.todo.isDone ? styles.isDone : ''}>
							{title}
						</span>
					</>
				)}
			</form>
		</li>
	)
}
