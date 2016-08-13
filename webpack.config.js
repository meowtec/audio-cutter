const path = require('path')

module.exports = {
  entry: './src/entry',
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: 'dist',
    filename: 'index.js'
  },
  resolve: {
    extensions: ['', '.jsx', '.js']
  },
  module: {
    loaders: [
      { test: /\.less$/, loader: 'style!css!less' },
      { test: /\.jsx?$/, loader: 'babel', exclude: /node_modules/ },
    ]
  },
  devServer: {
    port: 9019
  },
  devtool: 'source-map'
}
