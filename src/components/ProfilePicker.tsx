import { type FormEvent, useState } from 'react'
import {
	type Profile,
	getProfileById,
	getProfiles,
	setLastUsedProfile,
} from '../data/ProfilesApi.ts'
import { CreateProfile } from './CreateProfile.tsx'

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

export default ProfilePicker
