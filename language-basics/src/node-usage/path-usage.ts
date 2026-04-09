// Node.js 的 path 模块用于处理和转换文件路径
// 在 TypeScript 中使用需安装 @types/node
// 安装命令: npm install --save-dev @types/node

import * as path from 'node:path'; // 推荐使用 node: 前缀（Node.js 14+）

// 示例基础路径（模拟不同操作系统下的路径）
const unixPath = '/home/user/project/src/index.ts';
const winPath = 'C:\\Users\\user\\project\\src\\index.ts';

// 1. path.basename() - 获取路径的最后一部分（文件名）
console.log('basename (Unix):', path.basename(unixPath));        // 输出: index.ts
console.log('basename (带扩展过滤):', path.basename(unixPath, '.ts')); // 输出: index

// 2. path.dirname() - 获取目录名（路径中除最后一部分外的部分）
console.log('dirname:', path.dirname(unixPath));                // 输出: /home/user/project/src

// 3. path.extname() - 获取文件扩展名
console.log('extname:', path.extname(unixPath));                // 输出: .ts

// 4. path.join() - 拼接路径（自动处理斜杠方向，跨平台安全）
const joined = path.join('src', 'utils', 'helper.ts');
console.log('join:', joined); // Unix: src/utils/helper.ts | Windows: src\\utils\\helper.ts

// 5. path.resolve() - 将路径解析为绝对路径（从右到左处理，直到构建完整路径）
// 类似于 cd 命令
console.log('resolve:', path.resolve('src', 'utils')); 
// 若当前工作目录是 /home/user/project，则输出: /home/user/project/src/utils

// 6. path.normalize() - 规范化路径（处理 . 和 ..）
console.log('normalize:', path.normalize('/home/user/./project/../app/')); // 输出: /home/user/app/

// 7. path.parse() - 将路径解析为对象 { root, dir, base, ext, name }
const parsed: path.ParsedPath = path.parse(unixPath);
console.log('parse result:', parsed);
// 输出:
// {
//   root: '/',
//   dir: '/home/user/project/src',
//   base: 'index.ts',
//   ext: '.ts',
//   name: 'index'
// }

// 8. path.format() - path.parse() 的逆操作，从对象生成路径
const formatted: string = path.format({
  dir: '/home/user/project/src',
  name: 'index',
  ext: '.ts'
});
console.log('format:', formatted); // 输出: /home/user/project/src/index.ts

// 9. path.isAbsolute() - 判断是否为绝对路径
console.log('isAbsolute (Unix):', path.isAbsolute('/home/user')); // true
console.log('isAbsolute (Relative):', path.isAbsolute('./src'));   // false

// 10. path.relative() - 计算从 from 到 to 的相对路径
const from = '/home/user/project/src';
const to = '/home/user/project/dist/app.js';
console.log('relative:', path.relative(from, to)); // 输出: ../dist/app.js

// 11. path.sep - 平台特定的路径分隔符
console.log('路径分隔符:', path.sep); // Unix: / | Windows: \\

// 12. path.delimiter - 平台特定的环境变量分隔符（如 PATH）
console.log('环境变量分隔符:', path.delimiter); // Unix: : | Windows: ;

// 实用技巧：安全地构建配置文件路径
const configPath = path.join(process.cwd(), 'config', 'settings.json');
console.log('配置文件路径:', configPath);

export {}; // 使文件成为模块