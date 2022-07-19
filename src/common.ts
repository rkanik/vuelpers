import { isMobile } from './browser'
import { isPlainObject, isString, isArray } from 'lodash'

export const isStrictSame = (value1: any, value2: any): boolean => {
	if (typeof value1 !== typeof value2) return false
	if (isArray(value1)) {
		if (value1.length !== value2.length) return false
		for (let i = 0; i < value1.length; i++) {
			if (!isStrictSame(value1[i], value2[i])) {
				return false
			}
		}
		return true
	}
	if (isPlainObject(value1)) {
		return !Object.keys(value1).some((key) => {
			return !isStrictSame(value1[key], value2[key])
		})
	}
	return value1 === value2
}

/**
 *
 * @param {number} time - How much time have to sleep
 * @param {string} unit - Unit of time ['sec'-seconds,'min'-minute,'hr'-hour]
 */
export const sleep = (
	time: number = 1000,
	unit: 'ms' | 'sec' | 'min' | 'hr' = 'ms'
) =>
	new Promise<any>((resolve) => {
		const ms =
			unit === 'sec'
				? time * 1000
				: unit === 'min'
				? time * 60 * 1000
				: unit === 'hr'
				? time * 60 * 60 * 1000
				: time
		setTimeout(() => resolve(''), ms)
	})

export const isEmpty = (value: any) => {
	if ([undefined, null, ''].includes(value)) return true
	if (Array.isArray(value) && !value.length) return true
	if (isPlainObject(value) && !Object.keys(value).length) return true
	return false
}

export const getCurrentCountry = (): Promise<
	[country: { code: string; name: string } | null, error: any]
> => {
	return new Promise((resolve) => {
		return fetch('https://ip2c.org/s')
			.then((res) => res.text())
			.then((response) => {
				let result = (response || '').toString()
				if (!result || result[0] !== '1')
					return resolve([
						null,
						{ message: 'Error while fetching country' },
					])
				return resolve([
					{ code: result.substring(2, 4), name: result.substring(9) },
					null,
				])
			})
			.catch((err) => resolve([err, null]))
	})
}

export const jsonParse = (input: string): [error: boolean, parsed: any] => {
	try {
		const parsed = JSON.parse(input)
		return [false, parsed]
	} catch (_) {
		return [true, null]
	}
}

export const secureDataType = (input: any) => {
	// Non string
	if (!isString(input)) return input

	// Empty string
	if (!input.length) return input

	if (input === 'undefined') return undefined

	// Possible intended string
	if (['+', '-'].some((v) => input.startsWith(v))) return input

	// Possible intended number (without 0.00)
	if (input.startsWith('0') && input.length > 1 && !input.startsWith('0.'))
		return input

	// Json encoded
	const [parseError, parsedData] = jsonParse(input)
	if (!parseError) return parsedData

	// try to convert
	const converted = +input
	if (isNaN(converted)) return input

	return converted
}

interface BreakpointsUp {
	sm?: number
	md?: number
	lg?: number
	xl?: number
	xxl?: number
}
export const calculateBreakpoint = (
	width: number = window.innerWidth,
	breakpoints: BreakpointsUp = {}
) => {
	const {
		sm = 640,
		md = 768,
		lg = 1024,
		xl = 1280,
		xxl = 1536,
	}: BreakpointsUp = breakpoints
	return {
		mobile: isMobile(),
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
