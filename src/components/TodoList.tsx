import { type Todo } from '../data/TodoListApi.ts'
import styles from './TodoList.module.css'
import { TodoItem } from './TodoItem.tsx'

function TodoList(props: {
	list: Todo[]
	onChange: () => void
}) {
	return (
		<ul className={styles.container}>
			{props.list.map((todo) => (
				<TodoItem key={todo.id} todo={todo} onChange={props.onChange} />
			))}
		</ul>
	)
}

export default TodoList
