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