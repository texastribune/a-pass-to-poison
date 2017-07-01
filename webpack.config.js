const path = require('path');
const webpack = require('webpack');

const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

const appSrc = path.join(__dirname, '/app/scripts');
const appBuild = path.join(__dirname, '/dist/scripts');

const IS_PRODUCTION = process.env.NODE_ENV === 'production';

const config = {
  devtool: 'cheap-module-source-map',
  context: appSrc,
  entry: {
    // if you are building an embed, swap out these two lines
    main: ['./utils/polyfills.js', './main.js']
    // main: ['./utils/polyfills.js', './main-embed.js']
  },
  output: {
    path: appBuild,
    pathinfo: true,
    publicPath: '/scripts/',
    filename: '[name].js',
    chunkFilename: '[id].[hash].chunk.js',
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath)
  },
  resolve: {
    extensions: ['.js', '.json', '.jsx']
  },
  module: {
    strictExportPresence: true,
    rules: [
      {
        test: /\.(js|jsx)$/,
        include: appSrc,
        loader: 'babel-loader',
        query: {
          presets: ['es2015'],
          plugins: ['syntax-dynamic-import']
        }
      }
    ]
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new webpack.optimize.ModuleConcatenationPlugin()
  ],
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty',
    setImmediate: false
  }
};

if (!IS_PRODUCTION) {
  config.plugins.push(new webpack.NamedModulesPlugin());
}

module.exports = config;
