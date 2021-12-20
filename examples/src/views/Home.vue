<template>
	<v-container>
		<p>Country: {{ country }}</p>

		<p>isLoading: {{ $isLoading }}</p>

		{{ stringReplace("Hello World", 6, "Anik", 7) }}

		<base-input type="text" label="First Name" />
		<BaseInput type="text" label="Last Name" />

		<base-card></base-card>

		<BaseForm />
	</v-container>
</template>

<script lang="ts">
/* eslint-disable */
import Vue from "vue";
import { mapGetters } from "vuex";
import { stringReplace, getCurrentCountry } from "../../../lib";
export default Vue.extend({
	name: "Home",
	data: (): any => ({
		country: null,
	}),
	computed: {
		...mapGetters(["$isLoading"]),
	},
	async created() {
		this.$store.dispatch("fetchTodos");

		// let [country] = await getCurrentCountry();
		// if (country) this.country = country;
	},
	methods: {
		stringReplace,
	},
});
</script>
