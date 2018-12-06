const vendors = [
  'babel-eslint',
  'babel-helper-vue-jsx-merge-props',
  'babel-loader',
  'babel-plugin-syntax-jsx',
  'babel-plugin-transform-runtime',
  'babel-plugin-transform-vue-jsx',
  'babel-preset-env',
  'babel-preset-stage-2',
  'chalk',
  'clipboard',
  'copy-webpack-plugin',
  'cross-env',
  'css-loader',
  'echarts',
  'element-ui',
  'eslint',
  'eslint-config-standard',
  'eslint-friendly-formatter',
  'eslint-loader',
  'eslint-plugin-html',
  'eslint-plugin-import',
  'eslint-plugin-node',
  'eslint-plugin-promise',
  'eslint-plugin-standard',
  'extract-text-webpack-plugin',
  'file-loader',
  'friendly-errors-webpack-plugin',
  'happypack',
  'html-webpack-plugin',
  'less',
  'less-loader',
  'moment',
  'node-notifier',
  'optimize-css-assets-webpack-plugin',
  'ora',
  'portfinder',
  'postcss-import',
  'postcss-loader',
  'postcss-url',
  'rimraf',
  'semver',
  'shelljs',
  'uglifyjs-webpack-plugin',
  'url-loader',
  'viewerjs',
  'vue-echarts',
  'vue-loader',
  'vue-sortable',
  'vue-style-loader',
  'vue-template-compiler',
  'vuedraggable',
  'webpack',
  'webpack-bundle-analyzer',
  'webpack-dev-server',
  'webpack-merge',
  'xhr-eval-chunk-webpack-plugin',
]
const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: {
    vendor: ['babel-helper-vue-jsx-merge-props',
      'babel-loader',]
  },
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].dll.js',
    library: '[name]_library'
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist', '[name]-manifest.json'),
      name: '[name]_library'
    })
  ]
};
