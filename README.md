如何优雅地写测试用例？
----------

# [![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][coverage-image]][coverage-url]

## 背景

做好单元测试是保证代码质量的有效手段。这里介绍一种用示例代码转为测试用例的工具。
这样做可以降低写测试用例的学习和使用成本。

## 思路

通常在示例代码中我们会用注释给出一个输出预判。

```js
var a = 1;
var b = 2;
console.log(a === b); // false
```

这样方便复制到控制台编辑运行。

如果写测试用例就会这样：
```js
var a = 1;
var b = 2;
assert.equal(a === b, false);
```

可以看出来：示例代码和测试代码都有一个输出预判！

那么为何不能用示例代码写测试用例呢？也就是做一下简单的转换即可。

只要做简单的约定就能达到，分别是：

* 示例代码块
* 输出预判
* 异步完成
* 异常预判

## 方法

### 定义示例代码块

`jsdoc` 中用 @`example` 标记，例如：

```js
/**
 * @example xx
 * var a = 1;
 * var b = 2;
 * console.log(a === b); // false
 */
```

但这种每行都有 `*` 的代码，复制粘贴后还需要清理一次，所以我倾向于这种:

```js
/**
 * @example xx
  var a = 1;
  var b = 2;
  console.log(a === b); // false
 */
```

为区分运行环境，所以得指定语言，如：

```js
/**
 * @example xx
　```js
  var a = 1;
  var b = 2;
  console.log(a === b); // false
　```
 */
```

## 约定

### 输出预判

![image](https://cloud.githubusercontent.com/assets/536587/15286345/02c42cde-1b8f-11e6-9a01-562418199de4.png)

```js
/**
 * @example 表达式相等预判
　```js
  var a = 1;
  var b = 2;
  console.log(a === b);
  // > false
　```
 */
```

```js
/**
 * @example 表达式结果预判
　```js
  var a = 1;
  var b = 2;
  console.log(a + b);
  // > 3
　```
 */
```

```js
/*
 * @example 表达式类型预判
　```js
  var a = 1;
  console.log(JSON.stringify(a + '1'));
  // > "11"
　```
 */
```

### 批量输出预判

![image](https://cloud.githubusercontent.com/assets/536587/15286346/09169450-1b8f-11e6-8087-a0f8c4489b56.png)

```js
/*
 * @example 批量表达式预判
　```js
  for (var i = 0; i < 5; i++) {
    console.log(i);
  }
  // > 0
  // > 1
  // > 2
  // > 3
  // > 4
　```
 */
```

### 异步完成

![image](https://cloud.githubusercontent.com/assets/536587/15286354/0f2f9710-1b8f-11e6-88d8-37e2a0055d5c.png)

```js
/*
 * @example 异步执行预判
　```js
  var a = 1;
  setTimeout(function () {
    console.log(a);
    // > 2
    // * done
  }, 1000);
  a++;
　```
 */
```

### 异常预判

![image](https://cloud.githubusercontent.com/assets/536587/15286361/13b9ec68-1b8f-11e6-8839-d61ccaefbf23.png)

```js
/*
 * @example 异常执行预判
　```js
  var a = JSON.parse('#error');
  // * throw
　```
*/
```

## 使用方法

### 安装

```bash
$ npm install examplejs -g
```

### 运行

```bash
$ examplejs main.js -o test/main.test.js
```

### Gulp

```js
var examplejs = require('gulp-examplejs');

gulp.task('example-js', function() {
  return gulp.src('src/**.js')
    .pipe(examplejs({
      head: 'head.js'
    }))
    .pipe(gulp.dest('test'));
});
```

## License

MIT © [zswang](http://weibo.com/zswang)

[npm-url]: https://npmjs.org/package/examplejs
[npm-image]: https://badge.fury.io/js/examplejs.svg
[travis-url]: https://travis-ci.org/zswang/examplejs
[travis-image]: https://travis-ci.org/zswang/examplejs.svg?branch=master
[coverage-url]: https://coveralls.io/github/zswang/examplejs?branch=master
[coverage-image]: https://coveralls.io/repos/zswang/examplejs/badge.svg?branch=master&service=github
