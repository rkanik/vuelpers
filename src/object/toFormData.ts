import { TextCase } from '../types'
import { ensureCase } from './ensureCase'
import { HTTPMethod } from '../types/http'

import {
	isDate,
	isArray,
	isString,
	isBoolean,
	isFunction,
	isPlainObject,
} from 'lodash'

export interface LegacyFormDataConfig {
	convertCase?: TextCase
}
export interface FormDataConfig {
	convertCase?: TextCase
	_method?: HTTPMethod
	removeNull?: boolean
	removeUndefined?: boolean
	booleanAsNumber?: boolean
	dateToISOString?: boolean
	removeFalsy?: boolean
	removeEmptyString?: boolean
}
export const toFormData = <T = any>(
	value: T,
	config: FormDataConfig = {},
	legacy: LegacyFormDataConfig = {}
) => {
	let {
		_method,
		convertCase,
		removeNull = true,
		removeUndefined = true,
		booleanAsNumber = true,
		dateToISOString = true,
		removeFalsy = true,
		removeEmptyString = true,
	} = config

	// Change case of keys
	convertCase = convertCase || legacy?.convertCase
	value = ensureCase(value, convertCase)

	// _method
	if (_method) (value as any)._method = _method

	const formData = new FormData()

	const traverse = (value: any, key?: any) => {
		// Recursive call for nested arrays
		if (isArray(value)) {
			value.forEach((v: any, index) => {
				traverse(v, key ? `${key}[]` : index)
			})
			return
		}
		// Recursive call for nested objects
		else if (isPlainObject(value)) {
			Object.entries(value).forEach(([p, v]: any[]) => {
				traverse(v, key ? `${key}[${p}]` : p)
			})
			return
		}

		// return for falsy values
		if (removeFalsy && [NaN, Infinity, -Infinity].includes(value)) return

		// Return if value is null
		if (removeNull && value === null) return

		// Return if value is undefined
		if (removeUndefined && value === undefined) return

		// Remove empty strings
		if (removeEmptyString && isString(value) && !value.trim()) return

		// Return if function
		if (isFunction(value)) return

		// Convert booleans to 0 1
		if (booleanAsNumber && isBoolean(value)) {
			value = +value
		}

		// Convert date to ISO string
		if (dateToISOString && isDate(value)) {
			value = value.toISOString()
		}

		formData.append(key, value)
	}

	// Traverse the given object
	traverse(value)

	// return formData
	return formData
}

console.log(
	toFormData({
		firstName: 'John Doe',
	})
)
