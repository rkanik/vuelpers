import _ from 'lodash'

export const jsonParse = (input: string) => {
	try {
		let parsed = JSON.parse(input)
		return [false, parsed]
	}
	catch (err) { return [err] }
}

export const secureDataType = (input: any) => {

	// Non string
	if (!_.isString(input)) return input

	// Json encoded
	let [err, parsed] = jsonParse(input)
	if (!err) return parsed

	// Empty string
	if (!input.length) return input

	// Possible intended string
	if (input.startsWith('+') || input.startsWith('-')) return input

	// try to convert
	let converted = +input
	if (isNaN(converted)) return input

	return converted
}

export const convertKeysToSnakeCase = (data: any): any => {
	if (_.isString(data)) return _.snakeCase(data)
	if (_.isArray(data)) return data.map(
		el => _.isArray(el) || _.isPlainObject(el)
			? convertKeysToSnakeCase(el)
			: el
	)
	if (_.isPlainObject(data)) return Object.entries(data)
		.reduce((nData: any, [key, value]: any[]) => {
			nData[convertKeysToSnakeCase(key)] =
				_.isArray(value) || _.isPlainObject(value)
					? convertKeysToSnakeCase(value)
					: value;
			return nData
		}, {})
	return data
}

export const convertKeysToCamelCase = (data: any): any => {
	if (_.isString(data)) return _.camelCase(data)
	if (_.isArray(data)) {
		return data.map(el => {
			if (_.isArray(el) || _.isPlainObject(el)) {
				return convertKeysToCamelCase(el)
			} return el
		})
	}
	if (_.isPlainObject(data)) return Object.entries(data)
		.reduce((nData: any, [key, value]: any[]) => {
			nData[convertKeysToCamelCase(key)] =
				(_.isArray(value) || _.isPlainObject(value))
					? convertKeysToCamelCase(value)
					: secureDataType(value);
			return nData
		}, {})
	return data
}