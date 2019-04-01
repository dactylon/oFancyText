const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

const srcDir = path.join(__dirname, 'src');
const nodeModulesDir = path.join(__dirname, 'node_modules');
const tsconfigFile = path.join(__dirname, 'tsconfig.json');

module.exports = production => {
  return {
    entry: {
      app: ['./src/app.ts', './src/app.scss'],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: production ? '[name].[contenthash].js' : '[name].js',
      publicPath: '/',
    },
    resolve: {
      extensions: ['.ts', '.js', '.scss'],
      modules: [srcDir, nodeModulesDir],
      plugins: [
        new TsconfigPathsPlugin({
          configFile: tsconfigFile,
        }),
      ],
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        filename: 'index.html',
        template: 'src/index.pug',
        inject: true,
        hash: production,
      }),
      new MiniCssExtractPlugin({
        filename: production ? '[name].[contenthash].css' : '[name].css',
        chunkFilename: production ? '[id].[contenthash].css' : '[id].css',
      }),
    ],
    module: {
      rules: [
        {
          test: /\.pug$/,
          exclude: /node_modules/,
          use: 'pug-loader',
        },
        {
          test: [/\.js$/, /\.ts$/],
          exclude: /node_modules/,
          use: 'babel-loader',
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: production ? MiniCssExtractPlugin.loader : 'style-loader',
            },
            'css-loader',
            {
              loader: 'sass-loader',
              options: {
                includePaths: [path.resolve(__dirname, 'node_modules')],
                sourceMap: !production,
              },
            },
          ],
        },
        {
          test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'images/',
              },
            },
            {
              loader: 'url-loader',
              options: {
                limit: 8192,
              },
            },
          ],
        },
      ],
    },
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      watchContentBase: true,
      compress: true,
      port: 9000,
      historyApiFallback: true,
    },
  };
};
