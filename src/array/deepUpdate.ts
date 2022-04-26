import { get, set, isArray, isObject, isFunction } from 'lodash'
import { Match } from './array.types'
import { findIndexes } from './findIndexes'
import { extractMatch, isSame } from './array.helper'

type Options<T> = {
	key?: keyof T
	copy?: boolean
	multiple?: boolean
	match?: Match<T>
	replace?: boolean
}

type UpdateFn<T> = (item: T) => T

function deepUpdate<T = any>(
	array: T[],
	item: T | UpdateFn<T> | (T | UpdateFn<T>)[],
	options?: Match<T> | Options<T>
): T[] {
	// Passed input is not an array
	if (!isArray(array)) return array

	const match = extractMatch(options)
	const key: string = get(options, 'key', 'id')
	const copy: boolean = get(options, 'copy', true)
	const replace: boolean = get(options, 'replace', false)
	const multiple: boolean = get(options, 'multiple', false)

	for (const updatedItem of isArray(item) ? item : [item]) {
		// Find the index of the item to update
		const indexes = multiple
			? findIndexes(array, updatedItem, match)
			: [array.findIndex((i) => isSame(i, updatedItem, match))]

		// item not found
		if (!indexes.length || indexes[0] === -1) return array

		// update item at index
		for (const index of indexes) {
			// reference to the item to update
			const currentItem = array[index]

			let updatedCurrentItem: any

			if (isFunction(updatedItem)) {
				updatedCurrentItem = updatedItem(currentItem)
			} else if (isObject(updatedItem)) {
				// copy the item to update
				updatedCurrentItem = !replace
					? { ...currentItem, ...updatedItem }
					: updatedItem

				// keep the keyProperty same as the original item
				if (key) {
					updatedCurrentItem[key] = get(currentItem, key)
				}
			} else {
				updatedCurrentItem = updatedItem
			}

			// update the item
			set(array, index, updatedCurrentItem)
		}
	}

	// return updated array
	return copy ? [...array] : array
}

export { deepUpdate, findIndexes }
