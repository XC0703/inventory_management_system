const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  devServer: {
    host: '0.0.0.0',
  // https:true,
    port: 8080,
    client: {
      webSocketURL: 'ws://0.0.0.0:8080/ws',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    }
},
  lintOnSave: false,
  transpileDependencies: true,
  assetsDir: 'static',// 静态资源打包输出目录 (js, css, img, fonts)，相应的url路径也会改变
})