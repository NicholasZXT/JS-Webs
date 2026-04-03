import express, { type Express, type Request, type Response } from 'express';

const app: Express = express();
const port = 3000;

// Middleware
app.use(express.json());

// Routes
app.get('/', (req: Request, res: Response) => {
  res.json({
    message: '👋 Hello World!',
    description: '欢迎来到 JS-Webs 后端项目',
    framework: 'Node.js + Express',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: '服务器运行正常',
  });
});

// Start server
app.listen(port, () => {
  console.log(`✅ Server running at http://localhost:${port}`);
  console.log(`📚 Try visiting http://localhost:${port}/ or http://localhost:${port}/api/health`);
});
