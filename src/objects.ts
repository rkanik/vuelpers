import _ from 'lodash'
import { secureDataType } from './index'

interface OmitEmptiesConfig {
	ignore?: string[]
	removeEmptyObject?: boolean
}
export const omitEmpties = (object: object, config: OmitEmptiesConfig = {}) => {
	// destructing config with default
	const { ignore = [], removeEmptyObject = true } = config

	// Function to traverse through deep object
	const traverse = (object: any, path: string = '') => {
		return Object.entries(object).reduce(
			(data: any, [key, value]: [string, any]) => {
				// Concat path with parent path
				const currentPath = !path ? key : `${path}.${key}`

				// If value is empty returning
				if (_.isEmpty(value) && !ignore.includes(currentPath)) return data

				// Keeping the value
				if (!_.isPlainObject(value)) data[key] = value

				// if object then traversing again
				else data[key] = traverse(value, currentPath)

				// returning the final object
				return data
			},
			{}
		)
	}

	if (!removeEmptyObject) return traverse(object)
	return traverse(traverse(object))
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