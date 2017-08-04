const path = require('path')

const publicPath = 'dist'
const outputPath = path.resolve(__dirname, 'dist')

const isDevServer = process.argv[1].indexOf('webpack-dev-server') !== -1

const commonConfig = {
  output: {
    path: outputPath,
    publicPath,
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
    host: '0.0.0.0',
    hotOnly: true,
    inline: true,
    disableHostCheck: true,
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
  },
}

if (isDevServer) {
  commonConfig.devtool = 'source-map'
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
