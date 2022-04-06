<template>
	<v-app>
		<v-app-bar app color="primary" dark>
			<div class="d-flex align-center">
				<v-img
					alt="Vuetify Logo"
					class="shrink mr-2"
					contain
					src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
					transition="scale-transition"
					width="40"
				/>

				<v-img
					alt="Vuetify Name"
					class="shrink mt-1 hidden-sm-and-down"
					contain
					min-width="100"
					src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
					width="100"
				/>
			</div>

			<v-spacer></v-spacer>

			<v-btn
				href="https://github.com/vuetifyjs/vuetify/releases/latest"
				target="_blank"
				text
			>
				<span class="mr-2">Latest Release</span>
				<v-icon>mdi-open-in-new</v-icon>
			</v-btn>
		</v-app-bar>

		<v-navigation-drawer app v-model="drawer">
			<v-card flat>
				<v-card-title primary-title>App</v-card-title>
			</v-card>
			<v-list dense nav>
				<v-list-item
					v-for="(nav, navIndex) in navs"
					:key="navIndex"
					:to="nav.to"
				>
					<V-list-item-title>{{ nav.text }}</V-list-item-title>
				</v-list-item>
			</v-list>
		</v-navigation-drawer>

		<v-main>
			<router-view />
		</v-main>
	</v-app>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	name: 'App',

	data: () => ({
		drawer: null,
		navs: [
			{
				text: 'Home',
				to: '/',
			},
			{
				text: 'About',
				to: '/about',
			},
			{
				text: 'Contact',
				to: '/contact',
			},
			{
				text: 'Todos',
				to: '/todos',
			},
			{
				text: 'onReveal',
				to: '/v-on-reveal',
			},
			{
				text: 'Fetch API',
				to: '/fetch-api',
			},
			{
				text: 'Vuex',
				to: '/vuex',
			},
			{
				text: 'ToFormData',
				to: '/to-form-data',
			},
		],
	}),
})
</script>
