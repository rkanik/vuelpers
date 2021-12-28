<template>
	<v-container>
		<v-toolbar flat>
			<v-toolbar-title>Fetch API</v-toolbar-title>
		</v-toolbar>
		<v-container fluid>
			<v-row>
				<v-col cols="3">
					<v-card>
						<v-card-title>GET</v-card-title>
						<v-card-text> </v-card-text>
						<v-card-actions>
							<v-btn color="primary" @click="onFetchGET">Fetch</v-btn>
						</v-card-actions>
					</v-card>
				</v-col>
				<v-col cols="3"> </v-col>
				<v-col cols="3"> </v-col>
				<v-col cols="3"> </v-col>
			</v-row>
		</v-container>
	</v-container>
</template>

<script lang="ts">
import Vue from "vue";

import { FetchAPI } from "../../../lib/fetch";

const api = new FetchAPI({
	apiCase: "camelCase",
	baseURL: "http://localhost:4000/api/v1",
});

export default Vue.extend({
	name: "FetchAPI",
	data: (): any => ({}),
	computed: {},
	async created() {},
	methods: {
		async onFetchGET() {
			let [err, res] = await api.get("/todos/asd", { page: 1, perPage: 20 });
			console.log(err, res);
		},
	},
});
</script>
