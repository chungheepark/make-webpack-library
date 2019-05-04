const webpack = require('webpack');
const process = require('process');

const minimize = process.argv.indexOf('-p') !== -1;

module.exports = {
  devtool: 'source-map',
  mode: minimize ? 'production' : 'development',
  entry: { lib: './src/index.js' },
  module: {
    rules: [
      {
        // Transpile ES2015 (aka ES6) to ES5.
        exclude: [new RegExp(`${__dirname}/node_modules/(?!js-utils)`)],
        loader: 'babel-loader',
        test: /\.js$/,
        options: {
          presets: [
            [
              '@babel/preset-env',
              {
                modules: false,
                debug: true,
                useBuiltIns: 'usage',
              },
            ],
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-export-default-from',
            '@babel/plugin-proposal-export-namespace-from',
          ],
        },
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
    }),
  ],
  node: {
    // Allow the use of the real filename of the module being executed. By
    // default Webpack does not leak path-related information and provides a
    // value that is a mock (/index.js).
    __filename: true,
  },
  optimization: {
    concatenateModules: minimize,
  },
  output: {
    path: process.cwd(),
    filename: `[name]${minimize ? '.min' : ''}.js`,
    library: 'MyLib',
    libraryTarget: 'umd',
    globalObject: 'this',
    sourceMapFilename: `[name].${minimize ? 'min' : 'js'}.map`,
    umdNamedDefine: true,
  },
};
