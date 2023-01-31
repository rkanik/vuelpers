import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes: Array<RouteConfig> = [
	{
		path: '/',
		name: 'Home',
		component: Home,
	},
	{
		path: '/about',
		name: 'About',
		// route level code-splitting
		// this generates a separate chunk (about.[hash].js) for this route
		// which is lazy-loaded when the route is visited.
		component: () => {
			return import(/* webpackChunkName: "about" */ '../views/About.vue')
		},
	},
	{
		path: '/fetch-api',
		name: 'FetchAPI',
		component: () =>
			import(/* webpackChunkName: "fetch-api" */ '../views/FetchApi.vue'),
	},
	{
		path: '/animated',
		name: 'Animated',
		component: () =>
			import(/* webpackChunkName: "fetch-api" */ '../views/Animated.vue'),
	},
	{
		path: '/todos',
		name: 'Todos',
		component: () =>
			import(/* webpackChunkName: "todos" */ '../views/Todos.vue'),
	},
	{
		path: '/v-on-reveal',
		name: 'VOnReveal',
		component: () =>
			import(/* webpackChunkName: "todos" */ '../views/VOnReveal.vue'),
	},
	{
		path: '/vuex',
		name: 'Vuex',
		component: () =>
			import(/* webpackChunkName: "vuex" */ '../views/Vuex.vue'),
	},
	{
		path: '/to-form-data',
		name: 'ToFormData',
		component: () =>
			import(/* webpackChunkName: "ToFormData" */ '../views/ToFormData.vue'),
	},
]

const router = new VueRouter({
	mode: 'history',
	base: process.env.BASE_URL,
	routes,
})

export default router
