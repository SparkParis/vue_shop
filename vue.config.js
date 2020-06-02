const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: `/vueshop`,  // 打包后的文件路径
  outputDir: `dist/vueshop`, // 打包文件放置在dist文件夹下的app1文件夹
  chainWebpack: config => {
    // 重命名
    config.resolve.alias
      .set('@', resolve('src'))
      .set('assets', resolve('src/assets'))
      .set('components', resolve('src/components'))
      .set('views', resolve('src/views'))
      .set('network', resolve('src/network'))
    //生产模式
    config.when(process.env.NODE_ENV === 'production', config => {
      config.entry('app').clear().add('./src/main_prod.js')

      // 通弄过externals加载CDN外部资源
      config.set('externals', {
        vue: 'Vue',
        'vue-router': 'VueRouter',
        axios: 'axios',
        lodash: '_',
        echarts: 'echarts',
        nprogress: 'NProgress',
        'vue-quill-editor': 'VueQuillEditor',
        'element-ui': 'ElementUI',
      })

      //使用插件
      config.plugin('html').tap(args => {
        //添加参数isProd
        args[0].isProd = true
        return args
      })
    })

    // 开发模式
    config.when(process.env.NODE_ENV === 'development', config => {
      config.entry('app').clear().add('./src/main_dev.js')

      //使用插件动态选择cdn插件是否使用
      config.plugin('html').tap(args => {
        //添加参数isProd
        args[0].isProd = false
        return args
      })
    })
  }

  // 路径重命名
  // configureWebpack: {
  //   resolve: {
  //     alias: {
  //       'assets': '@/assets',
  //       'components': '@/components',
  //       "views": '@/views',
  //       "network": '@/network'
  //     }
  //   }
  // }




}