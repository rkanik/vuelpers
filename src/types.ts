import Vue from 'vue'

export type AnyRecord = Record<string, unknown>
export type AnyObject = {
	[key: string]: unknown
}

export type Cases = "camelCase" | "snake_case" | null | undefined;
export type VRef = Vue | Element | (Vue | Element)[] | undefined