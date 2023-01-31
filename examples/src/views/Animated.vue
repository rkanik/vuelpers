<template>
	<v-container>
		<div
			class="tpp"
			:class="{ expanded }"
			v-click-outside="() => (expanded = false)"
		>
			<v-card
				width="500"
				class="tpp__big pl-8 py-2 pr-2"
				:class="{ expanded }"
			>
				<div>
					<div>Title</div>
					<div>Subtitle</div>
				</div>
				<div>
					<div>Title</div>
					<div>Subtitle</div>
				</div>
				<v-btn rounded height="56" dark color="blue" class="btn px-8">
					<v-icon left>mdi-magnify</v-icon>
					<span>Search</span>
				</v-btn>
			</v-card>

			<v-card
				width="200"
				class="tpp__small"
				@click="expanded = true"
				:class="{ expanded }"
			>
				<span>Anytime</span>
				<v-btn icon color="blue" class="btn">
					<v-icon>mdi-magnify</v-icon>
				</v-btn>
			</v-card>
		</div>
	</v-container>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	data: () => ({
		expanded: false,
	}),
})
</script>

<style lang="scss">
.tpp {
	display: flex;
	position: relative;

	margin-top: 4rem;
	&__small {
		padding: 0.5rem 0.5rem 0.5rem 1.5rem;
		color: white;
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 4rem !important;
		font-weight: bold;
		.btn {
			background-color: blueviolet !important;
		}
	}
	&__big {
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-radius: 4rem !important;
		font-weight: bold;
	}
}

.tpp {
	height: 100px;
	display: flex;
	align-items: flex-start;
	justify-content: center;

	&__small {
		opacity: 1;
		visibility: visible;
		/* transition: all ease 300ms; */
		transform: scale(0.9); //translateY(0);
		transition: transform 250ms ease, opacity 100ms ease, visibility 50ms;
		&.expanded {
			opacity: 0;
			visibility: hidden;
			transform: scale(1.6) translateY(8px);
			transition: transform 250ms ease,
				opacity 150ms ease visibility 0ms 250ms;
		}
	}
	&__big {
		position: absolute;
		transform-origin: center;
		/* transition: all ease 300ms; */
		/* transition: transform 250ms ease, opacity 200ms ease 100ms,
			visibility 0ms 200ms; */
		transition: transform 250ms ease, opacity 150ms ease 0ms,
			visibility 0ms 250ms;

		opacity: 0;
		visibility: hidden;
		transform: scale(0.42) translateY(-30px);

		&.expanded {
			opacity: 1;
			visibility: visible;
			transform: scale(1); // translateY(0);
			transition: transform 250ms ease, opacity 200ms ease;
		}
	}
}
</style>
