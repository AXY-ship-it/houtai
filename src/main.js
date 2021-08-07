import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router/index.js'
import TreeTable from 'vue-table-with-tree-grid'
//注册成全局可用的租价
Vue.component('tree-table',TreeTable)
Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.prototype.$message=ElementUI.Message
Vue.prototype.$confirm=ElementUI.MessageBox.confirm
Vue.prototype.$alert=ElementUI.MessageBox.alert
new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
