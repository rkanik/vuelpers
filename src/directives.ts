export type OnRevealOptions = {
	name?: string;
	once?: boolean;
	offset?: number;
	intensity?: number;
};

export const VOnReveal = {
	install(Vue: any, options: OnRevealOptions = {}) {
		const { name = "on-reveal" } = options;

		const directives = new Map();

		Vue.directive(name, {
			inserted(el: HTMLElement, binding: any) {
				binding.value.id = Math.random().toString(36).substring(2, 9);
				const {
					id,
					callback,
					offset = options.offset || 0,
					once = options.once || false,
					intensity = options.intensity || 200,
				} = binding.value || {};

				if (typeof callback !== "function") {
					throw new Error(
						`v-${name} directive requires a callback function`
					);
				}

				let timeout: any;
				let isInView = false;
				let isViewed = false;
				const onScroll = () => {
					if (timeout) return;

					timeout = setTimeout(() => {
						clearTimeout(timeout);
						timeout = null;

						if (once && isViewed) {
							window.removeEventListener("scroll", onScroll);
							directives.delete(id);
						}

						const { top, height } = el.getBoundingClientRect();
						if (
							top - window.innerHeight - offset < 0 && // top is in view
							top - window.innerHeight + height > 0 // scrollbar has passed bottom
						) {
							if (!isInView || (once && !isViewed)) {
								binding.value.callback();
							}

							isViewed = true;
							isInView = true;
						} else {
							isInView = false;
						}
					}, intensity);
				};

				directives.set(id, onScroll);
				window.addEventListener("scroll", onScroll);
			},
			unbind(_: any, binding: any) {
				if (!binding.value) return;
				const onScroll = directives.get(binding.value.id);

				if (!onScroll) return;

				window.removeEventListener("scroll", onScroll);
				directives.delete(binding.value.id);
			},
		});
	},
};
