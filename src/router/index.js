import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

// 这里通过理由懒加载的方式来加载组件
const Login = () => import("components/login/Login");
const Home = () => import("components/home/Home")

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  }, {
    path: '/home',
    component: Home
  }

]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

// 根据路由导航守卫来控制页面访问权限
router.beforeEach((to, from, next) => {
  // 如果是登录页面,直接next
  if (to.path == '/login') return next()
  const token = window.sessionStorage.getItem('token');
  // 如果不存在
  if (!token) return next('/login')
  // 存在则放行
  next()


})

export default router
