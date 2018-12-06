'use strict'
const path = require('path')

module.exports = {
  dev: {
    NODE_ENV: '"development"',
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    /** 跨域代理的配置 */
    proxyTable: {
      '/api/': {
        target: 'https://fenqibgstest.bixiaapp.com/#', // 测试环境
        // target: 'http://192.168.2.14:81/', // 开发环境
        secure: false, // 如果是https接口，需要配置这个参数
        changeOrigin: true     // 如果接口跨域，需要进行这个参数配置
      },
    },
    host: 'localhost', // can be overwritten by process.env.HOST
    port: 8080,
    autoOpenBrowser: false, // 自动在新浏览器打开
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false,
    useEslint: true, // 是否使用eslint代码规范规则
    showEslintErrorsInOverlay: false,
    devtool: 'cheap-module-eval-source-map',
    cacheBusting: true,
    cssSourceMap: true,
    productionSourceMap: true, // 开启定位错误
  },
  build: {
    NODE_ENV: '"production"',
    index: path.resolve(__dirname, '../release/index.html'),
    assetsRoot: path.resolve(__dirname, '../release'),
    assetsSubDirectory: 'static',
    assetsPublicPath: './',
    productionSourceMap: false, // 大大的减少打压缩体积
    devtool: '#source-map',
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
