import Vue from 'vue'
import VueRouter from 'vue-router'


Vue.use(VueRouter)

// 这里通过理由懒加载的方式来加载组件
const Login = () => import("components/login/Login")
const Home = () => import("components/home/Home")
const Welcome = () => import("components/home/childcomps/Welcome")
const Users = () => import('components/home/childcomps/Users')
const Right = () => import('components/power/Right')
const Role = () => import('components/power/Role')
const Category = () => import('components/goods/Category')

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
    component: Home,
    // 跳到home页面后自动重定向到welcome页面
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Right },
      { path: '/roles', component: Role },
      { path: '/categories', component: Category },
    ]
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
