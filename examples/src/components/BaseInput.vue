<template>
	<div>
		<label>{{ label }}</label>
		<input :type="type" :placeholder="label" v-model="vModel" />
	</div>
</template>

<script lang="ts">
import Vue from "vue";
export default Vue.extend({
	name: "BaseInput",
	props: {
		type: {
			type: String,
			default: "text",
		},
		label: {
			type: String,
			default: "Label",
		},
		value: {
			type: [String, Number],
			default: "",
		},
	},
	computed: {
		vModel: {
			get() {
				return (this as any).value;
			},
			set(v) {
				(this as any).$emit("input", v);
			},
		},
	},
});
</script>
