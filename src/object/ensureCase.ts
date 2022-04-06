import { TextCase } from './../types'
import { convertKeysToCamelCase, convertKeysToSnakeCase } from '../objects'

const caseChanger = {
	camelCase: convertKeysToCamelCase,
	snake_case: convertKeysToSnakeCase,
}

export const ensureCase = (object: any, keyCase?: TextCase): any => {
	if (!keyCase) return object

	// Case changer function
	const cc = caseChanger[keyCase]

	// Return if no case changer
	if (!cc) return object

	// change the case of keys
	return cc(object)
}
