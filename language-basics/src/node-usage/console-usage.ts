// Node.js 中的 console 是一个全局对象，无需 import/require
// 但它在 TypeScript 中依赖 @types/node 提供类型定义
// 安装方式: npm install --save-dev @types/node
// 在 tsconfig.json 中确保包含 "types": ["node"] 来启用 Node.js 类型定义
// 生产环境中应避免使用 console.log，建议使用专业日志库（如 winston, pino）

// 1. 基础输出方法（最常用）
console.log('普通日志信息');               // 标准输出
console.info('提示性信息');                // 同 log，部分环境有特殊样式
console.warn('警告信息');                 // 输出到 stderr，通常显示为黄色
console.error('错误信息');                // 输出到 stderr，通常显示为红色

// 2. 格式化输出（类似 C 语言的 printf）
// %s - 字符串, %d - 数字, %j - JSON, %o/%O - 对象
console.log('姓名: %s, 年龄: %d', 'Alice', 30);
console.log('用户数据: %j', { name: 'Bob', active: true });

// 3. 断言（仅当条件为 false 时输出错误）
// 常用于调试或开发阶段的简单校验
console.assert(2 + 2 === 4, '数学出错了！');        // 不输出
console.assert(2 + 2 === 5, '2+2 应该等于 4');     // 输出错误信息

// 4. 计数器（用于统计某段代码执行次数）
console.count('函数调用');   // 输出: 函数调用: 1
console.count('函数调用');   // 输出: 函数调用: 2
console.countReset('函数调用'); // 重置计数器
console.count('函数调用');   // 输出: 函数调用: 1

// 5. 分组输出（折叠/展开日志，便于组织）
console.group('用户信息');
console.log('ID: 123');
console.log('角色: admin');
console.groupEnd(); // 结束当前分组

// 嵌套分组
console.group('系统状态');
console.group('内存');
console.log('使用率: 65%');
console.groupEnd();
console.group('CPU');
console.log('负载: 30%');
console.groupEnd();
console.groupEnd();

// 6. 清屏（在支持的终端中清空控制台）
// 注意：在某些 IDE 或非交互式终端中可能无效
// console.clear();

// 7. 打印对象结构（比 log 更适合查看复杂对象）
const user = {
  id: 1,
  profile: {
    name: 'Charlie',
    settings: { theme: 'dark', lang: 'zh' }
  }
};
console.dir(user, { depth: 2, colors: true }); // depth 控制嵌套深度，colors 启用彩色输出

// 8. 时间测量（性能分析）
console.time('数据处理耗时');
// 模拟耗时操作
for (let i = 0; i < 1e6; i++) {
  Math.sqrt(i);
}
console.timeEnd('数据处理耗时'); // 输出: 数据处理耗时: xxms

// 9. 追踪调用栈（用于定位函数被谁调用）
function debugFunction() {
  console.trace('这里是 debugFunction 被调用的位置');
}
debugFunction();

export {}; // 使文件成为 ES 模块（避免全局作用域冲突）