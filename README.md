[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![chat][chat]][chat-url]

<div align="center">
  <h1>ASM Async Loader</h1>
  <p>A loader for webpack that lets you import asm scripts in async mode to let the browser do async compilation.</p>
</div>

<h2 align="center">Install</h2>

```bash
npm install --save-dev npm-async-loader
```

<h2 align="center">Usage</h2>

Use the loader either via your webpack config, CLI or inline.

### Via webpack config (recommended)

**webpack.config.js**
```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        use: 'asm-async-loader'
      }
    ]
  }
}
```

**In your application**
```js
import promise from './asm-script.js';

promise
    .then(function() {
        //your script usage
    })
    .catch(function(err) {
        //script loading failed
    });
```

### Inline

**In your application**
```js
import promise from 'asm-async-loader!./asm-script.js';

promise
    .then(function() {
        //your script usage
    })
    .catch(function(err) {
        //script loading failed
    });
```


[npm]: https://img.shields.io/npm/v/asm-async-loader.svg
[npm-url]: https://npmjs.com/package/asm-async-loader

[node]: https://img.shields.io/node/v/asm-async-loader.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/paztis/asm-async-loader.svg
[deps-url]: https://david-dm.org/paztis/asm-async-loader
