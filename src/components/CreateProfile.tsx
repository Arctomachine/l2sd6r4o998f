import { type FormEvent, useState } from 'react'
import { createProfile } from '../data/ProfilesApi.ts'

export function CreateProfile(props: {
	onProfileAdd: () => void
}) {
	const [inputMode, setInputMode] = useState(false)
	const [profileName, setProfileName] = useState('')

	function onSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		createProfile({
			name: profileName,
		})

		setInputMode(false)
		setProfileName('')
		props.onProfileAdd()
	}

	function onReset(e: FormEvent<HTMLFormElement>) {
		e.preventDefault()

		setInputMode(false)
		setProfileName('')
	}
	return (
		<form onSubmit={onSubmit} onReset={onReset}>
			{inputMode ? (
				<>
					<input
						type="text"
						value={profileName}
						onChange={(e) => setProfileName(e.target.value)}
					/>
					<button type="submit" disabled={!profileName.length}>
						Добавить
					</button>
					<button type="reset">Отмена</button>
				</>
			) : (
				<button type="button" onClick={() => setInputMode(true)}>
					Создать профиль
				</button>
			)}
		</form>
	)
}
