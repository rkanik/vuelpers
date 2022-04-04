import { isEmpty, secureDataType } from "./common";
import { snakeCase, camelCase, isString, isArray, isPlainObject } from "lodash";
import { Cases } from "./types";

export const omitProperty = (object: any, ...properties: string[]) => {
	const traverse = (object: any, path = "") => {
		return Object.entries(object).reduce((data: any, [key, value]) => {
			const currentPath = !path ? key : `${path}.${key}`;
			if (properties.includes(key) || properties.includes(currentPath)) {
				return data;
			} else if (isPlainObject(value)) {
				data[key] = traverse(value, currentPath);
			} else data[key] = value;
			return data;
		}, {});
	};
	return traverse(object);
};

interface OmitEmptiesConfig {
	ignore?: string[];
	removeEmptyObject?: boolean;
}
export const omitEmpties = (object: object, config: OmitEmptiesConfig = {}) => {
	// destructing config with default
	const { ignore = [], removeEmptyObject = true } = config;

	// Function to traverse through deep object
	const traverse = (object: any, path: string = "") => {
		return Object.entries(object).reduce(
			(data: any, [key, value]: [string, any]) => {
				// Concat path with parent path
				const currentPath = !path ? key : `${path}.${key}`;

				// If value is empty returning
				if (isEmpty(value) && !ignore.includes(currentPath)) return data;

				// Keeping the value
				if (!isPlainObject(value)) data[key] = value;
				// if object then traversing again
				else data[key] = traverse(value, currentPath);

				// returning the final object
				return data;
			},
			{}
		);
	};

	if (!removeEmptyObject) return traverse(object);
	return traverse(traverse(object));
};

export const convertKeysToSnakeCase = (data: any): any => {
	const nested = (b: any) => {
		return isArray(b) || isPlainObject(b) ? convertKeysToSnakeCase(b) : b;
	};
	if (isString(data)) return snakeCase(data);
	if (isArray(data)) return data.map(nested);
	if (isPlainObject(data))
		return Object.entries(data).reduce(
			(converted: any, [key, value]: any[]) => {
				key = convertKeysToSnakeCase(key);
				return { ...converted, [key]: nested(value) };
			},
			{}
		);
	return data;
};

export const convertKeysToCamelCase = (data: any): any => {
	const nested = (b: any) => {
		return isArray(b) || isPlainObject(b)
			? convertKeysToCamelCase(b)
			: secureDataType(b);
	};
	if (isString(data)) return camelCase(data);
	if (isArray(data)) {
		return data.map(nested);
	}
	if (isPlainObject(data))
		return Object.entries(data).reduce(
			(converted: any, [key, value]: any[]) => {
				key = convertKeysToCamelCase(key);
				return { ...converted, [key]: nested(value) };
			},
			{}
		);
	return data;
};

export interface FormDataConfig {
	convertCase: Cases;
}
export const toFormData = (
	value: any,
	extra: object = {},
	config?: Partial<FormDataConfig>
) => {
	if (config && config.convertCase) {
		if (config.convertCase === "camelCase") {
			value = convertKeysToCamelCase(value);
		} else if (config.convertCase === "snake_case") {
			value = convertKeysToSnakeCase(value);
		}
	}

	value = { ...value, ...extra };
	const formData = new FormData();

	const traverse = (value: any, key?: any) => {
		if (isArray(value)) {
			value.forEach((v: any, index) => {
				traverse(v, key ? `${key}[${index}]` : index);
			});
		} else if (isPlainObject(value)) {
			Object.entries(value).forEach(([p, v]: any[]) => {
				traverse(v, key ? `${key}[${p}]` : p);
			});
		} else {
			formData.append(key, value);
		}
	};
	traverse(value);
	return formData;
};
