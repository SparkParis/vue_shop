import Vue from 'vue'
import {
  Button,
  Form,
  FormItem,
  Input,
  Message
} from 'element-ui'


Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
// 注意这里将message组件挂载在全局Vue实例对象上来共享.通过message的方法来实现不同的提示信息
Vue.prototype.$message = Message