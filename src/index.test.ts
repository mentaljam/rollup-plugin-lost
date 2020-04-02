import 'colors'
import {rollup} from 'rollup'

import lost from './index'


const originalStderrWrite = process.stderr.write.bind(process.stderr)

let output = ''

// eslint-disable-next-line @typescript-eslint/unbound-method
process.stderr.write = ((
  str: Uint8Array | string,
  encoding?: string,
  cb?: (err?: Error) => void,
): boolean => {
  if (typeof str === 'string') {
    output += str
  }
  return originalStderrWrite(str, encoding, cb)
}) as typeof process.stderr.write


console.info('Running tests...'.cyan)
const start = new Date().getTime()

rollup({
  input: 'test/index.js',
  plugins: [
    lost({
      include: 'test/*',
    }),
  ],
}).then(bundle => {
  return bundle.write({
    chunkFileNames: '[name].js',
    dir: `test/dist`,
    format: 'es',
  })
}).then(() => {
  const duration = (new Date().getTime() - start) + 'ms'
  // eslint-disable-next-line @typescript-eslint/unbound-method
  process.stderr.write = originalStderrWrite
  if (!(/test[/\\]+lost\.js/.test(output))) {
    console.error(('Failed after ' + duration).red)
    process.exit(1)
  }
  console.info(('Finished in ' + duration).green)
})
