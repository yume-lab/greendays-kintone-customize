// output.pathに絶対パスを指定する必要があるため、pathモジュールを読み込んでおく
const path = require('path');
const os = require('os');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  cache: true,
  // 出力の設定
  output: {
    // 最後の記述はディレクトリ名
    path: path.join(os.homedir(), 'Dropbox/kintone/greendays-kintone-customize/app/', __dirname.split(path.sep).pop(), 'development'),
    filename: '[name].js',
  },
  devtool: 'inline-source-map',
});
