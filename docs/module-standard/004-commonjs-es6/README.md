# 004-CommonJS和ES6

> 转载自：[你可能不知道的 JavaScript 模块化野史](https://juejin.im/post/5e3985396fb9a07cde64c489#heading-6)

# ES Module

在2015 年 6 月， ECMAScript6 标准正式发布，其中的 ES 模块化规范的提出目标是整合 CommonJS、AMD 等已有模块方案，在语言标准层面实现模块化，成为浏览器和服务器通用的模块解决方案。

模块功能由 export 和 import 两个命令完成。export 对外输出模块，import 用于引入模块。[import 更多用法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/import), [export 更多用法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/export)。

```
// 导入单个接口
import {myExport} from '/modules/my-module.js';
// 导入多个接口
import {foo, bar} from '/modules/my-module.js';

// 导出早前定义的函数
export { myFunction }; 

// 导出常量
export const foo = Math.sqrt(2);

复制代码
```

ES Module 与 CommonJS 及 Loaders 等方案的区别主要在以下方面：

- 声明式而非命令式，或者说 `import` 是声明语句 Declaration 而非表达式 Statement，在 ES Module 中无法使用 `import` 声明带变量的依赖、或者动态引入依赖：
- CommonJS 模块输出的是一个值的拷贝，ES6 模块输出的是值的引用。
- `import` 是预先解析、预先加载的，不像 RequireJS 等是执行到点了再发一个请求

对务实主义的 Node.js 开发者来说，这些区别都让 npm 所营造出来的海量社区代码陷入一种尴尬的境地，无论是升级还是兼容都需要大量的工作。对此，David Herman 撰文解释，[ES Module 所带来的好处远大于不便](http://calculist.org/blog/2012/06/29/static-module-resolution/)：

- **静态 `import` 能确保被编译成变量引用**，这些引用在当前执行环境运行时能被解析器（通过 JIT 编译 [polymorphic inline cache](http://blog.cdleary.com/2010/09/picing-on-javascript-for-fun-and-profit/)）优化，执行更有效率
- **静态 export 能让变量检测更准确**，在 JSHint、ESLint 等代码检测工具中，变量是否定义是个非常受欢迎的功能，而静态 `export` 能让这一检测更具准确性
- **更完备的循环依赖处理**，在 Node.js 等已有的 CommonJS 实现中，循环依赖是通过传递未完成的 `exports` 对象解决的，对于直接引用 `exports.foo` 或者父模块覆盖 `module.exports` 的情况，传统方式无从解决，而因为 ES Module 传递的是引用，便不会有这些问题

其他还有对未来可能新增的标准（宏、类型系统等）更兼容等。



## ES Module in Browser

在 ES Module 标准出来之前，尽管社区实现的 Loader 一箩筐，但浏览器自身一直没有选定模块方案，支持 ES Module 对浏览器来说还是比较少顾虑的。

由于 ES Module 的执行环境和普通脚本不同，浏览器选择增加 `` ，只有 `` 中的脚本（和 `import` 进来的脚本）才是 `module` 模式。也只有 `module` 模式执行的脚本，才可以声明 `import` 。也就是说，下面这种代码是不行的：

```
<script>
import foo from "./foo.js"
</script>

<script type="javascript">
import bar from "./bar.js"
</script>
复制代码
```

目前，几大常青浏览器都[已支持 ES Module](https://caniuse.com/#search=import)。最后一个支持的是 Firefox，2018 年 5 月 8 日发布的 Firefox 60 正式支持 ES Module。

此外，考虑到向后兼容，浏览器还增加 `` 标签。开发者可以使用 `` 标签兼容不支持 ES Module 的浏览器：

```
// 在浏览器中，import 语句只能在声明了 type="module" 的 script 的标签中使用。
<script type="module" src="./app.js"></script>
// 在 script 标签中使用 nomodule 属性，可以确保向后兼容。
<script nomodule src="./app.bundle.js"></script>
复制代码
```



## ES Module in Node.js

但在 Node.js 这边，ES Module 遭遇的声音要大很多。前 Node.js 领导者 Isaacs Schlutuer 甚至认为 ES Module 太过阳春白雪且不考虑实际情况，毫无价值（[adds nothing](http://blog.izs.me/post/25906678790/on-es-6-modules)）。

首先纠结的是如何支持 `module` 执行模式，是自动检测，还是 `'use module'` ，还是在 `package.json` 里增加 `module` 属性作为专门的入口，还是干脆增加一个新的扩展名？

最终 Node.js 选择增加新的扩展名 `.mjs` ：

- 在 `.mjs` 中可以自如使用 `import` 和 `export`
- 在 `.mjs` 中不可以使用 `require`
- 在 `.js` 中只能使用 `require`
- 在 `.js` 中不可以使用 `import` 和 `export`

也就是两套模块系统完全独立。此外，依赖查找方式也有变化，原本 `require.extensions` 是：

```
{ '.js': [Function],
  '.json': [Function],
  '.node': [Function] }
复制代码
```

如今（需要开启 `--experimental-modules` 选项）则是：

```
{ '.js': [Function],
  '.json': [Function],
  '.node': [Function],
  '.mjs': [Function] }
复制代码
```

但两套独立的模块系统也导致第二个纠结的方面，模块系统彼此之间如何互通？对浏览器来说这不是问题，但对 Node.js 来说，npm 中海量的 CommonJS 模块是它不得不考虑的。

最终确定的方案倒也简单，在 `.mjs` 里，开发者可以 `import` CommonJS（虽然只能 `import default`）：

```
import 'fs' from 'fs'
import { readFile } from 'fs'
import foo from './foo'
// etc.
复制代码
```

在 `.js` 里，开发者自然不能 `import` ES Module，但他们可以 `import()` ：

```
import('./foo').then(foo => {
  // use foo
})

async function() {
  const bar = await import('./bar')
  // use bar
}()
复制代码
```

注意，和浏览器以引入方式判断运行模式不同，Node.js 中脚本的运行模式是和扩展名绑定的。也就是说，依赖的查找方式会有所不同：

- 在 `.js` 中 `require('./foo')` 找的是 `./foo.js` 或者 `./foo/index.js`
- 在 `.mjs` 中 `import './bar'` 找的是 `./bar.mjs` 或者 `./bar/index.mjs`

善用这些特性，我们现在就可以将已有的 npm 模块升级成 ES Module，并且仍然支持 CommonJS 方式。



## Dynamic Import

静态型的 `import` 是初始化加载依赖项的最优选择，使用静态 `import` 更容易从代码静态分析工具和 [tree shaking](https://developer.mozilla.org/zh-CN/docs/Glossary/Tree_shaking) 中受益。但当希望按照一定的条件或者按需加载模块的时候，需要动态引入依赖，例如：

```
if (process.env.NODE_ENV !== 'production') {
  require('./cjs/react.development.js')
} else {
  require('./cjs/react.production.js')
}

if (process.env.BROWSER) {
  require('./browser.js')
}
复制代码
```

为此，Domenic Denicola 起草 `import()` [标准](http://2ality.com/2017/01/import-operator.html)[提案](https://github.com/tc39/proposal-dynamic-import)。

```
//这是一个处于第三阶段的提案。
var promise = import("module-name");
复制代码
```

除了可以用来处理动态依赖，HTML 中的 script 标签不需要声明 `type="module"` 。

```
<script>
import('./foo.js').then(foo => {
  // use foo
})
</script>
复制代码
```

在 Node.js 中（`.js` 文件）还可以使用 import() 引入使用 import 的 ES Module ：

```
import('./foo.mjs').then(foo => {
  // use foo
})
复制代码
```

使用 ES Module 编写浏览器、Node.js 通用的 JavaScript 模块化代码已经完全可行，我们还需要编译或者打包工具吗？















