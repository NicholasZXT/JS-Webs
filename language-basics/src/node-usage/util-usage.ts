// Node.js util 模块提供多种开发辅助工具
// 包括：异步函数转换、类型判断、对象检查、格式化等
// 安装 @types/node 获取类型支持：
// npm install --save-dev @types/node

import * as util from 'node:util';

// ======================
// 1. util.promisify() —— 回调函数转 Promise（现代化异步代码）
// ======================
import * as fs from 'node:fs';

// 将 fs.readFile（回调风格）转换为 Promise 风格
const readFileAsync = util.promisify(fs.readFile);
async function readWithPromisify() {
  try {
    const data = await readFileAsync('./package.json', 'utf8');
    console.log('✅ promisify 读取成功，name:', JSON.parse(data).name);
  } catch (err) {
    console.error('❌ 读取失败:', err);
  }
}

// ======================
// 2. util.callbackify() —— Promise 函数转回调风格（兼容旧 API）
// ======================
async function asyncFunc(name: string): Promise<string> {
  return `Hello, ${name}!`;
}

const callbackFunc = util.callbackify(asyncFunc);
callbackFunc('Alice', (err, result) => {
  if (err) return console.error('❌ callbackify 错误:', err);
  console.log('✅ callbackify 结果:', result);
});

// ======================
// 3. util.types —— 精确类型检查（比 typeof 更强大）
// ======================
console.log('\n--- util.types 类型检查 ---');
console.log('isDate:', util.types.isDate(new Date()));           // true
console.log('isRegExp:', util.types.isRegExp(/abc/));            // true
console.log('isNativeError:', util.types.isNativeError(new Error())); // true
console.log('isPromise:', util.types.isPromise(Promise.resolve())); // true
console.log('isArrayBuffer:', util.types.isArrayBuffer(new ArrayBuffer(8))); // true

// ======================
// 4. util.inspect() —— 对象深度格式化输出（调试神器）
// ======================
const complexObj = {
  name: 'Bob',
  meta: { id: 1, tags: ['dev', 'node'] },
  func: () => {},
  circular: null as any
};
complexObj.circular = complexObj; // 创建循环引用

console.log('\n--- util.inspect 调试输出 ---');
console.log(util.inspect(complexObj, {
  depth: 2,        // 展开层级
  colors: true,    // 启用颜色（终端支持时）
  showHidden: false,
  compact: false   // 每行一个属性，更清晰
}));

// ======================
// 5. util.format() —— 类 printf 的字符串格式化
// ======================
console.log('\n--- util.format 格式化 ---');
console.log(util.format('Name: %s, Age: %d, Active: %j', 'Charlie', 28, { yes: true }));
// %s=string, %d=number, %j=JSON

// ======================
// 6. util.isDeepStrictEqual() —— 深度严格相等比较
// ======================
console.log('\n--- 深度比较 ---');
const obj1 = { a: 1, b: { c: 2 } };
const obj2 = { a: 1, b: { c: 2 } };
const obj3 = { a: 1, b: { c: 3 } };

console.log('obj1 === obj2:', obj1 === obj2); // false（引用不同）
console.log('isDeepStrictEqual(obj1, obj2):', util.isDeepStrictEqual(obj1, obj2)); // true
console.log('isDeepStrictEqual(obj1, obj3):', util.isDeepStrictEqual(obj1, obj3)); // false

// ======================
// 7. util.deprecate() —— 标记废弃函数（打印警告）
// ======================
const oldApi = util.deprecate(
  (x: number, y: number) => x + y,
  'oldApi() is deprecated. Use newApi() instead.'
);

// 取消注释以查看废弃警告（仅首次调用时打印）
// console.log('旧 API 结果:', oldApi(1, 2));

// ======================
// 主执行流程
// ======================
async function main() {
  console.log('=== Node.js util 模块示例 ===\n');

  await readWithPromisify();
  // callbackify 示例已在上面定义并调用

  // 其他同步示例已直接执行
}

main().catch(console.error);

export {}; // 使文件成为模块