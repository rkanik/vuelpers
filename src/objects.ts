import _ from 'lodash'
import { secureDataType } from './index'

export const partialObject = (object: any, ...keys: string[]): { [key: string]: any } => {
	return keys.reduce((data: any, key: any) => {
		if (!key) return data
		const splitted = key.split('.')
		if (_.has(object, key)) data[key] = object[key]
		else if (splitted.length > 1 && _.has(object, splitted[0])) {
			data[splitted[0]] = partialObject(
				object[splitted[0]],
				splitted.slice(1).join('.').split(',')
			)
		}
		return data
	}, {})
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