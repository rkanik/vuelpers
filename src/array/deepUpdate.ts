import { get, set, isArray, isFunction, isString } from 'lodash'

type CompareFn<T> = (a: T, b: T) => boolean
type Match<T> = string | CompareFn<T>
type Options<T> = {
	key?: keyof T
	copy?: boolean
	multiple?: boolean
	match?: Match<T>
}

function extractMatch<T>(v?: Match<T> | Options<T>) {
	if (isString(v) || isFunction(v)) return v
	return v?.match || 'id'
}

function isSame<T>(el1: T, el2: T, match: Match<T>): boolean {
	return (
		(isString(match) && get(el1, match) === get(el2, match)) ||
		(isFunction(match) && match(el1, el2))
	)
}

function findIndexes<T>(array: T[], item: T, match: Match<T>) {
	return array.reduce((indexes: number[], currentItem, index) => {
		if (isSame(currentItem, item, match)) indexes.push(index)
		return indexes
	}, [])
}

function deepUpdate<T = any>(
	array: T[],
	item: T,
	options?: Match<T> | Options<T>
): T[] {
	// Passed input is not an array
	if (!isArray(array)) return array

	const match = extractMatch(options)
	const key: string = get(options, 'key', 'id')
	const copy: boolean = get(options, 'copy', false)
	const multiple: boolean = get(options, 'multiple', false)

	// Find the index of the item to update
	const indexes = multiple
		? findIndexes(array, item, match)
		: [array.findIndex((i) => isSame(i, item, match))]

	// item not found
	if (!indexes.length || indexes[0] === -1) return array

	// update item at index
	for (const index of indexes) {
		const cItem = array[index]
		set(array, index, { ...cItem, ...item, [key]: get(cItem, key) })
	}

	// return updated array
	return copy ? [...array] : array
}

export { deepUpdate }
