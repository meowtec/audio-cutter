const path = require('path')

const commonConfig = {
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.jsx', '.js']
  },
  module: {
    rules: [
      {
        test: /\.less$/,
        use: [
          'style-loader',
          'css-loader',
          'less-loader',
        ]
      },
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        options: {
          symbolId: 'icon-[name]',
        },
      },
    ]
  },
  devServer: {
    port: 9019,
    hotOnly: true,
    inline: true,
  },
  devtool: 'source-map'
}

module.exports = [
  Object.assign({
    entry: {
      index: './src/index',
    },
  }, commonConfig),

  Object.assign({
    entry: {
      worker: './src/worker',
    },
    target: 'webworker'
  }, commonConfig),
]
