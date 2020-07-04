const path = require('path');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const htmlWebpack = require('html-webpack-plugin');

module.exports = {
  entry: './public/script.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist'
  },
  module: {
    rules: [
      {
        test: /\.(sass|scss|css)$/,
        use: [
          'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader'
        ],
        include: path.resolve(__dirname, 'public/images')
      },
      {
        test: /\.(eot|woff|woff2|ttf)$/,
        use: [
          'file-loader'
        ]
      }
    ]
  },
  plugins: [
    new htmlWebpack(),
    new CopyPlugin({
      patterns: [
        { from: './public/images', to: 'images' }
      ]
    })
  ],
}