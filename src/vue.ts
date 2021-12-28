import { camelCase, upperFirst, isFunction } from 'lodash'

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
      ? component.name : upperFirst(camelCase(
        (filename.replace(/^\.\/(.*)\.\w+$/, '$1'))
          .split('/').pop()
      ))
    Vue.component(componentName, component)
  });
}
