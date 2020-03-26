# rollup-plugin-zip

[Rollup](https://github.com/rollup/rollup) plugin to list lost (unused) files
in the project directory.

Lost files are listed in the stderr.

## Install

```sh
npm i -D rollup-plugin-lost
```

## Usage

### Source files

```js
// src/index.js
import usedMod from './used'
console.log(usedMod)
```

```js
// src/used.js
export default 'used-module'
```

```js
// src/lost.js
export default 'lost-module'
```

### Configuration

```js
// rollup.config.js
import lost from 'rollup-plugin-lost'

export default {
  input: 'src/index.js',
  output: {
    dir: 'dist',
    format: 'es',
  },
  plugins: [
    lost(),
  ],
}
```

### Output

```
Lost files:
  test/lost.js
```

## Options

### include

#### Type

```js
string | RegExp | (string | RegExp)[] | null | undefined
```

#### Default

```js
'src/**/*'
```

Patterns to search for lost files.

### exclude

#### Type

```js
string | RegExp | (string | RegExp)[] | null | undefined
```

Optional patterns to exclude from search for lost files.

## License

[MIT](LICENSE) © [Petr Tsymbarovich](mailto:petr@tsymbarovich.ru)
