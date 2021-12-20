import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import { registerComponents } from '../../lib'

Vue.config.productionTip = false

registerComponents(
  require.context(
    './components', true, // is deep
    /[A-Z]\w+\.(vue|js|ts)$/
  ), Vue
)

// console.log(require.context(
//   './components', true, // is deep
//   /[A-Z]\w+\.(vue|js|ts)$/
// ).keys());

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
