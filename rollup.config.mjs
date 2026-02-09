import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';

// Stub out .css imports — styles are injected via Shadow DOM from all-styles.js
function stubCSS() {
  return {
    name: 'stub-css',
    resolveId(source) {
      if (source.endsWith('.css')) return source;
      return null;
    },
    load(id) {
      if (id.endsWith('.css')) return 'export default ""';
      return null;
    },
  };
}

export default {
  input: 'src/web-components/register.js',
  output: [
    {
      file: 'dist/quickpick.min.js',
      format: 'iife',
      name: 'Quickpick',
      exports: 'default',
      sourcemap: false,
    },
    {
      file: 'dist/quickpick.esm.js',
      format: 'es',
      sourcemap: false,
    },
  ],
  plugins: [
    stubCSS(),
    replace({
      'process.env.NODE_ENV': JSON.stringify('production'),
      preventAssignment: true,
    }),
    resolve({
      browser: true,
      extensions: ['.js', '.jsx'],
    }),
    babel({
      babelHelpers: 'bundled',
      presets: ['@babel/preset-react'],
      extensions: ['.js', '.jsx'],
      exclude: 'node_modules/**',
    }),
    commonjs(),
    terser(),
  ],
};
