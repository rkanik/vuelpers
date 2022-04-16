import { Match } from './array.types'
import { isSame } from './array.helper'

function findIndexes<T>(array: T[], item: T, match: Match<T>) {
	return array.reduce((indexes: number[], currentItem, index) => {
		if (isSame(currentItem, item, match)) indexes.push(index)
		return indexes
	}, [])
}

export { findIndexes }
