const API_URL = 'https://isdayoff.ru/api/getdata'

type IsDayOffDataErrors = '100' | '101' | '199'

// dependency inversion
type IsDayOffData = (
	year: number,
	month: number,
	delimeter?: string,
) => Promise<string[]>
export const getDayOffData: IsDayOffData = async (
	year: number,
	month: number,
	delimeter = ',',
) => {
	const cachedResponse = localStorage.getItem(`IsDayOffCache-${year}-${month}`)

	if (cachedResponse) {
		return cachedResponse.split(delimeter)
	}

	const response = await fetch(
		`${API_URL}?year=${year}&month=${month}&delimeter=${encodeURI(delimeter)}`,
	)

	if (response.status === 400) {
		const error = (await response.text()) as IsDayOffDataErrors

		if (error === '100') {
			throw new Error('IsDayOffApi: Ошибка запроса: ошибка в дате')
		}

		if (error === '199') {
			throw new Error('IsDayOffApi: Ошибка запроса: ошибка сервиса')
		}
	}

	if (response.status === 404) {
		throw new Error('IsDayOffApi: Ошибка запроса: данные не найдены')
	}

	if (response.status !== 200) {
		throw new Error(
			`IsDayOffApi: Ошибка запроса ${response.status} ${response.statusText}`,
		)
	}

	const data = await response.text()

	localStorage.setItem(`IsDayOffCache-${year}-${month}`, data)
	return data.split(delimeter)
}
