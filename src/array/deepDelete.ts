import { get, isArray } from 'lodash'
import { Match } from './array.types'
import { findIndexes } from './findIndexes'
import { extractMatch, isSame } from './array.helper'

type Options<T> = {
	copy?: boolean
	match?: Match<T>
	multiple?: boolean
}

function deepDelete<T = any>(
	array: T[],
	item: T | T[],
	options?: Match<T> | Options<T>
) {
	// Passed input is not an array
	if (!isArray(array)) return array

	const match = extractMatch(options)
	const copy: boolean = get(options, 'copy', true)
	const multiple: boolean = get(options, 'multiple', false)

	for (const eachItem of isArray(item) ? item : [item]) {
		// Find the index of the item to delete
		const indexes = multiple
			? findIndexes(array, eachItem, match)
			: [array.findIndex((i) => isSame(i, eachItem, match))]

		// item not found
		if (!indexes.length || indexes[0] === -1) return array

		// delete item at index
		for (const index of indexes) {
			// delete the item
			array.splice(index, 1)
		}
	}

	return copy ? [...array] : array
}

export { deepDelete }
