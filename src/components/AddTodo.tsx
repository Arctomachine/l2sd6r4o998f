import { type FormEvent, useState } from 'react'
import { addNewTodo } from '../data/TodoListApi.ts'

function AddTodo(props: {
	year: number
	month: number
	day: number
	onReady: () => void
}) {
	const [inputMode, setInputMode] = useState(false)
	const [title, setTitle] = useState('')

	function onToggleInputMode() {
		if (!inputMode) {
			setInputMode(true)
		}
	}

	function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()

		if (!title.trim() || !inputMode) {
			return
		}

		addNewTodo(props.year, props.month, props.day, title)
		setTitle('')
		props.onReady()
	}

	function onReset() {
		setInputMode(false)
		setTitle('')
	}

	return (
		<form onSubmit={onSubmit}>
			{inputMode ? (
				<input
					type="text"
					value={title}
					onChange={(e) => setTitle(e.target.value)}
				/>
			) : null}
			<button
				type={inputMode ? 'submit' : 'button'}
				onClick={onToggleInputMode}
				disabled={inputMode && !title.trim()}
			>
				Добавить {inputMode ? '' : 'задачу'}
			</button>
			{inputMode ? (
				<button type="reset" onClick={onReset}>
					Отмена
				</button>
			) : null}
		</form>
	)
}

export default AddTodo
