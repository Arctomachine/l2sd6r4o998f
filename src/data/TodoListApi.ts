import type { Profile } from './ProfilesApi.ts'

export type Todo = {
	id: string
	title: string
	isDone: boolean
	profileId?: Profile['id']
}

type Day = {
	id: string
	todos: Todo[]
}

export function addNewTodo(
	year: number,
	month: number,
	day: number,
	title: string,
	profileId?: Profile['id'],
) {
	const id = Date.now().toString(36)
	const todo: Todo = {
		id,
		title,
		isDone: false,
	}

	if (profileId) {
		todo.profileId = profileId
	}

	const existingTodos = getTodosByDay(year, month, day)

	if (existingTodos) {
		existingTodos.todos.push(todo)
		localStorage.setItem(
			`todo-${year}-${month}-${day}`,
			JSON.stringify(existingTodos),
		)
		return
	}

	const newDay: Day = {
		id: `${year}-${month}-${day}`,
		todos: [todo],
	}

	localStorage.setItem(`todo-${year}-${month}-${day}`, JSON.stringify(newDay))
}

export function getTodoById(id: string) {
	const keys = Object.keys(localStorage)
	const todoKeys = keys.filter((key) => key.startsWith('todo'))

	for (const todoKey of todoKeys) {
		const dayData = localStorage.getItem(todoKey)

		if (dayData) {
			const day = JSON.parse(dayData) as Day
			const todo = day.todos.find((todo) => todo.id === id)

			if (todo) {
				return todo
			}
		}
	}

	return null
}

export function updateTodo(todo: Todo) {
	const keys = Object.keys(localStorage)
	const todoKeys = keys.filter((key) => key.startsWith('todo'))

	for (const todoKey of todoKeys) {
		const dayData = localStorage.getItem(todoKey)

		if (dayData) {
			const day = JSON.parse(dayData) as Day
			const todoIndex = day.todos.findIndex((dayTodo) => dayTodo.id === todo.id)

			if (todoIndex !== -1) {
				day.todos[todoIndex] = todo
				localStorage.setItem(todoKey, JSON.stringify(day))
				return
			}
		}
	}

	alert('Ошибка: задача не найдена')
}

export function deleteTodo(id: string) {
	const keys = Object.keys(localStorage)
	const todoKeys = keys.filter((key) => key.startsWith('todo'))

	for (const todoKey of todoKeys) {
		const dayData = localStorage.getItem(todoKey)

		if (dayData) {
			const day = JSON.parse(dayData) as Day
			const todoIndex = day.todos.findIndex((dayTodo) => dayTodo.id === id)

			if (todoIndex !== -1) {
				day.todos.splice(todoIndex, 1)
				localStorage.setItem(todoKey, JSON.stringify(day))

				if (day.todos.length === 0) {
					localStorage.removeItem(todoKey)
				}

				return
			}
		}
	}

	alert('Ошибка: задача не найдена')
}

export function getTodosByDay(
	year: number,
	month: number,
	day: number,
): Day | null {
	const todos = localStorage.getItem(`todo-${year}-${month}-${day}`)

	return todos ? JSON.parse(todos) : null
}
