// Node.js 的 process 是一个全局对象，无需 import/require 即可使用
// 但它在 TypeScript 中需要安装 @types/node 才能获得类型提示：
// npm install --save-dev @types/node
// 在 tsconfig.json 中确保包含 "types": ["node"] 来启用 Node.js 类型定义

// 1. 获取命令行参数（argv）
// process.argv 是一个字符串数组，包含启动 Node.js 进程时的命令行参数
// 索引 0: Node.js 可执行文件路径
// 索引 1: 当前运行的脚本文件路径
// 索引 2+: 用户传入的参数
console.log('命令行参数: ', process.argv);
// 示例运行: node process-example.ts hello world
// 输出: ['.../node', '.../process-example.ts', 'hello', 'world']

// 2. 访问环境变量
// process.env 包含当前系统的环境变量（如 PATH, NODE_ENV 等）
const nodeEnv = process.env.NODE_ENV || 'development';
console.log(`当前环境: ${nodeEnv}`);

// 设置环境变量（仅在当前进程有效）
process.env.MY_CUSTOM_VAR = 'custom_value';

// 3. 监听进程退出事件
// beforeExit: 在事件循环清空且无额外工作时触发（仅在正常退出时）
// exit: 进程即将退出时触发（无法阻止退出，不能使用异步操作）
process.on('beforeExit', (code) => {
  console.log(`进程即将优雅退出，退出码: ${code}`);
});

process.on('exit', (code) => {
  console.log(`进程已退出，退出码: ${code}`);
});

// 4. 监听未捕获的异常（避免进程崩溃）
// 注意：这只是兜底方案，应尽量在代码中主动处理错误
process.on('uncaughtException', (err) => {
  console.error('未捕获的异常:', err);
  // 安全起见，通常在此记录日志后退出
  process.exit(1); // 1 表示非正常退出
});

// 5. 监听未处理的 Promise 拒绝（Node.js >= v15 默认会终止进程）
process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
  console.error('未处理的 Promise 拒绝:', reason);
  // 可选择退出或记录日志
});

// 6. 获取进程基本信息
console.log('进程 ID (PID):', process.pid);
console.log('运行平台:', process.platform); // 如 'win32', 'linux', 'darwin'
console.log('当前工作目录:', process.cwd());

// 7. 主动退出进程
// 注释掉以下行以避免立即退出（仅作示例）
// process.exit(0); // 0 表示正常退出

// 8. 标准输入输出流（常用于 CLI 工具）
// process.stdin  - 可读流（接收输入）
// process.stdout - 可写流（输出到终端）
// process.stderr - 可写流（输出错误信息）
process.stdout.write('这是通过 stdout 写入的消息\n');
process.stderr.write('这是错误信息（通常显示为红色）\n');

// 示例：从标准输入读取一行（需设置编码并监听 data 事件）
// process.stdin.setEncoding('utf8');
// process.stdin.on('data', (chunk) => {
//   console.log('你输入了:', chunk.trim());
//   process.exit(0);
// });
// process.stdin.on('end', () => process.exit(0));
// 取消注释以上代码可实现交互式输入

export {}; // 使文件成为模块（避免全局作用域污染）