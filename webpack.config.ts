import {resolve} from 'path';

import {alias} from './dev-helpers/alias';
import {externals} from './dev-helpers/dependencies';

export default {
  target: 'node',
  mode: 'production',
  entry: resolve('app/app.ts'),
  output: {
    path: resolve('dist'),
    filename: 'app.js',
  },
  resolve: {
    alias,
    extensions: ['.js', '.ts'],
  },
  externals,
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: {
          babelrc: false,
          presets: ['@babel/preset-typescript'],
        },
      },
    ],
  },
};
