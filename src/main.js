import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
// 导入插件vue-table-tree-grid插件
import TreeTable from 'vue-table-with-tree-grid'
// 将组件注册为全局可用的组件,此时就可以直接使用tree-table组件
// Vue.use(TreeTable), 封装为子组件
Vue.component('tree-table', TreeTable)
// import axios from 'axios'
// Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
