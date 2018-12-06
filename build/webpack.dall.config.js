const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: {
    vendor: [
      'aws-sdk',
      'axios',
      'moment',
      'vue',
      'vue-awesome-swiper',
      'vue-router',
      'vuex',
    ]
  },
  output: {
    path: path.resolve(__dirname, '../static'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.resolve(__dirname, '../static', '[name]-manifest.json'),
      name: '[name]_library'
    })
  ]
}
