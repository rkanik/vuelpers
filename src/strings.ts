export const miniId = (len: number = 5) => {
	return Math.random()
		.toString(36).slice(len <= 10 ? -len : -10)
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
