import Cookies from 'js-cookie'
import { isArray } from 'lodash'
import { secureDataType } from './common'
import { encodeString, decodeString } from './strings'

interface Cookie {
	key: string
	value: string
	secure?: boolean
	expires?: number | Date
}
export const encodedCookies = {
	set(cookie: Cookie | Cookie[]) {
		const set = ({ key, value, expires, secure }: Cookie) => {
			Cookies.set(key, encodeString(JSON.stringify(value)), { expires, secure })
		}
		if (!isArray(cookie)) set(cookie)
		else cookie.forEach(set)
	},
	get(...keys: string[]): object {
		return keys.reduce((cookies: any, key: string) => {
			const value = decodeString(Cookies.get(key))
			return { ...cookies, [key]: secureDataType(value) }
		}, {})
	},
	remove(...keys: string[]) {
		keys.forEach((key) => Cookies.remove(key))
	},
}
