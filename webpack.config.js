const path = require('path')

module.exports = {
  entry: './src/index',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
    filename: '[name].js'
  },
  resolve: {
    extensions: ['', '.jsx', '.js']
  },
  module: {
    loaders: [
      {
        test: /\.less$/,
        loader: 'style!css!less'
      },
      {
        test: /\.jsx?$/,
        loader: 'babel',
        exclude: /node_modules/
      },
      {
        test: /\.svg$/,
        loader: path.resolve(__dirname, 'build/svg-spirit-loader')
      }
    ]
  },
  devServer: {
    port: 9019
  },
  devtool: 'source-map'
}
