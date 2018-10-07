import resolve from 'rollup-plugin-node-resolve'
import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'

const pkg = require('./package.json')

export default {
  input: 'src/index.js',
  output: [
    {
      file: pkg.main,
      format: 'cjs',
    },
    {
      file: pkg.module,
      format: 'es',
    },
  ],
  format: process.env.NODE_ENV,
  external: ['react'],
  plugins: [
    resolve(),
    babel({
      exclude: 'node_modules/**',
      plugins: [
        '@babel/plugin-external-helpers',
        '@babel/plugin-proposal-class-properties',
      ],
      externalHelpers: true,
    }),
    commonjs(),
  ],
}