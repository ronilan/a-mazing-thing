const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  mode: 'none',
  entry: {
    vanilla: './src/vanilla.js',
    loader: './src/loader.js',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist/js')
  },
  plugins: [
    new CopyWebpackPlugin([
      { from: 'src/blocklike.js', to: 'blocklike.js' } //blocklike code can not be transpiled, so just copy
    ], {})
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/, // both .js and .jsx
        loader: 'eslint-loader',
        include: path.resolve(process.cwd(), 'src'),
        enforce: 'pre',
        options: {
          fix: true,
        },
      },
    ]
  },
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    compress: true,
    host: '0.0.0.0',//your ip address
    port: 8080,
    //writeToDisk: true
  }
};
