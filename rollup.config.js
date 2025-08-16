import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'esm',
      sourcemap: true,
    },
    {
      file: 'dist/index.cjs',
      format: 'cjs',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve({
      browser: true,
    }),
    commonjs(),
    typescript({
      tsconfig: './tsconfig.lib.json',
      exclude: ['**/*.test.*', '**/*.spec.*', 'src/main.tsx', 'src/App.tsx'],
    }),
  ],
  external: [
    'react',
    'react-dom',
    'react/jsx-runtime',
    '@rainbow-me/rainbowkit',
    '@tanstack/react-query',
    'viem',
    'wagmi',
  ],
};
