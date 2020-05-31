import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'

// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 注册组件为全局可用组件
Vue.use(VueQuillEditor);

// 导入插件vue-table-tree-grid插件
import TreeTable from 'vue-table-with-tree-grid'
// 将组件注册为全局可用的组件,此时就可以直接使用tree-table组件
// Vue.use(TreeTable), 封装为子组件
Vue.component('tree-table', TreeTable)
// import axios from 'axios'
// Vue.prototype.$http = axios

// 全局定义过滤器filter
Vue.filter('dataFormat', function (originVal) {
  const dt = new Date(originVal);
  const y = dt.getFullYear();
  const m = (dt.getMonth() + 1 + '').padStart(2, 0);
  const d = (dt.getDate() + '').padStart(2, '0');
  const hh = (dt.getHours() + '').padStart(2, '0');
  const dd = (dt.getMinutes() + '').padStart(2, '0');
  const ss = (dt.getSeconds() + '').padStart(2, '0');
  return `${y}-${m}-${d} ${hh}:${dd}:${ss}`
})


Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
