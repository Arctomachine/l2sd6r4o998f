import { type FormEvent, useState } from 'react'
import {
	type Profile,
	createProfile,
	getProfileById,
	getProfiles,
	setLastUsedProfile,
} from '../data/ProfilesApi.ts'

const placeholder = '---'

function ProfilePicker(props: {
	currentProfileId: string | null
	onProfileChange: (profile: Profile | null) => void
}) {
	const [profiles, setProfiles] = useState(getProfiles())
	const [selected, setSelected] = useState(
		props.currentProfileId || placeholder,
	)

	function onSelect(e: FormEvent<HTMLSelectElement>) {
		const profileId = e.currentTarget.value

		setSelected(profileId)
		setLastUsedProfile(profileId)

		const profile = getProfileById(profileId)
		props.onProfileChange(profile)
	}

	return (
		<div>
			Профиль
			<select value={selected} onChange={onSelect}>
				{profiles.length > 0 ? (
					<>
						<option value={placeholder}>{placeholder}</option>
						{profiles.map((profile) => (
							<option key={profile.id} value={profile.id}>
								{profile.name}
							</option>
						))}
					</>
				) : (
					<option value={placeholder}>{placeholder}</option>
				)}
			</select>
			<CreateProfile onProfileAdd={() => setProfiles(getProfiles())} />
		</div>
	)
}

function CreateProfile(props: {
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

export default ProfilePicker
