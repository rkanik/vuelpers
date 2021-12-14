import _ from 'lodash'
import { TIME } from './consts'
import { createAPI } from './axios'
import { getPercentage } from './numbers'
import { stringReplace, decodeString, encodeString } from './strings'
import { createGetters, createMutations, handleAction } from './vuex'
import { convertKeysToCamelCase, convertKeysToSnakeCase, omitEmpties } from './objects'
import { partialObject, isEmpty } from './legacy'
import { encodedCookies } from './cookies'
import { queryString } from './query-string'

interface PasswordType {
	length: number
	chars: boolean
	symbols: boolean
	numbers: boolean
}

/**
 *
 * @param {number} time - How much time have to sleep
 * @param {string} unit - Unit of time ['s'-seconds,'m'-minute,'h'-houre]
 */
export const sleep = (time: number = 1000, unit: 'ms' | 'sec' | 'min' | 'hr' = 'ms') => new Promise<any>((resolve) => {
	const ms = unit === 'sec'
		? time * 1000 : unit === 'min'
			? time * 60 * 1000 : unit === 'hr'
				? time * 60 * 60 * 1000 : time;
	setTimeout(() => resolve(''), ms);
});

export const miniId = (len: number = 5) => {
	return Math.random()
		.toString(36).slice(len <= 10 ? -len : -10)
}

export const generatePassword = (config: Partial<PasswordType> = {}) => {
	let defaultType: PasswordType = {
		length: 8,
		chars: true,
		numbers: true,
		symbols: false,
		...config
	}
	const
		numbers = '0123456789',
		symbols = "!@#$%^&*()_+><{};:.,",
		chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

	let password = '', sourceString = ''

	if (defaultType.chars) sourceString += chars
	if (defaultType.numbers) sourceString += numbers
	if (defaultType.symbols) sourceString += symbols

	for (var i = 0, n = sourceString.length; i < defaultType.length; ++i) {
		password += sourceString.charAt(Math.floor(Math.random() * n));
	}
	return password;
}

export const getPairs = (array: any[], length: number = 2) => {
	let start = 0, pairs: any = []
	while (start < (array.length - 1)) {
		pairs = pairs.concat(
			[[...Array(length)].map(
				(_, index) => array[start + index]
			)]
		)
		start += 1
	}
	return pairs
}

export const encodedLS = {
	getItem(key: string): any {
		let data = localStorage.getItem(key)
		if (!data) return null

		const [error, parsed] = jsonParse(decodeString(data))
		if (!error) return parsed

		return secureDataType(data)
	},
	setItem(key: string, value: string) {
		localStorage.setItem(
			key, encodeString(JSON.stringify(value))
		)
	},
	removeItem(key: string) {
		localStorage.removeItem(key)
	},
}

export const hasHistory = (): boolean => {
	return window.history.length > 2
}

export const changeLocationQuery = (query: string) => {
	if (window.history.pushState) {
		const newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + '?' + query
		window.history.pushState({ path: newurl }, '', newurl)
	}
}

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

export const toFormData = (value: any, extra: object = {}) => {
	const data = { ...convertKeysToSnakeCase(value), ...extra }
	const formData = new FormData()

	const traverse = (value: any, key?: any) => {
		if (_.isArray(value)) {
			value.forEach((v: any, index) => {
				traverse(v, key ? `${key}[${index}]` : index)
			})
		} else if (_.isPlainObject(value)) {
			Object.entries(value).forEach(([p, v]: any[]) => {
				traverse(v, key ? `${key}[${p}]` : p)
			})
		} else {
			formData.append(key, value)
		}
	}
	traverse(data)
	return formData
}

export {
	_,
	// const
	TIME,
	//Any
	isEmpty,
	// strings
	queryString,
	stringReplace,
	encodeString,
	decodeString,
	// objects
	omitEmpties,
	partialObject,
	convertKeysToCamelCase,
	convertKeysToSnakeCase,
	// vuex
	handleAction,
	createGetters,
	createMutations,
	// axios
	createAPI,
	// numbers
	getPercentage,
	// Cookies
	encodedCookies
}