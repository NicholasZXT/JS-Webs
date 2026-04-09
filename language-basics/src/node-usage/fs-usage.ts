// Node.js 的 fs 模块用于文件和目录的读写、创建、删除等操作
// 支持同步、异步（回调）、Promise 三种风格
// TypeScript 中需安装 @types/node 获取类型定义：
// npm install --save-dev @types/node

import * as fs from 'node:fs';
import * as fsPromises from 'node:fs/promises'; // Promise 风格 API
import * as path from 'node:path';

// 示例文件路径
const exampleFile = './example.txt';
const exampleDir = './example-dir';

// ======================
// 1. 写入文件（异步 - Promise）
// ======================
async function writeFileExample() {
  try {
    await fsPromises.writeFile(exampleFile, 'Hello, Node.js FS Module!', 'utf8');
    console.log('✅ 文件写入成功');
  } catch (err) {
    console.error('❌ 写入失败:', err);
  }
}

// ======================
// 2. 读取文件（异步 - Promise）
// ======================
async function readFileExample() {
  try {
    const data = await fsPromises.readFile(exampleFile, 'utf8');
    console.log('📄 读取内容:', data);
  } catch (err) {
    console.error('❌ 读取失败:', err);
  }
}

// ======================
// 3. 检查文件/目录是否存在（推荐使用 access 而非 exists）
// ======================
async function checkExists() {
  try {
    await fsPromises.access(exampleFile); // 若无异常，则存在
    console.log('🔍 文件存在');
  } catch {
    console.log('🔍 文件不存在');
  }
}

// ======================
// 4. 创建目录（递归）
// ======================
async function createDir() {
  try {
    await fsPromises.mkdir(exampleDir, { recursive: true });
    console.log('📁 目录创建成功');
  } catch (err) {
    console.error('❌ 创建目录失败:', err);
  }
}

// ======================
// 5. 读取目录内容
// ======================
async function readDir() {
  try {
    const files = await fsPromises.readdir('.', { withFileTypes: true });
    console.log('📂 当前目录内容:');
    files.forEach(file => {
      const type = file.isDirectory() ? '[DIR]' : '[FILE]';
      console.log(`  ${type} ${file.name}`);
    });
  } catch (err) {
    console.error('❌ 读取目录失败:', err);
  }
}

// ======================
// 6. 重命名/移动文件
// ======================
async function renameFile() {
  const newFile = './example-renamed.txt';
  try {
    await fsPromises.rename(exampleFile, newFile);
    console.log('🔄 文件已重命名');
  } catch (err) {
    console.error('❌ 重命名失败:', err);
  }
}

// ======================
// 7. 删除文件
// ======================
async function deleteFile() {
  try {
    await fsPromises.unlink('./example-renamed.txt');
    console.log('🗑️ 文件已删除');
  } catch (err) {
    console.error('❌ 删除失败:', err);
  }
}

// ======================
// 8. 获取文件信息（stat）
// ======================
async function getFileStat() {
  try {
    const stats = await fsPromises.stat('./package.json');
    console.log('📊 文件信息:');
    console.log('  是否文件:', stats.isFile());
    console.log('  是否目录:', stats.isDirectory());
    console.log('  文件大小 (字节):', stats.size);
    console.log('  修改时间:', stats.mtime);
  } catch (err) {
    console.error('❌ 获取文件信息失败:', err);
  }
}

// ======================
// 9. 流式读取大文件（避免内存溢出）
// ======================
function streamReadLargeFile(filePath: string) {
  const readStream = fs.createReadStream(filePath, { encoding: 'utf8' });
  readStream.on('data', (chunk) => {
    console.log('📡 接收到数据块:', chunk.substring(0, 50) + '...');
  });
  readStream.on('end', () => {
    console.log('🏁 文件读取完成');
  });
  readStream.on('error', (err) => {
    console.error('💥 流读取错误:', err);
  });
}

// ======================
// 主执行流程
// ======================
async function main() {
  console.log('=== Node.js fs 模块示例 ===\n');

  await writeFileExample();
  await readFileExample();
  await checkExists();
  await createDir();
  await readDir();
  await renameFile();
  await deleteFile();
  await getFileStat();

  // 如果有大文件，可取消注释以下行测试流式读取
  // streamReadLargeFile('./large-file.log');
}

// 运行主函数
main().catch(console.error);

export {}; // 使文件成为模块