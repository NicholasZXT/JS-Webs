// Node.js events 模块实现了经典的“发布-订阅”（观察者）模式
// 核心类：EventEmitter
// 适用于解耦模块、实现异步通知、构建可扩展架构

import { EventEmitter, once } from 'node:events';

// ======================
// 1. 基础用法：监听与触发事件
// ======================
const emitter = new EventEmitter();

// 监听 'greet' 事件
emitter.on('greet', (name: string) => {
  console.log(`👋 Hello, ${name}!`);
});

// 触发事件
emitter.emit('greet', 'Alice'); // 👋 Hello, Alice!

// ======================
// 2. 一次性监听（once）
// ======================
emitter.once('farewell', (name: string) => {
  console.log(`👋 Goodbye, ${name}! (仅触发一次)`);
});

emitter.emit('farewell', 'Bob');   // 👋 Goodbye, Bob! (仅触发一次)
emitter.emit('farewell', 'Charlie'); // 无输出（已移除）

// ======================
// 3. 异步等待事件（util.once + async/await）
// ======================
async function waitForEvent() {
  console.log('⏳ 等待 "ready" 事件...');
  
  // once 返回 Promise，在事件触发时 resolve
  const [timestamp] = await once(emitter, 'ready');
  console.log('✅ 收到 ready 事件，时间戳:', timestamp);
}

// 在 1 秒后触发事件
setTimeout(() => {
  emitter.emit('ready', Date.now());
}, 1000);

// ======================
// 4. 自定义类继承 EventEmitter
// ======================
class Database extends EventEmitter {
  connected = false;

  async connect() {
    // 模拟连接延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    this.connected = true;
    
    // 触发自定义事件
    this.emit('connect', { host: 'localhost', time: Date.now() });
    this.emit('status', 'connected');
  }

  query(sql: string) {
    if (!this.connected) {
      // 触发 error 事件（特殊事件，需监听否则崩溃）
      this.emit('error', new Error('数据库未连接'));
      return;
    }
    console.log('🔍 执行 SQL:', sql);
    this.emit('query', sql);
  }
}

// 使用自定义类
const db = new Database();

// 监听自定义事件
db.on('connect', (info) => {
  console.log('🔌 数据库已连接:', info);
});

db.on('query', (sql) => {
  console.log('📊 查询已记录:', sql);
});

// 监听 error 事件（必须！）
db.on('error', (err) => {
  console.error('💥 数据库错误:', err.message);
});

// 测试流程
async function testDatabase() {
  await db.connect();
  db.query('SELECT * FROM users');
  
  // 故意触发错误
  const fakeDb = new Database();
  fakeDb.query('SELECT 1'); // 会触发 error 事件
}

// ======================
// 5. 事件管理：移除监听器、获取监听器数量等
// ======================
function eventManagementDemo() {
  const emitter2 = new EventEmitter();

  const listener1 = () => console.log('Listener 1');
  const listener2 = () => console.log('Listener 2');

  emitter2.on('test', listener1);
  emitter2.on('test', listener2);

  console.log('📌 "test" 事件监听器数量:', emitter2.listenerCount('test')); // 2

  // 移除特定监听器
  emitter2.off('test', listener1);
  console.log('📌 移除 listener1 后数量:', emitter2.listenerCount('test')); // 1

  // 移除所有监听器
  emitter2.removeAllListeners('test');
  console.log('📌 全部移除后数量:', emitter2.listenerCount('test')); // 0
}

// ======================
// 主执行流程
// ======================
async function main() {
  console.log('=== Node.js events 模块示例 ===\n');

  // 基础示例已在顶部执行
  eventManagementDemo();
  await testDatabase();
  await waitForEvent(); // 等待前面设置的 ready 事件
}

main().catch(console.error);

export {}; // 使文件成为模块