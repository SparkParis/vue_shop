// 该文件定义的所有插件在开发时和运行是都会执行,
// 将开发时依赖的插件单独保存
const prodPlugins = []
if (process.env.NODE_ENV == 'production') {
  prodPlugins.push("transform-remove-console")
}

module.exports = {
  "presets": [
    "@vue/cli-plugin-babel/preset"
  ],
  "plugins": [
    [
      "component",
      {
        "libraryName": "element-ui",
        "styleLibraryName": "theme-chalk"
      }
    ],
    // 发布产品时候的插件
    ...prodPlugins
  ]
}