import Vue from 'vue'

export type Cases = "camelCase" | "snake_case" | null | undefined;
export type VRef = Vue | Element | (Vue | Element)[] | undefined