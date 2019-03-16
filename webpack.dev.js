const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const production = false;

module.exports = () =>
  merge(common(production), {
    mode: 'development',
    devtool: 'inline-source-map',
    optimization: {
      minimize: false,
    },
    devServer: {
      contentBase: './dist',
    },
  });
