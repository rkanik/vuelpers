import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import isFunction from 'lodash/isFunction'

import { ViteGlob, VRef } from './types'
import { VIA_PLACEHOLDER } from './consts'
import { VueConstructor } from 'vue'
import { Route, RouteMeta } from 'vue-router'

/**
 * @example
 * registerComponents(
 *    require.context(
 *      './components', true, // is deep
 *      /[A-Z]\w+\.(vue|js|ts)$/
 *    ), Vue
 * )
 *
 * @param context - Require context
 * @param Vue - Vue instance
 */
export const registerComponents = (context: any, Vue: any) => {
	context.keys().forEach((filename: string) => {
		const component = context(filename).default || context(filename)
		const componentName = !isFunction(component)
			? component.name
			: upperFirst(
					camelCase(
						filename
							.replace(/^\.\/(.*)\.\w+$/, '$1')
							.split('/')
							.pop()
					)
			  )
		Vue.component(componentName, component)
	})
}

/**
 * @example
 * await registerComponentsVite(
 *    Vue,
 *    import.meta.glob('./components/base/*.vue'),
 *    import.meta.glob('./components/custom/*.vue')
 * )
 *
 * @param Vue - Vue instance
 * @param modules - import.meta.glob
 */
export const registerComponentsVite = async (
	Vue: VueConstructor<Vue>,
	...modules: ViteGlob[]
) => {
	let i = 0
	for (const mods of modules) {
		for (const pathName in mods) {
			const mod = await mods[pathName]()
			const componentName = pathName
				.replace(/^\.\/(.*)\.\w+$/, '$1')
				.split('/')
				.pop()
			Vue.component(componentName || `component-${i}`, mod.default || mod)
			i += 1
		}
	}
}

export const getVRef = (ref: VRef): [Element | undefined, Vue | undefined] => {
	if (!ref) return [undefined, undefined]
	const eRef = Array.isArray(ref) ? ref[0] : ref
	if (ref instanceof Element) return [ref, undefined]
	return [(eRef as Vue).$el as Element, eRef as Vue]
}

export const getRouteMeta = <T extends any>(
	route: Route,
	key: keyof RouteMeta
): T | null => {
	const matchedRoute = route.matched.find((route) => {
		return Object.prototype.hasOwnProperty.call(route.meta, key)
	})
	return matchedRoute ? matchedRoute.meta[key] : null
}

interface VImgError {
	ref: VRef
	size?: string
	index?: number
	base?: string
}

type RequiredOne<T, Keys extends keyof T = keyof T> = Pick<
	T,
	Exclude<keyof T, Keys>
> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>
	}[Keys]

export type ImgErrorConfig = RequiredOne<
	{
		ref: VRef
		$event: ErrorEvent
		size?: string
		index?: number
		base?: string
	},
	'$event' | 'ref'
>

const onVImgError = (config: VImgError) => {
	// Initialize config
	const { ref, index = 0, size = '512x512' } = config

	// Extracting image reference
	const eRef = Array.isArray(ref) ? ref[index] : ref
	if (!eRef) return

	// Extracting image element
	const el = eRef instanceof Element ? eRef : eRef.$el

	if (el instanceof HTMLImageElement) {
		// Set image source
		el.src = `${config.base || VIA_PLACEHOLDER}${size}`
	}

	// finding the actual image element
	const img = el.querySelector('.v-image__image') as HTMLElement
	if (!img) return

	img.classList.remove(`v-image__image--preload`)
	img.style.backgroundImage = `url(${config.base || VIA_PLACEHOLDER}${size})`
}

export const onImgError = (config: ImgErrorConfig) => {
	if (config.ref)
		return onVImgError({
			ref: config.ref,
			index: config.index,
			size: config.size,
			base: config.base,
		})

	// Initialize config
	const { $event, size = '512x512' } = config

	// if no image reference, return
	if (!$event || !$event.target) return

	// replacing the image with placeholder
	const target = $event.target as HTMLImageElement
	target.src = `${config.base || VIA_PLACEHOLDER}${size}`
}

type ImgErrorHandler = {
	base: string
}
export const createImgErrorHandler = ({
	base = VIA_PLACEHOLDER,
}: ImgErrorHandler) => {
	return (config: ImgErrorConfig) => {
		return onImgError({ ...config, base })
	}
}
