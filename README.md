# 技术栈
- elementui插件
- echarts
- vue框架
- axios
- nginx
- webpack
- vue-cli4
- mysql数据库
# 项目概述
   电商后台管理系统的增删查找功能,通过本项目的收获:
   - elementui插件的使用,
   - vue框架的使用,
   - webpack的配置,
   - 在个人服务器上部署nginx代理服务器
   - node后台服务器部署工作
   - 数据库mysql在服务器的部署和使用
   - 项目打包部署过程中使用了CDN优化
# 项目说明
- 项目中的后台服务器部署,需要学习的小伙伴可以直接使用
- 项目部署,服务器环境搭建和项目学习中遇到的坑可以见我的博客会有详细的部署教程
- 项目构建中的思路可以见pdf文件夹
- [实现效果见链接](http://182.92.102.182/vueshop/)
# 涉及知识点总结
1. css中居中显示
```
position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);,图片移动自身的的一半

```
2. flex弹性布局,设置内容位置
```
display: flex;
  // 设置弹性布局,内容尾部对齐
  justify-content: flex-end;
```

3. element-ui中的form
```
// form默认box-sizing:content-box(以内容为界限调整布局),这里设置为以边框为主
  padding: 0 20px;
  width: 100%;
  box-sizing: border-box;
```

4. 表单验证:注意是给form和item来添加属性prop和rules

5. elementui中组件名称就是类名,可以直接拿过来设置属性 	

6. 绑定变量需要给属性添加动态绑定

7. 绑定属性的true/false也要动态绑定

8. 页面中创建的子路由显示home中的main部分

9.二级路由放置位置的理解:
- 路由的方式使用组件:二级路由显示位置 ,注意router-view是路由跳转的视图位置,在router的index.js中的结构目录决定的,当子路由放在哪个一级组件的下面,哪个一级组件下放router-view来展示一级组件对应的二级组件对应路由的位置
所以在一级组件中放置的router-view对应的是index.js中的最外层的路由放置的位置
各个子组件中的router-view是各个一级组件下放置的children下的子组件位置

- 局部组件的使用:当直接使用局部封装的组件的时候,才需要将导入的.vue文件插入到父组件的对应位置(通过组件名的方式)

- 以上两种都需要将组件导入到对应的父组件中并且放在components中注册

10. elementui中ele-menu在点击的时候会默认跳转到点击的item的index的位置,在对表单的路由设置的时候可以开启menu的router属性,在需要路由跳转的位置将index的值设置为路由跳转的值就可以实现路由的跳转
同时如果需要修改点击对应的按钮就显示高亮的问题,可以使用menu的default-index,通过sessionStorage将当前的点击的index值保存起来,每次点击的时候直接赋值给data中的变量,根据data中的变量来显示当前保存的保存

11 elementui中提供栅格系统layout来设置空间的宽和高

12. 作用域插槽中,可以通过scope.row获取当前行的数据

13.设置处置居中的方式
```
.vcenter{

display:flex
align-item:center
}
```
14.vue-table-with-tree-grid插件来实现tree table

15.数组和字符串的转化
数组->字符串
arr.join(' ');
字符串->数组
str.split(',')

16. 请求参数的封装会导致params参数不能及时拼接到axios的url中,问题有待解决https://blog.csdn.net/weixin_44827421/article/details/100060163---->已解决


17.ES6中新增的字符串补全的方法
padStart(字符串个数,要不的数字) 用于头部补全；
padEnd() 用于尾部补全。
let strS = String(s).padStart(2, '0')

18. 富文本编辑器开发时依赖Vue-Quill-Editor

```
npm install vue-quill-editor --save
```

19.数据类型转换出现问题:解决方案:通过深拷贝的方式lodash工具包的使用,开发以依赖

20 级联选择器在使用中el-cascader,点击级联选择器之后是一个数组[],所以在保存当前选择的时候定义为数组[]

21. el中timeline在2.6版本之后才有

22.通过echarts框架来绘制报表https://echarts.apache.org/zh/tutorial.html#5%20%E5%88%86%E9%92%9F%E4%B8%8A%E6%89%8B%20ECharts

23.通过nprogress为自己的项目添加页面加载的进度条
使用在请求拦截和响应拦截中

24.打包优化过程中使用babel-plugin-transform-remove-console插件删除代码中console优化打包

35.vue.config.js文件中可以设置webpack的配置,设置webpack的打包配置有两种方式
- configureWebpack节点是用来定义webpack的打包配置,通过操作dom对象的形式修改默认的webpack设置
- chainWebpack链式打包.通过链式编程的形式来修改默认的webpack配置
- 二者区别在于:二者的作用相同


# vue_shop

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
