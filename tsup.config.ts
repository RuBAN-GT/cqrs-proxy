import type { Options } from 'tsup'

export const tsup: Options = {
  clean: true,
  dts: true,
  format: ['cjs', 'esm'],
  minify: true,
  entry: ['src/index.ts'],
  target: 'es2020',
  outDir: 'dist',
}
