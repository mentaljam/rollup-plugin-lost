import typescript from '@rollup/plugin-typescript'


const formats = ['cjs', 'es']

const external = [
  'fs',
  'path',
  'rollup-pluginutils',
]

const config = formats.map(format => ({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    entryFileNames: '[name].[format].js',
    format,
    exports: 'auto',
  },
  external,
  plugins: [
    typescript(),
  ],
}))

if (process.env.BUILD_TESTS) {
  config.push({
    input: 'src/index.test.ts',
    output: {
      dir: 'dist',
      format: 'cjs',
    },
    external: [
      ...external,
      'colors',
      'rollup',
      'rollup-plugin-lost',
    ],
    plugins: [
      typescript({
        declaration: false,
      }),
    ],
  })
}

export default config
