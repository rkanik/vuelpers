import _ from 'lodash'

export { _ }

export const getCurrentCountry = (): Promise<[country: { code: string, name: string } | null, error: any]> => {
	return new Promise((resolve) => {
		return fetch("https://ip2c.org/s")
			.then((res) => res.text())
			.then((response) => {
				let result = (response || "").toString();
				if (!result || result[0] !== "1") return resolve([null, { message: 'Error while fetching country' }]);
				return resolve([{ code: result.substring(2, 4), name: result.substring(9) }, null]);
			})
			.catch((err) => resolve([err, null]))
	})
}

export const jsonParse = (input: string): [error: boolean, parsed: any] => {
	try {
		const parsed = JSON.parse(input)
		return [false, parsed]
	}
	catch (_) { return [true, null] }
}

export const secureDataType = (input: any) => {

	// Non string
	if (!_.isString(input)) return input

	// Empty string
	if (!input.length) return input

	if (input === 'undefined') return undefined

	// Possible intended string
	if (['0', '+', '-'].some(v => input.startsWith(v))) return input

	// Json encoded
	const [parseError, parsedData] = jsonParse(input)
	if (!parseError) return parsedData

	// try to convert
	const converted = +input
	if (isNaN(converted)) return input

	return converted
}

export const convertKeysToSnakeCase = (data: any): any => {
	const nested = (b: any) => {
		return (_.isArray(b) || _.isPlainObject(b))
			? convertKeysToSnakeCase(b) : b
	}
	if (_.isString(data)) return _.snakeCase(data)
	if (_.isArray(data)) return data.map(nested)
	if (_.isPlainObject(data)) return Object.entries(data)
		.reduce((converted: any, [key, value]: any[]) => {
			key = convertKeysToSnakeCase(key)
			return { ...converted, [key]: nested(value) }
		}, {})
	return data
}

export const convertKeysToCamelCase = (data: any): any => {
	const nested = (b: any) => {
		return (_.isArray(b) || _.isPlainObject(b))
			? convertKeysToCamelCase(b)
			: secureDataType(b)
	}
	if (_.isString(data)) return _.camelCase(data)
	if (_.isArray(data)) { return data.map(nested) }
	if (_.isPlainObject(data)) return Object.entries(data)
		.reduce((converted: any, [key, value]: any[]) => {
			key = convertKeysToCamelCase(key)
			return { ...converted, [key]: nested(value) }
		}, {})
	return data
}