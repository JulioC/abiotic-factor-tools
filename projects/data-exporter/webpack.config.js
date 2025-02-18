const { NxAppWebpackPlugin } = require('@nx/webpack/app-plugin');
const { join } = require('path');

module.exports = {
  output: {
    path: join(__dirname, '../dist/projects/'),
    devtoolModuleFilenameTemplate: '[absolute-resource-path]'
  },
  devtool: 'source-map',
  plugins: [
    new NxAppWebpackPlugin({
      target: 'node',
      compiler: 'tsc',
      main: './src/main.ts',
      tsConfig: './tsconfig.app.json',
      assets: [],
      optimization: false,
      outputHashing: 'none',
      sourceMap: true
    }),
  ],
  node: {
    __filename: true,
    __dirname: true
  }
};
