import camelCase from 'lodash/camelCase'
import upperFirst from 'lodash/upperFirst'
import isFunction from 'lodash/isFunction'

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
 