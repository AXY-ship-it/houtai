import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import router from './router/index.js'
import TreeTable from 'vue-table-with-tree-grid'
// 时间格式化的插件
import moment from 'moment'
import VueQuillEditor from 'vue-quill-editor'
 
// require styles富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
 //注册未全局可用的组件
Vue.use(VueQuillEditor)
//注册成全局可用的组件
Vue.component('tree-table',TreeTable)
Vue.config.productionTip = false 
Vue.use(ElementUI)
Vue.prototype.$message=ElementUI.Message
Vue.prototype.$confirm=ElementUI.MessageBox.confirm
Vue.prototype.$alert=ElementUI.MessageBox.alert
// 注册日期格式化过滤器,moment是日期格式化插件
Vue.filter('formatDate',function(time){
  return moment(time).format('YYYY-MM-DD HH:mm:ss')
})
// Vue.filter('formatDate',function(time){
//   const dt=new Date(time)
//   const y=dt.getFullYear()
//   const m=(dt.getMonth()+1+'').padStart(2,'0')
//   const d=(dt.getDate()+'').padStart(2,'0')
//   const hh=(dt.getHours()+'').padStart(2,'0')
//   const mm=(dt.getMinutes()+'').padStart(2,'0') 
//   const ss=(dt.getSeconds()+'').padStart(2,'0')
//   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
// })

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
