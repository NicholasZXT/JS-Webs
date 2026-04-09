// Node.js http 模块用于：
// - 创建 HTTP 服务器（接收请求）
// - 发起 HTTP 客户端请求（发送请求）
// 注意：现代开发中常使用 Express/Koa 等框架简化服务端开发，
// 但理解原生 http 模块对掌握底层原理至关重要

import * as http from 'node:http';
import * as url from 'node:url';
import { IncomingMessage, ServerResponse } from 'node:http';

// ======================
// 第一部分：创建 HTTP 服务器
// ======================
const PORT = 3000;

// 创建服务器实例
const server = http.createServer((req: IncomingMessage, res: ServerResponse) => {
  // 设置响应头（避免中文乱码）
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  // 解析 URL 和查询参数
  const parsedUrl = url.parse(req.url || '/', true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  console.log(`📥 收到 ${req.method} 请求: ${pathname}`);

  // 路由处理
  if (pathname === '/') {
    res.statusCode = 200;
    res.end(JSON.stringify({ message: '欢迎使用原生 Node.js HTTP 服务器！' }));
  } else if (pathname === '/user') {
    // 模拟返回用户信息
    const user = {
      id: query.id || 'unknown',
      name: 'Alice',
      timestamp: new Date().toISOString()
    };
    res.statusCode = 200;
    res.end(JSON.stringify(user));
  } else if (pathname === '/echo' && req.method === 'POST') {
    // 处理 POST 请求体
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        res.statusCode = 200;
        res.end(JSON.stringify({ echoed: data }));
      } catch (e) {
        res.statusCode = 400;
        res.end(JSON.stringify({ error: '无效的 JSON 格式' }));
      }
    });
  } else {
    // 404 Not Found
    res.statusCode = 404;
    res.end(JSON.stringify({ error: '页面未找到' }));
  }
});

// 监听端口
server.listen(PORT, () => {
  console.log(`🚀 HTTP 服务器已启动: http://localhost:${PORT}`);
});

// 错误处理
server.on('error', (err: Error) => {
  console.error('❌ 服务器错误:', err);
});

// ======================
// 第二部分：发起 HTTP 客户端请求
// ======================
async function makeHttpRequest() {
  console.log('\n--- 发起 HTTP 客户端请求 ---');

  const options: http.RequestOptions = {
    hostname: 'jsonplaceholder.typicode.com',
    port: 80,
    path: '/posts/1',
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  };

  const req = http.request(options, (res: IncomingMessage) => {
    let data = '';

    // 接收数据块
    res.on('data', chunk => {
      data += chunk;
    });

    // 请求完成
    res.on('end', () => {
      console.log('✅ 收到响应状态码:', res.statusCode);
      try {
        const json = JSON.parse(data);
        console.log('📄 响应内容 (前100字符):', JSON.stringify(json).substring(0, 100) + '...');
      } catch (e) {
        console.error('❌ 解析响应失败:', e);
      }
    });
  });

  req.on('error', (e: Error) => {
    console.error('💥 请求出错:', e);
  });

  req.end(); // 发送请求
}

// ======================
// 第三部分：实用工具函数（简化请求）
// ======================
function httpGetJson(url: string): Promise<any> {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(new Error('JSON 解析失败'));
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}`));
        }
      });
    }).on('error', reject);
  });
}

// 使用简化版 GET
async function useHttpGetJson() {
  try {
    const post = await httpGetJson('http://jsonplaceholder.typicode.com/posts/2');
    console.log('\n✨ 使用 httpGetJson 获取文章标题:', post.title);
  } catch (err) {
    console.error('❌ httpGetJson 失败:', err);
  }
}

// ======================
// 主执行流程
// ======================
async function main() {
  // 启动客户端请求示例（不影响服务器运行）
  setTimeout(() => {
    makeHttpRequest();
    useHttpGetJson();
  }, 1000); // 稍等服务器启动
}

main().catch(console.error);

// 优雅关闭（可选）
process.on('SIGINT', () => {
  console.log('\n🛑 正在关闭服务器...');
  server.close(() => {
    console.log('👋 服务器已关闭');
    process.exit(0);
  });
});

export {}; // 使文件成为模块