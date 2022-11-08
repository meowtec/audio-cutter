/* eslint-disable quote-props */
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const isDevelopment = process.env.NODE_ENV !== 'production';

/**
 * create a webpack config
 * @param {string} entry
 * @param {boolean} isWorker
 */
function createConfig(
  entry,
  isWorker,
) {
  /** @type {import('webpack').Configuration} */
  const config = {
    entry: {
      [entry]: `./src/${entry}`,
    },

    output: {
      path: path.resolve(__dirname, 'dist'),
    },

    target: isWorker ? 'webworker' : 'web',

    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },

    module: {
      rules: [
        {
          test: /\.(t|j)sx?$/,
          use: [
            {
              loader: require.resolve('babel-loader'),
              options: {
                presets: [
                  '@babel/preset-typescript',
                  '@babel/preset-react',
                ],
                plugins: [
                  '@babel/plugin-proposal-class-properties',
                  isDevelopment && !isWorker && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
              },
            },
          ],
        },

        {
          test: /\.less$/,
          use: [
            'style-loader',
            'css-loader',
            'less-loader',
          ],
        },

        {
          test: /\.svg$/,
          loader: 'svg-sprite-loader',
          options: {
            symbolId: 'icon-[name]',
          },
        },
      ],
    },

    externals: isDevelopment ? {} : {
      'react': 'React',
      'react-dom': 'ReactDOM',
    },

    plugins: [
      !isWorker ? new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
      }) : null,
      isDevelopment && !isWorker ? new ReactRefreshWebpackPlugin() : null,
      new webpack.DefinePlugin({
        'process.env.IS_DEV': isDevelopment ? 'true' : 'false',
      }),
    ].filter(Boolean),
  };

  return config;
}

module.exports = [
  createConfig('index', false),
  createConfig('worker', true),
];
