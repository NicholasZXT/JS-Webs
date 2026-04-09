// Buffer 是 Node.js 用于处理二进制数据的核心模块
// - 表示固定长度的字节序列
// - 全局可用（无需 require/import，但显式导入更清晰）
// - 常用于：文件 I/O、网络传输、加密、图像处理等

import { Buffer } from 'node:buffer';

// ======================
// 1. 创建 Buffer
// ======================
console.log('--- 1. 创建 Buffer ---');

// 从字符串创建（指定编码）
const buf1 = Buffer.from('Hello', 'utf8');
console.log('✅ 字符串 "Hello" -> Buffer:', buf1); // <Buffer 48 65 6c 6c 6f>

// 从数组创建（字节值）
const buf2 = Buffer.from([0x48, 0x65, 0x6c, 0x6c, 0x6f]);
console.log('✅ 字节数组 -> Buffer:', buf2); // <Buffer 48 65 6c 6c 6f>

// 分配指定长度的 Buffer（内容未初始化，含随机数据）
const buf3 = Buffer.alloc(5); // 安全：初始化为 0
console.log('✅ alloc(5):', buf3); // <Buffer 00 00 00 00 00>

const buf4 = Buffer.allocUnsafe(5); // 快速：含随机垃圾数据（需立即填充）
buf4.fill(0xff);
console.log('✅ allocUnsafe(5) + fill(0xff):', buf4); // <Buffer ff ff ff ff ff>

// ======================
// 2. Buffer 与字符串互转（编码支持）
// ======================
console.log('\n--- 2. 编码转换 ---');

const original = '你好 🌍';
const encodings: BufferEncoding[] = ['utf8', 'base64', 'hex'];

encodings.forEach(enc => {
  const buf = Buffer.from(original, enc);
  const restored = buf.toString(enc);
  console.log(`🔤 ${enc}: "${restored}"`);
});

// 特殊：Base64 URL 安全编码（需手动替换）
const base64Url = Buffer.from('Hello+World/=').toString('base64')
  .replace(/\+/g, '-')
  .replace(/\//g, '_')
  .replace(/=/g, '');
console.log('🔤 Base64URL:', base64Url);

// ======================
// 3. 读写二进制数据（整数、浮点数）
// ======================
console.log('\n--- 3. 二进制数据读写 ---');

const buf5 = Buffer.alloc(8);

// 写入 32 位整数（大端序）
buf5.writeInt32BE(0x12345678, 0);
console.log('🔢 writeInt32BE(0x12345678):', buf5.subarray(0, 4)); // <Buffer 12 34 56 78>

// 写入 IEEE 754 双精度浮点数
buf5.writeDoubleLE(Math.PI, 4);
console.log('🔢 writeDoubleLE(π):', buf5.subarray(4, 8));

// 读取验证
console.log('✅ 读取整数:', buf5.readInt32BE(0).toString(16)); // 12345678
console.log('✅ 读取浮点数:', buf5.readDoubleLE(4)); // 3.1415...

// ======================
// 4. Buffer 操作：切片、拷贝、比较
// ======================
console.log('\n--- 4. Buffer 操作 ---');

const source = Buffer.from('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
const slice = source.subarray(10, 15); // 返回新视图（共享内存！）
console.log('✂️ 切片 [10,15):', slice.toString()); // KLMNO

// 安全拷贝（避免内存共享）
const copy = Buffer.from(slice);
copy[0] = 0x21; // 修改拷贝不影响原 Buffer
console.log('📋 拷贝修改后:', copy.toString()); // !LMNO
console.log('🔍 原 Buffer 不变:', source.subarray(10, 15).toString()); // KLMNO

// 比较 Buffer
console.log('⚖️ 比较 "ABC" 和 "ABD":', Buffer.compare(
  Buffer.from('ABC'),
  Buffer.from('ABD')
)); // -1 (小于)

// ======================
// 5. 实用场景：文件读取与 Base64 编码
// ======================
console.log('\n--- 5. 实用场景 ---');

// 模拟读取图片文件（此处用字符串代替）
const fakeImage = Buffer.from('fake-image-content');
const base64Image = fakeImage.toString('base64');
console.log('🖼️ 图片 Base64 前缀:', `data:image/png;base64,${base64Image.substring(0, 20)}...`);

// JSON 序列化 Buffer（需转换）
const objWithBuffer = { data: buf1 };
const json = JSON.stringify(objWithBuffer, (_, value) =>
  value instanceof Buffer ? value.toString('base64') : value
);
console.log('📦 Buffer 转 JSON:', json);

// 从 JSON 恢复 Buffer
const restoredObj = JSON.parse(json, (_, value) =>
  typeof value === 'string' && value.length > 0 ? Buffer.from(value, 'base64') : value
);
console.log('🔄 恢复 Buffer:', restoredObj.data.equals(buf1)); // true

// ======================
// 6. 安全提示：避免常见陷阱
// ======================
console.log('\n--- 6. 安全提示 ---');

// ❌ 危险：allocUnsafe 未初始化
const dangerous = Buffer.allocUnsafe(4);
console.log('⚠️ 未初始化 Buffer（可能含敏感数据）:', dangerous);

// ✅ 正确：始终初始化
const safe = Buffer.alloc(4, 0);
console.log('✅ 安全初始化 Buffer:', safe);

// ❌ 避免：直接修改共享内存
const shared = Buffer.from('HELLO');
const view = shared.subarray(1, 4);
// view[0] = 0x21; // 会意外修改原 Buffer！

export {}; // 使文件成为模块