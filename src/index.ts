import _ from 'lodash'

export { _ }

export const jsonParse = (input: string) => {
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