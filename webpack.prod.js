const path = require('path');
const glob = require('glob');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const cssnano = require('cssnano');
const merge = require('webpack-merge');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const common = require('./webpack.common.js');
const production = true;

const srcDir = path.join(__dirname, 'src');

module.exports = () =>
  merge(common(production), {
    mode: 'production',
    optimization: {
      minimize: true,
      minimizer: [
        new TerserPlugin({
          cache: true,
          parallel: true,
          terserOptions: {
            ecma: 6,
            output: {
              comments: false,
            },
            compress: {
              drop_console: true,
            },
          },
        }),
        new OptimizeCSSAssetsPlugin({
          cssProcessor: cssnano,
          cssProcessorPluginOptions: {
            preset: [
              'default',
              {
                discardComments: {
                  removeAll: true,
                },
              },
            ],
          },
        }),
      ],
    },
    plugins: [
      new PurgecssPlugin({
        paths: glob.sync(`${srcDir}/**/*`, { nodir: true }),
      }),
    ],
  });
