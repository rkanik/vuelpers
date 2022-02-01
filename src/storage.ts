import { jsonParse, secureDataType } from "./common"
import { decodeString, encodeString } from "./strings"

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
