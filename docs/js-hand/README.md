# 手写JS代码

<motto></motto>

## 模拟call

* 第一个参数为 `null` 或者 `undefined` 时， `this` 指向全局对象 `window` ，值为原始值的指向该原始值的自动包装对象，如 `String` 、 `Number` 、 `Boolean` 
* 为了避免函数名与上下文( `context` )的属性发生冲突，使用 `Symbol` 类型作为唯一值
* 将函数作为传入的上下文( `context` )属性执行
* 函数执行完成后删除该属性
* 返回执行结果

``` js
Function.prototype.myCall = function(context, ...args) {
    context = (context ? ? window) || new Object(context)
    const key = Symbol()
    context[key] = this
    const result = context[key](...args)
    delete context[key]
    return result
}
```

注： 代码实现使用了 `ES2020` 新特性 `Null` 判断符 `??` ， 详细参考阮一峰老师的[ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/object)

**ES3实现**

```js
function fnFactory(context) {
  var unique_fn = "fn";
  while (context.hasOwnProperty(unique_fn)) {
    unique_fn = "fn" + Math.random();
  }
  return unique_fn;
}
Function.prototype.call2 = function(context) {
  // 1. 若是传入的context是null或者undefined时指向window;
  // 2. 若是传入的是原始数据类型, 原生的call会调用 Object() 转换
  context = (context !== null && context !== undefined) ? Object(context) : window;
  // 3. 创建一个独一无二的fn函数的命名
  var fn = fnFactory(context);
  // 4. 这里的this就是指调用call的那个函数
  // 5. 将调用的这个函数赋值到context中, 这样之后执行context.fn的时候, fn里的this就是指向context了
  context[fn] = this;
  // 6. 定义一个数组用于放arguments的每一项的字符串: ['agruments[1]', 'arguments[2]']
  var args = [];
  // 7. 要从第1项开始, 第0项是context
  for (var i = 1, l = arguments.length; i < l; i++) {
    args.push("arguments[" + i + "]");
  }
  // 8. 使用eval()来执行fn并将args一个个传递进去
  var result = eval("context[fn](" + args + ")");
  // 9. 给context额外附件了一个属性fn, 所以用完之后需要删除
  delete context[fn];
  // 10. 函数fn可能会有返回值, 需要将其返回
  return result;
};

```

## 模拟apply

* 前部分与 `call` 一样
* 第二个参数可以不传，但类型必须为数组或者类数组

``` js
Function.prototype.myApply = function(context) {
    context = (context ? ? window) || new Object(context)
    const key = Symbol()
    const args = arguments[1]
    context[key] = this
    const result = args ? context[key](...args) : context[key]()
    delete context[key]
    return result
}
```

注：代码实现存在缺陷，当第二个参数为类数组时，未作判断（有兴趣可查阅一下如何判断类数组）

**ES3实现**

```js
function fnFactory(context) {
  var unique_fn = "fn";
  while (context.hasOwnProperty(unique_fn)) {
    unique_fn = "fn" + Math.random();
  }
  return unique_fn;
}
Function.prototype.apply2 = function(context, arr) {
  // 1. 若是传入的context是null或者undefined时指向window;
  // 2. 若是传入的是原始数据类型, 原生的call会调用 Object() 转换
  context = context ? Object(context) : window;
  // 3. 创建一个独一无二的fn函数的命名
  var fn = fnFactory(context);
  // 4. 这里的this就是指调用call的那个函数
  // 5. 将调用的这个函数赋值到context中, 这样之后执行context.fn的时候, fn里的this就是指向context了
  context[fn] = this;

  var result;
  // 6. 判断有没有第二个参数
  if (!arr) {
    result = context[fn]();
  } else {
    // 7. 有的话则用args放每一项的字符串: ['arr[0]', 'arr[1]']
    var args = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      args.push("arr[" + i + "]");
    }
    // 8. 使用eval()来执行fn并将args一个个传递进去
    result = eval("context[fn](" + args + ")");
  }
  // 9. 给context额外附件了一个属性fn, 所以用完之后需要删除
  delete context[fn];
  // 10. 函数fn可能会有返回值, 需要将其返回
  return result;
};
```

## 模拟bind

* 使用 `call / apply` 指定 `this` 
* 返回一个绑定函数
* 当返回的绑定函数作为构造函数被 `new` 调用，绑定的上下文指向实例对象
* 设置绑定函数的 `prototype` 为原函数的 `prototype` 

``` js
Function.prototype.myBind = function(context, ...args) {
    const fn = this
    const bindFn = function(...newFnArgs) {
        return fn.call(
            this instanceof bindFn ? this : context,
            ...args, ...newFnArgs
        )
    }
    bindFn.prototype = Object.create(fn.prototype)
    return bindFn
}
```

```js
Function.prototype.bind2 = function(context) {
  // 1. 判断调用bind的是不是一个函数
  if (typeof this !== "function") {
    throw new Error(
      "Function.prototype.bind - what is trying to be bound is not callable"
    );
  }
  // 2. 外层的this指向调用者(也就是调用的函数)
  var self = this;
  // 3. 收集调用bind时的其它参数
  var args = Array.prototype.slice.call(arguments, 1);

  // 4. 创建一个返回的函数
  var fBound = function() {
    // 6. 收集调用新的函数时传入的其它参数
    var innerArgs = Array.prototype.slice.call(arguments);
    // 7. 使用apply改变调用函数时this的指向
    // 作为构造函数调用时this表示的是新产生的对象, 不作为构造函数用的时候传递context
    return self.apply(
      this instanceof fNOP ? this : context,
      args.concat(innerArgs)
    );
  };
  // 5. 创建一个空的函数, 且将原型指向调用者的原型(为了能用调用者原型中的属性)
  // 下面三步的作用有点类似于 fBoun.prototype = this.prototype 但有区别
  var fNOP = function() {};
  fNOP.prototype = this.prototype;
  fBound.prototype = new fNOP();
  // 8. 返回最后的结果
  return fBound;
};

```

## 模拟new

* 创建一个新的空对象
* 把 `this` 绑定到空对象
* 使空对象的 `__proto__` 指向构造函数的原型( `prototype` )
* 执行构造函数，为空对象添加属性
* 判断构造函数的返回值是否为对象，如果是对象，就使用构造函数的返回值，否则返回创建的对象

``` js
const createNew = (Con, ...args) => {
    const obj = {}
    Object.setPrototypeOf(obj, Con.prototype)
    let result = Con.apply(obj, args)
    return result instanceof Object ? result : obj
}
```

## 模拟instanceof

* 遍历左边变量的原型链，直到找到右边变量的 prototype，如果没有找到，返回 `false` 

``` js
const myInstanceOf = (left, right) => {
    let leftValue = left.__proto__
    let rightValue = right.prototype
    while (true) {
        if (leftValue === null) return false
        if (leftValue === rightValue) return true
        leftValue = leftValue.__proto__
    }
}
```

## 深拷贝（简单版）

* 判断类型是否为原始类型，如果是，无需拷贝，直接返回
* 为避免出现循环引用，拷贝对象时先判断存储空间中是否存在当前对象，如果有就直接返回
* 开辟一个存储空间，来存储当前对象和拷贝对象的对应关系
* 对引用类型递归拷贝直到属性为原始类型

``` js
const deepClone = (target, cache = new WeakMap()) => {
    if (target === null || typeof target !== 'object') {
        return target
    }
    if (cache.get(target)) {
        return target
    }
    const copy = Array.isArray(target) ? [] : {}
    cache.set(target, copy)
    Object.keys(target).forEach(key => copy[key] = deepClone(target[key], cache))
    return copy
}
```

缺点：无法拷贝函数、 `Map` 、 `Set` 、正则等其他类型

## 深拷贝（尤雨溪版）

[vuex源码](https://github.com/vuejs/vuex/blob/dev/src/util.js)

* 原理与上一版类似

``` js
function find(list, f) {
    return list.filter(f)[0]
}

function deepCopy(obj, cache = []) {
    // just return if obj is immutable value
    if (obj === null || typeof obj !== 'object') {
        return obj
    }

    // if obj is hit, it is in circular structure
    const hit = find(cache, c => c.original === obj)
    if (hit) {
        return hit.copy
    }

    const copy = Array.isArray(obj) ? [] : {}
    // put the copy into cache at first
    // because we want to refer it in recursive deepCopy
    cache.push({
        original: obj,
        copy
    })
    Object.keys(obj).forEach(key => copy[key] = deepCopy(obj[key], cache))

    return copy
}
```

## 深拷贝（复杂版）

[如何写出一个惊艳面试官的深拷贝?](https://github.com/ConardLi/ConardLi.github.io/blob/master/demo/deepClone/src/clone_6.js)

``` js
const mapTag = '[object Map]';
const setTag = '[object Set]';
const arrayTag = '[object Array]';
const objectTag = '[object Object]';
const argsTag = '[object Arguments]';

const boolTag = '[object Boolean]';
const dateTag = '[object Date]';
const numberTag = '[object Number]';
const stringTag = '[object String]';
const symbolTag = '[object Symbol]';
const errorTag = '[object Error]';
const regexpTag = '[object RegExp]';
const funcTag = '[object Function]';

const deepTag = [mapTag, setTag, arrayTag, objectTag, argsTag];

function forEach(array, iteratee) {
    let index = -1;
    const length = array.length;
    while (++index < length) {
        iteratee(array[index], index);
    }
    return array;
}

function isObject(target) {
    const type = typeof target;
    return target !== null && (type === 'object' || type === 'function');
}

function getType(target) {
    return Object.prototype.toString.call(target);
}

function getInit(target) {
    const Ctor = target.constructor;
    return new Ctor();
}

function cloneSymbol(targe) {
    return Object(Symbol.prototype.valueOf.call(targe));
}

function cloneReg(targe) {
    const reFlags = /\w*$/;
    const result = new targe.constructor(targe.source, reFlags.exec(targe));
    result.lastIndex = targe.lastIndex;
    return result;
}

function cloneFunction(func) {
    const bodyReg = /(?<={)(.|\n)+(?=})/m;
    const paramReg = /(?<=\().+(?=\)\s+{)/;
    const funcString = func.toString();
    if (func.prototype) {
        const param = paramReg.exec(funcString);
        const body = bodyReg.exec(funcString);
        if (body) {
            if (param) {
                const paramArr = param[0].split(',');
                return new Function(...paramArr, body[0]);
            } else {
                return new Function(body[0]);
            }
        } else {
            return null;
        }
    } else {
        return eval(funcString);
    }
}

function cloneOtherType(targe, type) {
    const Ctor = targe.constructor;
    switch (type) {
        case boolTag:
        case numberTag:
        case stringTag:
        case errorTag:
        case dateTag:
            return new Ctor(targe);
        case regexpTag:
            return cloneReg(targe);
        case symbolTag:
            return cloneSymbol(targe);
        case funcTag:
            return cloneFunction(targe);
        default:
            return null;
    }
}

function clone(target, map = new WeakMap()) {

    // 克隆原始类型
    if (!isObject(target)) {
        return target;
    }

    // 初始化
    const type = getType(target);
    let cloneTarget;
    if (deepTag.includes(type)) {
        cloneTarget = getInit(target, type);
    } else {
        return cloneOtherType(target, type);
    }

    // 防止循环引用
    if (map.get(target)) {
        return map.get(target);
    }
    map.set(target, cloneTarget);

    // 克隆set
    if (type === setTag) {
        target.forEach(value => {
            cloneTarget.add(clone(value, map));
        });
        return cloneTarget;
    }

    // 克隆map
    if (type === mapTag) {
        target.forEach((value, key) => {
            cloneTarget.set(key, clone(value, map));
        });
        return cloneTarget;
    }

    // 克隆对象和数组
    const keys = type === arrayTag ? undefined : Object.keys(target);
    forEach(keys || target, (value, key) => {
        if (keys) {
            key = value;
        }
        cloneTarget[key] = clone(target[key], map);
    });

    return cloneTarget;
}
```

## 深拷贝（高性能版）

[头条面试官：你知道如何实现高性能版本的深拷贝嘛？](https://juejin.im/post/5df7175fe51d45582512962c)

``` js
const MY_IMMER = Symbol('my-immer1')

const isPlainObject = value => {
    if (
        !value ||
        typeof value !== 'object' || {}.toString.call(value) != '[object Object]'
    ) {
        return false
    }
    var proto = Object.getPrototypeOf(value)
    if (proto === null) {
        return true
    }
    var Ctor = hasOwnProperty.call(proto, 'constructor') && proto.constructor
    return (
        typeof Ctor == 'function' &&
        Ctor instanceof Ctor &&
        Function.prototype.toString.call(Ctor) ===
        Function.prototype.toString.call(Object)
    )
}

const isProxy = value => !!value && !!value[MY_IMMER]

function produce(baseState, fn) {
    const proxies = new Map()
    const copies = new Map()

    const objectTraps = {
        get(target, key) {
            if (key === MY_IMMER) return target
            const data = copies.get(target) || target
            return getProxy(data[key])
        },
        set(target, key, val) {
            const copy = getCopy(target)
            const newValue = getProxy(val)
            // 这里的判断用于拿 proxy 的 target
            // 否则直接 copy[key] = newValue 的话外部拿到的对象是个 proxy
            copy[key] = isProxy(newValue) ? newValue[MY_IMMER] : newValue
            return true
        }
    }

    const getProxy = data => {
        if (isProxy(data)) {
            return data
        }
        if (isPlainObject(data) || Array.isArray(data)) {
            if (proxies.has(data)) {
                return proxies.get(data)
            }
            const proxy = new Proxy(data, objectTraps)
            proxies.set(data, proxy)
            return proxy
        }
        return data
    }

    const getCopy = data => {
        if (copies.has(data)) {
            return copies.get(data)
        }
        const copy = Array.isArray(data) ? data.slice() : {
            ...data
        }
        copies.set(data, copy)
        return copy
    }

    const isChange = data => {
        if (proxies.has(data) || copies.has(data)) return true
    }

    const finalize = data => {
        if (isPlainObject(data) || Array.isArray(data)) {
            if (!isChange(data)) {
                return data
            }
            const copy = getCopy(data)
            Object.keys(copy).forEach(key => {
                copy[key] = finalize(copy[key])
            })
            return copy
        }
        return data
    }

    const proxy = getProxy(baseState)
    fn(proxy)
    return finalize(baseState)
}
```

## 函数防抖

函数防抖是在事件被触发 `n` 秒后再执行回调，如果在 `n` 秒内又被触发，则重新计时。 函数防抖多用于 `input` 输入框

* 箭头函数的 `this` 继承自父级上下文，这里指向触发事件的目标元素
* 事件被触发时，传入 `event` 对象
* 传入 `leading` 参数，判断是否可以立即执行回调函数，不必要等到事件停止触发后才开始执行
* 回调函数可以有返回值，需要返回执行结果

``` js
 const debounce = (fn, wait = 300, leading = true) => {
     let timerId, result
     return function(...args) {
         timerId && clearTimeout(timerId)
         if (leading) {
             if (!timerId) result = fn.apply(this, args)
             timerId = setTimeout(() => timerId = null, wait)
         } else {
             timerId = setTimeout(() => result = fn.apply(this, args), wait)
         }
         return result
     }
 }
```

## 函数节流（定时器）

函数节流是指连续触发事件，但是在 n 秒中只执行一次函数，适合应用于动画相关的场景

``` js
const throttle = (fn, wait = 300) => {
    let timerId
    return function(...args) {
        if (!timerId) {
            timerId = setTimeout(() => {
                timerId = null
                return result = fn.apply(this, ...args)
            }, wait)
        }
    }
}
```

## 函数节流（时间戳）

``` js
const throttle = (fn, wait = 300) => {
    let prev = 0
    let result
    return function(...args) {
        let now = +new Date()
        if (now - prev > wait) {
            prev = now
            return result = fn.apply(this, ...args)
        }
    }
}
```

### 函数节流实现方法区别

|    方法    |  使用时间戳  |    使用定时器    |
| :--------: | :----------: | :--------------: |
| 开始触发时 |   立刻执行   |    n秒后执行     |
| 停止触发后 | 不再执行事件 | 继续执行一次事件 |

## 函数节流（双剑合璧版）

``` js
 const throttle = (fn, wait = 300, {
     // 参数解构赋值
     leading = true,
     trailing = true,
 } = {}) => {
     let prev = 0
     let timerId
     const later = function(args) {
         timerId && clearTimeout(timerId)
         timerId = setTimeout(() => {
             timerId = null
             fn.apply(this, args)
         }, wait)
     }
     return function(...args) {
         let now = +new Date()
         if (!leading) return later(args)
         if (now - prev > wait) {
             fn.apply(this, args)
             prev = now
         } else if (trailing) {
             later(args)
         }
     }
 }
```

`leading：false` 表示禁用第一次执行

`trailing: false` 表示禁用停止触发的回调

注意： `leading：false` 和 `trailing: false` 不能同时设置。

## 数组去重

``` js
const uniqBy = (arr, key) => {
    return [...new Map(arr.map(item => [item[key], item])).values()]
}

const singers = [{
        id: 1,
        name: 'Leslie Cheung'
    },
    {
        id: 1,
        name: 'Leslie Cheung'
    },
    {
        id: 2,
        name: 'Eason Chan'
    },
]
console.log(uniqBy(singers, 'id'))

//  [
//    { id: 1, name: 'Leslie Cheung' },
//    { id: 2, name: 'Eason Chan' },
//  ]
```

原理是利用 `Map` 的键不可重复

## 数组扁平化（技巧版）

利用 `toString` 把数组变成以逗号分隔的字符串，遍历数组把每一项再变回原来的类型。缺点：数组中元素必须是 `Number` 类型， `String` 类型会被转化成 `Number` 

``` js
const str = [0, 1, [2, [3, 4]]].toString()
// '0, 1, 2, 3, 4'
const arr = str.split(',')
// ['0','1','2', '3', '4']
const newArr = arr.map(item => +item)
// [0, 1, 2, 3, 4]

const flatten = (arr) => arr.toString().split(',').map(item => +item)
```

## 数组扁平化

`reduce` + 递归

``` js
const flatten = (arr, deep = 1) => {
    return arr.reduce((cur, next) => {
        return Array.isArray(next) && deep > 1 ? [...cur, ...flatten(next, deep - 1)] : [...cur, next]
    }, [])
}

const arr = [1, [2],
    [3, [4]]
]
flatten(arr, 1) // [1, [2], [3, [4]]]
flatten(arr, 2) // [1，2, [3, 4]]
flatten(arr, 3) // [1，2, 3, 4]
```

## 函数柯里化

``` js
const currying = fn =>
    _curry = (...args) =>
    args.length >= fn.length ?
    fn(...args) :
    (...newArgs) => _curry(...args, ...newArgs)
```

原理是利用闭包把传入参数保存起来，当传入参数的数量足够执行函数时，就开始执行函数

## 发布订阅EventEmitter

``` js
class EventEmitter {
    #
    subs = {}
    emit(event, ...args) {
        if (this.#subs[event] && this.#subs[event].length) {
            this.#subs[event].forEach(cb => cb(...args))
        }
    }
    on(event, cb) {
        (this.#subs[event] || (this.#subs[event] = [])).push(cb)
    }
    off(event, offCb) {
        if (offCb) {
            if (this.#subs[event] && this.#subs[event].length)
                this.#subs[event] = this.#subs[event].filter(cb => cb !== offCb)
        } else {
            this.#subs[event] = []
        }
    }
}
```

`subs` 是 `EventEmitter` 私有属性(最新特性参考阮一峰老师的[ECMAScript 6 入门](http://es6.ruanyifeng.com/#docs/class))，通过 `on` 注册事件， `off` 注销事件， `emit` 触发事件

## 寄生组合继承

``` js
  function Super(foo) {
      this.foo = foo
  }
  Super.prototype.printFoo = function() {
      console.log(this.foo)
  }

  function Sub(bar) {
      this.bar = bar
      Super.call(this)
  }
  Sub.prototype = Object.create(Super.prototype)
  Sub.prototype.constructor = Sub
```

## ES6版继承

``` js
  class Super {
      constructor(foo) {
          this.foo = foo
      }
      printFoo() {
          console.log(this.foo)
      }
  }
  class Sub extends Super {
      constructor(foo, bar) {
          super(foo)
          this.bar = bar
      }
  }

  ES5 `的继承，实质是先创造子类的实例对象，然后将再将父类的方法添加到` 
  this `上。 ` 
  ES6 `的继承，先创造父类的实例对象（所以必须先调用` 
  super `方法，然后再用子类的构造函数修改` 
  this
```

参考

[js基础-面试官想知道你有多理解call, apply, bind？](https://juejin.im/post/5d469e0851882544b85c32ef)

[【进阶 6-2 期】深入高阶函数应用之柯里化](https://juejin.im/post/5ce288eee51d454f72302450)

[JavaScript专题之跟着 underscore 学节流 ](https://juejin.im/post/5947312a61ff4b006cf66be9)

[如何写出一个惊艳面试官的深拷贝?](https://juejin.im/post/5d6aa4f96fb9a06b112ad5b1#heading-13)

[头条面试官：你知道如何实现高性能版本的深拷贝嘛？](https://juejin.im/post/5df7175fe51d45582512962c)

作者：非常记得你
链接：https://juejin.im/post/5e24590ef265da3e152d27bc
来源：掘金
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。

