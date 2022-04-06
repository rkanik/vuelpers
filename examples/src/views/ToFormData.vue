<template>
	<v-container>
		<v-textarea outlined rows="12" v-model="data" />
		<v-btn @click="onToFormData">Form Data</v-btn>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'

import { serialize } from 'object-to-formdata'
import { toFormData, formDataToObject } from '../../../lib'

export default Vue.extend({
	name: 'ToFormData',
	data: () => ({
		data: '',
		user: {
			id: 101,
			emptyString: '',
			email: 'jack@dev.com',
			isVerified_Huh: true,
			iAmNull: null,
			iAmUndefined: undefined,
			nan: NaN,
			infinity: Infinity,
			negative_Infinity: -Infinity,
			date: new Date(),
			time: new Date().getTime(),
			array: [1, 2, 3],
			object: {
				a: 1,
				b: 2,
				c: 3,
			},
			boolean: true,
			number: 123,
			string: 'hello world',
			regex: /^[a-zA-Z0-9]+$/,
			// symbol: Symbol('symbol'),
			function: () => {},
			null: null,
			undefined: undefined,
			phones: [
				{
					type: 'Home',
					number: '2135487',
				},
				{
					type: 'Mobile',
					number: '1234567',
				},
			],
			personalInfo: {
				name: 'Jack',
				address: {
					line1: 'westwish st',
					line2: 'washmasher',
					city: 'wallas',
					state: 'WX',
				},
			},
		},
	}),
	created() {},
	methods: {
		onToFormData() {
			const fd = toFormData(this.user, {
				_method: 'PATCH',
				convertCase: 'snake_case',
				// allowEmptyString: true,
				// booleanAsNumber: false,
				// dateToISOString: false,
				// removeNull: false,
				// removeUndefined: false,
				// removeFalsey: false,
			})
			const sfd = serialize(
				this.user,
				{
					nullsAsUndefineds: true,
					booleansAsIntegers: true,
				}
				// undefined
				// 'rk_'
			)

			// fetch('/endpoint', {
			// 	method: 'POST',
			// 	body: fd,
			// })

			console.log(formDataToObject(fd), formDataToObject(sfd))
		},
	},
})
</script>
