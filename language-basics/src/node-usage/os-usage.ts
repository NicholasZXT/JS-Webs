// Node.js 的 os 模块提供操作系统相关的实用方法
// 如获取 CPU、内存、网络、用户信息等
// 使用前需安装 @types/node 以获得类型支持：
// npm install --save-dev @types/node

import * as os from 'node:os';

// 1. 获取操作系统基本信息
console.log('操作系统平台:', os.platform());       // 如 'win32', 'linux', 'darwin'
console.log('操作系统架构:', os.arch());           // 如 'x64', 'arm64'
console.log('操作系统版本:', os.version());        // 内核版本（Linux/macOS）或 Windows 版本
console.log('主机名:', os.hostname());

// 2. 获取 CPU 信息
const cpus = os.cpus();
console.log(`CPU 核心数: ${cpus.length}`);
console.log('首个 CPU 型号:', cpus[0]?.model);
console.log('CPU 速度 (MHz):', cpus[0]?.speed);

// 3. 获取内存信息（单位：字节）
const totalMem = os.totalmem();     // 总内存
const freeMem = os.freemem();       // 空闲内存
const usedMem = totalMem - freeMem;
console.log(`总内存: ${(totalMem / 1024 ** 3).toFixed(2)} GB`);
console.log(`已用内存: ${(usedMem / 1024 ** 3).toFixed(2)} GB`);
console.log(`空闲内存: ${(freeMem / 1024 ** 3).toFixed(2)} GB`);

// 4. 获取系统正常运行时间（秒）
console.log('系统已运行 (秒):', os.uptime());
console.log('系统已运行 (天):', Math.floor(os.uptime() / (60 * 60 * 24)));

// 5. 获取用户信息
const userInfo = os.userInfo();
console.log('当前用户:', userInfo.username);
console.log('用户主目录:', userInfo.homedir); // 等价于 os.homedir()

// 6. 获取临时目录路径
console.log('临时目录:', os.tmpdir());

// 7. 获取网络接口信息
const networkInterfaces = os.networkInterfaces();
console.log('\n网络接口:');
for (const [name, nets] of Object.entries(networkInterfaces)) {
  if (!nets) continue;
  console.log(`  ${name}:`);
  for (const net of nets) {
    const family = net.family === 'IPv4' ? 'v4' : 'v6';
    console.log(`    ${family}: ${net.address} (${net.internal ? '内网' : '外网'})`);
  }
}

// 8. 获取行尾符（不同系统不同）
// Windows: \r\n, Unix/Linux/macOS: \n
console.log('行尾符 (转义显示):', JSON.stringify(os.EOL));

// 9. 获取系统常量（如信号、错误码等）
console.log('信号列表:', os.constants.signals);   // 如 SIGINT, SIGTERM
console.log('错误码:', os.constants.errno);        // 如 EACCES, ENOENT

// 实用场景示例：生成唯一临时文件名
const tempFilePath = path.join(os.tmpdir(), `app-${Date.now()}.tmp`);
console.log('建议的临时文件路径:', tempFilePath);

// 注意：path 模块需单独导入
import * as path from 'node:path';

export {}; // 使文件成为模块