import get from 'lodash/get'
import omit from 'lodash/omit'
import isString from 'lodash/isString'

import { changeLocationQuery } from './browser'
import { hasWindow } from './common'

export const queryString = {
	get(key: string) {
		return get(this.parse(), key)
	},
	parse(query?: string) {
		if (!hasWindow()) return null
		if (!query) query = location.search.substring(1)
		return Object.fromEntries(new URLSearchParams(query))
	},
	stringify(v: object) {
		const params = new URLSearchParams()
		Object.entries(v).forEach(([key, value]: [string, any]) => {
			params.append(key, value)
		})
		return params.toString()
	},
	set(key: string | { [key: string]: any }, value: any = '') {
		const params = isString(key) ? { [key]: value } : key
		return changeLocationQuery(
			queryString.stringify({
				...(queryString.parse() || {}),
				...params,
			})
		)
	},
	remove(...keys: string[]) {
		if (!keys.length) changeLocationQuery('')
		return changeLocationQuery(
			queryString.stringify(omit(queryString.parse() || {}, ...keys))
		)
	},
}
