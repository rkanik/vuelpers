export type OnRevealOptions = {
	name?: string;
	once?: boolean;
	offset?: number;
	intensity?: number;
};

export type OnRevealProps = {
	id?: string;
	once?: boolean;
	offset?: number;
	intensity?: number;
	onReveal: () => void;
	onLeave?: () => void;
};

type OnRevealBindting = {
	value: OnRevealProps;
};

export const VOnReveal = {
	install(Vue: any, options: OnRevealOptions = {}) {
		const directives = new Map();
		const { name = "on-reveal" } = options;

		Vue.directive(name, {
			inserted(el: HTMLElement, binding: OnRevealBindting) {
				const {
					onLeave,
					onReveal,
					offset = options.offset || 0,
					once = options.once || false,
					intensity = options.intensity || 200,
					id = Math.random().toString(36).substring(2, 9),
				} = binding.value || {};

				if (typeof onReveal !== "function") {
					throw new Error(
						`v-${name} directive requires a onReveal function`
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
						// top + height // > 0 bottom is in view from bottom

						if (
							top - window.innerHeight - offset < 0 && // element top is in view
							top - window.innerHeight + height > 0 // scrollbar has passed the element
						) {
							if (!isInView || (once && !isViewed)) {
								binding.value.onReveal();
							}

							isViewed = true;
							isInView = true;
						} else {
							isInView = false;
							onLeave && onLeave();
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
