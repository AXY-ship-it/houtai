import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router/index.js'
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$message=ElementUI.Message
Vue.prototype.$confirm=ElementUI.MessageBox.confirm
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
