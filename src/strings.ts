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
	return window.btoa(_unescape(encodeURIComponent(str)))
}

/** Decode base64 to string */
export const decodeString = (encoded: any) => {
	const _escape = window.escape || window.encodeURI
	return decodeURIComponent(_escape(window.atob(encoded)))
}
