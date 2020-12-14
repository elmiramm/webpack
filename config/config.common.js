const paths = require('./paths');
const webpack = require('webpack');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ImageminWebpackPlugin = require('imagemin-webpack-plugin').default
const ImageminWebpWebpackPlugin = require('imagemin-webp-webpack-plugin');

module.exports = {
  entry: {
    main: ['@babel/polyfill', paths.src + '/index.js']
  },

  output: {
    path: paths.build,
    filename: '[name].js',
    //publicPath: '/'
  },

  plugins: [
    // Removes/cleans build folders and unused assets when rebuilding
    new CleanWebpackPlugin(),

    // Copies files from target to destination folder
    new CopyWebpackPlugin({
      patterns: [
        {
          from: paths.src + `/images`,
          to: paths.build + `/images`,
        },
        {
          from: paths.src + `/fonts`,
          to: paths.build + `/fonts`
        }
      ],
    }),
    new ImageminWebpWebpackPlugin({
      config: [
        {
          test: /\.(jpe?g|png)/,
          options: {
            quality: 75,
          },
        },
      ],
      detailedLogs: true,
    }),

    new HtmlWebpackPlugin({
      inject: true,
      //favicon: paths.src + '/images/favicon.png',
      template: paths.src + '/index.pug',
      filename: 'index.html' // output file
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.src + '/second-page.pug',
      filename: 'second-page.html' // output file
    }),
    new webpack.ProvidePlugin({
      $: "jquery/dist/jquery.min.js",
      jQuery: "jquery/dist/jquery.min.js",
      "window.jQuery": "jquery/dist/jquery.min.js"
    })
  ],

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env'],
              plugins: ['@babel/plugin-proposal-class-properties'],
            },
          },
        ],
      },
      {
        test: /\.(svg|ico|gif|png|jpg|jpeg)$/i,
        // type: 'asset/resource',
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[name].[ext]',
            },
          },
          {
            loader: 'webp-loader',
            options: {
              quality: 70,
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: 'asset/inline',
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
      {
        test: /\.csv$/,
        use: ['csv-loader']
      }
    ],
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          chunks: 'all',
          enforce: true,
        },
      },
    },
  },
}