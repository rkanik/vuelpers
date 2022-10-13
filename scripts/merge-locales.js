const fs = require('fs')
const path = require('path')

const get = require('lodash/get')
const set = require('lodash/set')
const isArray = require('lodash/isArray')
const isPlainObject = require('lodash/isPlainObject')

const enJson = require('../locales/en.json')
const arJson = require('../locales/ar.json')
const output = {}

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

	const arValue = get(arJson, key)
	set(output, key, arValue || value)
}

traverse(enJson)

fs.writeFileSync(
	path.resolve(__dirname, '../locales/ar.backup.json'),
	JSON.stringify(arJson, null, 2)
)

fs.writeFileSync(
	path.resolve(__dirname, '../locales/en.json'),
	JSON.stringify(enJson, null, 2)
)

fs.writeFileSync(
	path.resolve(__dirname, '../locales/ar.json'),
	JSON.stringify(output, null, 2)
)
