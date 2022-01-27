import { TIME } from './consts'
import { createAPI } from './axios'
import { getPercentage } from './numbers'
import { partialObject } from './legacy'
import { encodedCookies } from './cookies'
import { queryString } from './query-string'
import { registerComponents } from './vue'
import { isString, isArray, isPlainObject } from 'lodash'
import { stringReplace, decodeString, encodeString } from './strings'
import { importModules, createGetters, createMutations, handleAction } from './vuex'
import { convertKeysToCamelCase, convertKeysToSnakeCase, omitEmpties } from './objects'

export const injectScript = (src: string, id: string, callback: Function) => {
	if (!document) throw new Error("Cant't inject script outside browser/document.")

	if (document.getElementById(id)) return callback()

	const tag = "script"
	const script = document.createElement(tag)
	const scriptTag = document.getElementsByTagName(tag)[0]

	script.id = id
	script.src = src

	if (callback) script.addEventListener("load", () => callback(), false)
	scriptTag?.parentNode?.insertBefore(script, scriptTag)
}

export const isFile = (input: any) => {
	return Object.prototype.toString.call(input) === '[object File]'
}

/**
 *
 * @param {number} time - How much time have to sleep
 * @param {string} unit - Unit of time ['sec'-seconds,'min'-minute,'hr'-hour]
 */
export const sleep = (time: number = 1000, unit: 'ms' | 'sec' | 'min' | 'hr' = 'ms') => new Promise<any>((resolve) => {
	const ms = unit === 'sec'
		? time * 1000 : unit === 'min'
			? time * 60 * 1000 : unit === 'hr'
				? time * 60 * 60 * 1000 : time;
	setTimeout(() => resolve(''), ms);
});

export const isEmpty = (value: any) => {
	if ([undefined, null, '',].includes(value)) return true
	if (Array.isArray(value) && !value.length) return true
	if (isPlainObject(value) && !Object.keys(value).length) return true
	return false
}

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
	if (!isString(input)) return input

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
		if (isArray(value)) {
			value.forEach((v: any, index) => {
				traverse(v, key ? `${key}[${index}]` : index)
			})
		} else if (isPlainObject(value)) {
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

export const isMobile = () => {
	let check = false;
	(function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || (window as any).opera);
	return check;
}

interface BreakpointsUp { sm?: number; md?: number; lg?: number; xl?: number; xxl?: number }
export const calculateBreakpoint = (width: number, breakpoints: BreakpointsUp = {}) => {
	const { sm = 640, md = 768, lg = 1024, xl = 1280, xxl = 1536 }: BreakpointsUp = breakpoints
	return {
		// EXACT
		xs: eval(`${width} < ${sm}`) as boolean,
		sm: eval(`${width} >= ${sm} && ${width} < ${md}`) as boolean,
		md: eval(`${width} >= ${md} && ${width} < ${lg}`) as boolean,
		lg: eval(`${width} >= ${lg} && ${width} < ${xl}`) as boolean,
		xl: eval(`${width} >= ${xl} && ${width} < ${xxl}`) as boolean,
		xxl: eval(`${width} >= ${xxl}`) as boolean,
		// DOWN
		smAndDown: eval(`${width} < ${md}`) as boolean,
		mdAndDown: eval(`${width} < ${lg}`) as boolean,
		lgAndDown: eval(`${width} < ${xl}`) as boolean,
		xlAndDown: eval(`${width} < ${xxl}`) as boolean,
		// UP
		smAndUp: eval(`${width} >= ${sm}`) as boolean,
		mdAndUp: eval(`${width} >= ${md}`) as boolean,
		lgAndUp: eval(`${width} >= ${lg}`) as boolean,
		xlAndUp: eval(`${width} >= ${xxl}`) as boolean,
	}
}

export {
	// const
	TIME,
	//Any

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
	importModules,
	// axios
	createAPI,
	// numbers
	getPercentage,
	// Cookies
	encodedCookies,
	// Vue
	registerComponents
}