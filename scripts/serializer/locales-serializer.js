const fs = require('fs')
const path = require('path')
const { set, get, isString, isArray, isPlainObject } = require('lodash')

const myArgs = process.argv.slice(2)

const iIndex = myArgs.findIndex((arg) => arg === '-i')
const oIndex = myArgs.findIndex((arg) => arg === '-o')
const inputPath = myArgs[iIndex + 1]
const outputPath = myArgs[oIndex + 1]

if (iIndex === -1) throw new Error('No input path provided')
if (oIndex === -1) throw new Error('No output path provided')

const file = fs.readFileSync(path.resolve(__dirname, inputPath), 'utf8')

const serialize = (input) => {
	const output = { ...input }
	const traverse = (value, key) => {
		// Recursive call for nested arrays
		if (isArray(value)) {
			value.forEach((v, index) => {
				traverse(v, key ? `${key}.${index}` : index)
			})
			return
		}
		// Recursive call for nested objects
		else if (isPlainObject(value)) {
			Object.entries(value).forEach(([p, v]) => {
				traverse(v, key ? `${key}.${p}` : p)
			})
			return
		}

		if (!isString(value)) return

		const matches =
			value
				.match(/{{(\w|\.|\-|\_)+}}/g)
				?.map((match) => match.slice(2, -2)) ?? []

		matches.forEach((match) => {
			console.log(match, '{{' + match + '}}', get(output, match))
			value = value.replace('{{' + match + '}}', get(output, match))
		})

		set(output, key, value)
	}

	// Traverse the given object
	traverse(output)

	// return formData
	return output
}

const fileName = path.basename(inputPath)

fs.writeFileSync(
	path.resolve(__dirname, outputPath + 'serialized-' + fileName),
	JSON.stringify(serialize(JSON.parse(file)), null, 3)
)
