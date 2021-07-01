import * as fs from 'fs'
import * as path from 'path'
import {Plugin} from 'rollup'
import {CreateFilter, createFilter} from 'rollup-pluginutils'


type FilterType = Parameters<CreateFilter>[0]

/** Configuration for the rollup plugin "lost" */
interface IRollupPluginLostConfig {
  /** Patterns to exclude from search for lost files */
  exclude?: FilterType
  /**
   * Patterns to search for lost files
   *
   * @default 'src/**‍/*'
   */
  include?: FilterType
}

/** Factory for the plugin lost */
type RollupPluginLostFactory = (config?: IRollupPluginLostConfig) => Plugin

const rollupPluginLost: RollupPluginLostFactory = ({
  exclude,
  include = 'src/**/*',
} = {}) => {
  let inputdirs: string[]
  let used:      Set<string>

  return {
    name: 'lost',

    buildStart({input}): void {
      if (typeof input === 'string') {
        inputdirs = [path.dirname(input)]
      } else if (Array.isArray(input)) {
        inputdirs = input.map(i => path.dirname(i))
      } else if (input) {
        inputdirs = Object.values(input).map(i => path.dirname(i))
      } else {
        inputdirs = []
      }
      if (!inputdirs.length) {
        this.error('Cannot determine input directories. Is the Rollup `input` option set?')
      }
      used = new Set()
    },

    transform(_code, id): undefined {
      used.add(id)
      return undefined
    },

    writeBundle(): void {
      const notIgnored = createFilter(include, exclude)
      const unused     = []

      while (inputdirs.length > 0) {
        // Cannot be undefined due to the check above
        const dir     = inputdirs.shift() as string
        const entries = fs.readdirSync(dir)

        for (let entry of entries) {
          entry = path.resolve(dir, entry)
          if (fs.statSync(entry).isDirectory()) {
            inputdirs.push(entry)
          } else if (!used.has(entry) && notIgnored(entry)) {
            unused.push(entry)
          }
        }
      }

      if (unused.length > 0) {
        const cwd = process.cwd()
        const formatted = unused
          .map(u => path.relative(cwd, u))
          .join('\n  ')
        this.warn('Lost files:\n  ' + formatted)
      }
    },
  }
}

export default rollupPluginLost
