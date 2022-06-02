<template>
	<v-container>
		<v-toolbar flat>
			<v-toolbar-title>Fetch API</v-toolbar-title>
		</v-toolbar>
		<v-container fluid>
			<v-row>
				<v-col cols="3">
					<v-card>
						<v-card-title>
							<v-layout justify-space-between>
								<div>GET</div>
								<v-btn color="primary" @click="onFetchGET">Fetch</v-btn>
							</v-layout>
						</v-card-title>
						<v-card-text></v-card-text>
						<v-card-actions>
							<v-btn color="primary" @click="onFetchGET">Fetch</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
				<v-col cols="3"></v-col>
				<v-col cols="3"></v-col>
				<v-col cols="3"></v-col>
			</v-row>
		</v-container>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'
import { createAPI } from '../../../lib/axios'
import { fetch } from '../fetch'

const axios = createAPI({
	baseURL: 'http://localhost:8000/api/v1',
})

export default Vue.extend({
	name: 'FetchAPI',

	async created() {
		fetch.subscribe(this.onApi)
		fetch.subscribe(this.onApi)
	},
	methods: {
		onApi(res: any) {
			console.log('onApi', res)
		},
		async onFetchGET() {
			// const [axErr, axRes] = await axios.post('/login', {})
			// console.log(axErr.response, axRes)

			const [err, res] = await fetch.post('/login', {})
			console.log(err, res)
		},
	},
	beforeDestroy() {
		fetch.unsubscribe(this.onApi)
	},
})
</script>
