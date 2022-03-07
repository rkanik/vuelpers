import { VRef } from "./types";
import { VIA_PLACEHOLDER } from "./consts";
import { camelCase, upperFirst, isFunction } from "lodash";

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
		const component = context(filename).default || context(filename);
		const componentName = !isFunction(component)
			? component.name
			: upperFirst(
					camelCase(
						filename
							.replace(/^\.\/(.*)\.\w+$/, "$1")
							.split("/")
							.pop()
					)
			  );
		Vue.component(componentName, component);
	});
};

export const getRouteMeta = (route: any, key: string) => {
	const matchedRoute = route.matched.find((route: any) => route.meta[key]);
	if (!matchedRoute) return null;
	return matchedRoute.meta[key];
};

interface VImgError {
	ref: VRef;
	size?: string;
	index?: number;
}

type RequiredOne<T, Keys extends keyof T = keyof T> = Pick<
	T,
	Exclude<keyof T, Keys>
> &
	{
		[K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
	}[Keys];

export type ImgErrorConfig = RequiredOne<
	{
		ref: VRef;
		$event: ErrorEvent;
		size?: string;
		index?: number;
	},
	"$event" | "ref"
>;

const onVImgError = (config: VImgError) => {
	// Initialize config
	const { ref, index = 0, size = "512x512" } = config;

	// Extracting image reference
	const eRef = Array.isArray(ref) ? ref[index] : ref;
	if (!eRef) return;

	// Extracting image element
	const el = eRef instanceof Element ? eRef : eRef.$el;

	if (el instanceof HTMLImageElement) {
		// Set image source
		el.src = `${VIA_PLACEHOLDER}${size}`;
	}

	// finding the actual image element
	const img = el.querySelector(".v-image__image") as HTMLElement;
	if (!img) return;

	img.classList.remove(`v-image__image--preload`);
	img.style.backgroundImage = `url(${VIA_PLACEHOLDER}${size})`;
};

export const onImgError = (config: ImgErrorConfig) => {
	if (config.ref)
		return onVImgError({
			ref: config.ref,
			index: config.index,
			size: config.size,
		});

	// Initialize config
	const { $event, size = "512x512" } = config;

	// if no image reference, return
	if (!$event || !$event.target) return;

	// replacing the image with placeholder
	const target = $event.target as HTMLImageElement;
	target.src = `${VIA_PLACEHOLDER}${size}`;
};