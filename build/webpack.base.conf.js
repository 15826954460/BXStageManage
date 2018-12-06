'use strict'
const path = require('path')
const utils = require('./utils')
const config = require('../config')
const vueLoaderConfig = require('./vue-loader.conf')
/** 保持 server-rendered 和 client render 一致 */
const XhrEvalChunkPlugin = require('xhr-eval-chunk-webpack-plugin').default

/** 生成绝对路径 */
function resolve (dir) {
  return path.join(__dirname, '..', dir)
}

/**
 * 生成依赖关系的文件，实际生产中然而并没什么卵用
 */

const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({size: 5}) // 指定五个线程池
// const manifest = require('../release/vendor-manifest.json')
/** 创建eslint代码规范 */
const createLintingRule = () => ({
  test: /\.(js|vue)$/, // 检测文件类型
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [resolve('src'), resolve('test')], // 检测的模块
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: !config.dev.showEslintErrorsInOverlay
  }
})

module.exports = {
  context: path.resolve(__dirname, '../'),
  entry: {
    app: './src/main.js',
  },
  output: {
    // 输出的根路径
    path: config.build.assetsRoot,
    // 编译输出的文件名
    filename: '[name].js',
    // 正式发布环境下编译输出的发布路径
    publicPath: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test')
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],// 自动补全的扩展名
    alias: {
      /** 使用的扩展名，解决一些相对路径导过长 */
      'vue$': 'vue/dist/vue.esm.js',
      '@': resolve('src/page'),
      'com': resolve('src/components')
    }
  },
  plugins: [
    new XhrEvalChunkPlugin(),
    // new BundleAnalyzerPlugin()
    new HappyPack({
      id: 'happyBabel', // 定义名字
      threadPool: happyThreadPool, // 指定进程池
      loaders: ['babel-loader?cacheDirectory=true']
    }),
    // new webpack.DllReferencePlugin({
    //   manifest
    // })
  ],
  module: {
    rules: [
      ...(config.dev.useEslint ? [createLintingRule()] : []),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig, // Vue-loader 的一些配置参数
      },
      {
        test: /\.js$/,
        // loader: 'babel-loader?cacheDirectory=true', // 将转译结果缓存至文件系统
        loader: 'happypack/loader?id=happyBabel',
        include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader', // 它除了具备基本的 Base64 转码能力，还可以结合文件大小，帮我们判断图片是否有必要进行 Base64 编码
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000, // 小于10000字节时以base64的方式引用
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  },
  node: {
    setImmediate: false,
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    child_process: 'empty'
  }
}
