<template>
	<v-container>
		<v-sheet
			height="1080px"
			class="d-flex align-center justify-center error"
		>This is VueIntoView component</v-sheet>
		<v-sheet
			v-on-reveal="{
				once: false,
				callback: onReveal,
			}"
			height="720px"
			class="d-flex align-center justify-center success"
		>Sheet Two</v-sheet>
		<v-sheet
			v-on-reveal="{
				once: true,
				offset: 200,
				callback: onReveal2,
			}"
			height="720px"
			class="d-flex align-center justify-center warning"
		>Sheet Three</v-sheet>
	</v-container>
</template>

<script lang="ts">
import Vue from "vue";
import { VOnReveal } from '../../../lib/directives'

Vue.use(VOnReveal, {
	// name: 'on-test'
	offset: 0,
	once: true,
	intensity: 100,
});

export default Vue.extend({
	name: 'VOnReveal',
	methods: {
		isViewed() {
			return false
		},
		onReveal() {
			console.log('onReveal');
		},
		onReveal2() {
			console.log('onReveal2');
		}
	}
})
</script>

<style lang='scss' scoped>
</style>