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
import { createAPI } from "../../../lib/axios";
import { FetchAPI } from "../../../lib/fetch";

const axios = createAPI({
	baseURL: "http://localhost:4000/api/v1",
});

const api = new FetchAPI({
	apiCase: "snake_case",
	baseURL: "http://localhost:4000/api/v1",
});

export default Vue.extend({
	name: "FetchAPI",
	data: (): any => ({}),
	computed: {},
	async created() {},
	methods: {
		async onFetchGET() {
			let start = Date.now();
			await axios.get("/todos");

			let start2 = Date.now();
			await api.get("/todos");
			console.log(`${Date.now() - start}ms :: ${Date.now() - start2}ms`);
		},
	},
});
</script>
