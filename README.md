## Wasm Game of life

[You can try online](https://guillaume-gomez.github.io/wasm-game-of-life/)

### Run locally

```
wasm-pack build
cd www
npm run start
```

yarn does not work here :(


## About

[**📚 Read this template tutorial! 📚**][template-docs]

This template is designed for compiling Rust libraries into WebAssembly and
publishing the resulting package to NPM.

Be sure to check out [other `wasm-pack` tutorials online][tutorials] for other
templates and usages of `wasm-pack`.

[tutorials]: https://rustwasm.github.io/docs/wasm-pack/tutorials/index.html
[template-docs]: https://rustwasm.github.io/docs/wasm-pack/tutorials/npm-browser-packages/index.html

## 🚴 Usage

### 🛠️ Build with `wasm-pack build`

```
wasm-pack build
```


### 🔬 Test in Headless Browsers with `wasm-pack test`

```
wasm-pack test --headless --firefox
```