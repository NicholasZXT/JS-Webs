// Node.js 的 querystring 模块用于解析和序列化 URL 查询字符串（如 ?name=alice&age=30）
// 注意：现代开发中更推荐使用 Web 标准的 URLSearchParams（见文末对比）
// 但 querystring 在旧项目或特定场景仍有用

import * as querystring from 'node:querystring';

// ======================
// 1. 序列化对象为查询字符串（stringify）
// ======================
const params = {
  name: 'Alice',
  age: 30,
  hobbies: ['reading', 'coding'],
  active: true
};

// 默认行为：数组会被重复键名表示
const queryString1: string = querystring.stringify(params);
console.log('✅ stringify (默认):', queryString1);
// 输出: name=Alice&age=30&hobbies=reading&hobbies=coding&active=true

// 自定义分隔符和赋值符
const queryString2: string = querystring.stringify(params, ';', ':');
console.log('✅ stringify (自定义):', queryString2);
// 输出: name:Alice;age:30;hobbies:reading;hobbies:coding;active:true

// 数组索引格式（较少用）
const queryString3: string = querystring.stringify(params, '&', '=', { arrayFormat: 'indices' });
console.log('✅ stringify (带索引):', queryString3);
// 输出: name=Alice&age=30&hobbies[0]=reading&hobbies[1]=coding&active=true

// ======================
// 2. 解析查询字符串为对象（parse）
// ======================
const rawQuery = 'name=Bob&age=25&skills=JS&skills=TS&admin=true';

const parsed: querystring.ParsedUrlQuery = querystring.parse(rawQuery);
console.log('🔍 parse 结果:', parsed);
// 输出:
// {
//   name: 'Bob',
//   age: '25',
//   skills: ['JS', 'TS'],
//   admin: 'true'
// }

// 注意：所有值都是字符串！需手动转换类型
const ageAsNumber = Number(parsed.age);
const isAdmin = parsed.admin === 'true';

// 自定义分隔符解析
const customQuery = 'x=1;y=2;z=3';
const parsedCustom = querystring.parse(customQuery, ';', ':');
console.log('🔍 parse (自定义):', parsedCustom); // { x: '1', y: '2', z: '3' }

// ======================
// 3. 编码与解码单个值（escape / unescape）
// ======================
// escape: 对特殊字符编码（类似 encodeURIComponent，但规则略有不同）
const unsafe = 'hello world!@#$%';
const encoded = querystring.escape(unsafe);
console.log('🔒 escape:', encoded); // hello%20world%21%40%23%24%25

const decoded = querystring.unescape(encoded);
console.log('🔓 unescape:', decoded); // hello world!@#$%

// ======================
// ⚠️ 重要提示：现代替代方案 —— URLSearchParams
// ======================
console.log('\n--- 现代推荐方式 (URLSearchParams) ---');

// URLSearchParams 是 Web 标准，Node.js 10+ 原生支持
const searchParams = new URLSearchParams();
searchParams.append('name', 'Charlie');
searchParams.append('tag', 'dev');
searchParams.append('tag', 'nodejs');

console.log('🌐 URLSearchParams toString():', searchParams.toString());
// 输出: name=Charlie&tag=dev&tag=nodejs

// 解析
const sp = new URLSearchParams('a=1&b=2&b=3');
console.log('🌐 URLSearchParams get all b:', sp.getAll('b')); // ['2', '3']
console.log('🌐 URLSearchParams to object:', Object.fromEntries(sp));
// 注意：Object.fromEntries 会覆盖重复键，仅保留最后一个

// ✅ 为什么推荐 URLSearchParams？
// - 符合 Web 标准，浏览器和 Node.js 通用
// - 更安全、更规范的编码（严格遵循 RFC 3986）
// - 支持更多方法（has, delete, forEach 等）

export {}; // 使文件成为模块