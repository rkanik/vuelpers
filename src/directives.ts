export const VIntoView = {
  install(Vue: any) {
    const directives = new Map();

    Vue.directive("into-view", {
      inserted(el: HTMLElement, binding: any) {
        const {
          id,
          isViewed,
          onIntoView,
          interval = 50,
          margin = 200,
        } = binding.value || {};

        if (
          !id ||
          typeof isViewed !== "function" ||
          typeof onIntoView !== "function"
        ) {
          throw new Error(
            "v-into-view directive requires a id: string, isViewed and onIntoView functions"
          );
        }

        let timeout: any;
        const onScroll = () => {
          if (timeout) return;

          timeout = setTimeout(() => {
            clearTimeout(timeout);
            timeout = null;

            if (binding.value.isViewed()) {
              window.removeEventListener("scroll", onScroll);
              directives.delete(id);
            }

            const top = el.getBoundingClientRect().top;
            if (top - window.innerHeight < -margin) {
              binding.value.onIntoView();
            }
          }, interval);
        };

        directives.set(id, onScroll);
        window.addEventListener("scroll", onScroll);
      },
      unbind(_: any, binding: any) {
        if (!binding.value || !binding.value.id) return;
        const onScroll = directives.get(binding.value.id);

        if (!onScroll) return;

        window.removeEventListener("scroll", onScroll);
        directives.delete(binding.value.id);
      },
    });
  },
};
