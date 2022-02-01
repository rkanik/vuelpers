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
import { stringReplace, getCurrentCountry, platform, userAgent, isChromium, isThunderbird, isFirefox, isEdge, isWindows, isMacOS, getChromiumVersion } from "../../../lib";
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


		console.log('platform', platform)
		console.log('userAgent', userAgent)
		console.log('isChromium', isChromium)
		console.log('isThunderbird', isThunderbird)
		console.log('isFirefox', isFirefox)
		console.log('isEdge', isEdge)
		console.log('isWindows', isWindows)
		console.log('isMacOS', isMacOS)
		console.log('getChromiumVersion', getChromiumVersion())


		// let [country] = await getCurrentCountry();
		// if (country) this.country = country;
	},
	methods: {
		stringReplace,
	},
});
</script>
