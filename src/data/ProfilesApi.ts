export type Profile = {
	id: string
	name: string
}

export function createProfile(profile: Omit<Profile, 'id'>) {
	const id = Date.now().toString(36)

	const newProfile: Profile = {
		...profile,
		id,
	}

	localStorage.setItem(`profile-${id}`, JSON.stringify(newProfile))
}

export function getLastUsedProfile() {
	const profileId = localStorage.getItem('last-used-profile')

	if (!profileId) {
		return null
	}

	return getProfileById(profileId)
}

export function setLastUsedProfile(profileId: Profile['id']) {
	localStorage.setItem('last-used-profile', String(profileId))
}

export function getProfileById(id: string): Profile | null {
	const profile = localStorage.getItem(`profile-${id}`)

	return profile ? JSON.parse(profile) : null
}

export function getProfiles() {
	const keys = Object.keys(localStorage)
	const profileKeys = keys.filter((key) => key.startsWith('profile'))

	const profiles: Profile[] = []

	for (const profileKey of profileKeys) {
		const profileData = localStorage.getItem(profileKey)

		if (profileData) {
			const profile = JSON.parse(profileData) as Profile
			profiles.push(profile)
		}
	}

	return profiles
}

export function updateProfile(profile: Profile) {
	const existingProfile = getProfileById(profile.id)

	if (existingProfile) {
		localStorage.setItem(`profile-${profile.id}`, JSON.stringify(profile))
		return
	}

	alert('Ошибка: профиль не найден')
}

export function deleteProfile(id: string) {
	const existingProfile = getProfileById(id)

	if (existingProfile) {
		localStorage.removeItem(`profile-${id}`)
		return
	}

	alert('Ошибка: профиль не найден')
}
