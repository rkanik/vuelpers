import { AnyRecord } from "./types"

type ArrayElement<ArrayType> = ArrayType extends readonly (infer ElementType)[]
	? ElementType
	: never

type Select<T> = keyof Required<T>
type With<T> = {
	[key in keyof Required<T>]?: Required<T>[key] extends unknown[]
		? (
				| Select<ArrayElement<Required<T>[key]>>
				| With<ArrayElement<Required<T>[key]>>
		  )[]
		: (Select<Required<T>[key]> | With<Required<T>[key]>)[]
}

export const selectWith = <T>(args: (Select<T> | With<T>)[]) => {
	return JSON.stringify(args)
}

export const miniId = (len: number = 5) => {
	return Math.random()
		.toString(36).slice(len <= 10 ? -len : -10)
}

export const removeSpecialChars = (str: string) => {
	return str.replace(/[^a-zA-Z0-9 ]/g, '').trim()
}

export const slugify = (str: string) => {
	return removeSpecialChars(str)
		.toLowerCase()
		.split(' ')
		.filter((a) => a)
		.map((a) => a.trim())
		.join('-')
}

export const isExactSame = (value1: AnyRecord, value2: AnyRecord) => {
	return JSON.stringify(value1) === JSON.stringify(value2)
}

interface PasswordType { length?: number, chars?: boolean, symbols?: boolean, numbers?: boolean }
export const generatePassword = (config: PasswordType = {}) => {
	let { length = 8, chars = true, numbers = true, symbols = false }: PasswordType = config
	const
		_numbers = '0123456789',
		_symbols = "!@#$%^&*()_+><{};:.,",
		_chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'

	let password = '', sourceString = ''

	if (chars) sourceString += _chars
	if (numbers) sourceString += _numbers
	if (symbols) sourceString += _symbols

	for (var i = 0, n = sourceString.length; i < length; ++i) {
		password += sourceString.charAt(Math.floor(Math.random() * n));
	}
	return password;
}

export const stringReplace = (
	string: string,
	start: number,
	replacement: string,
	end: number = string.length
) => {
	return (
		string.substring(0, start) +
		replacement +
		string.substring(end)
	)
}

/** Encode string to base64 */
export const encodeString = (str: any) => {
	const _unescape = window.unescape || window.decodeURI
	try {
		return window.btoa(_unescape(encodeURIComponent(str)))
	}
	catch {
		return str
	}
}

/** Decode base64 to string */
export const decodeString = (encoded: any) => {
	const _escape = window.escape || window.encodeURI
	try {
		return decodeURIComponent(_escape(window.atob(encoded)))
	}
	catch { return encoded }
}
