/**
 * Axios 使用示例
 * 
 * 注意：2026 年 3 月底 Axios 官方 npm 账户曾遭劫持，
 * 建议锁定安全版本（如 1.6.8），避免使用 1.14.1 / 0.30.4 等恶意版本。
 */

import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// =============================================================================
// 1. 基础 GET 请求
// =============================================================================
/**
 * 基础 GET 请求示例
 * - 使用 params 传递查询参数（推荐方式）
 * - 自动处理 JSON 响应
 */
async function basicGetExample(): Promise<void> {
  try {
    // 方式1：直接在 URL 中拼接参数（不推荐）
    const res1 = await axios.get('/api/user?id=123');
    console.log('User data:', res1.data);

    // 方式2：使用 params 对象（推荐，自动编码）
    const res2 = await axios.get('/api/user', {
      params: {
        id: 123,
        name: 'Alice',
        active: true
      }
    });
    console.log('User with params:', res2.data);
  } catch (error) {
    handleAxiosError(error);
  }
}

// =============================================================================
// 2. POST / PUT / PATCH / DELETE 请求
// =============================================================================
/**
 * 发送不同类型的请求体数据
 */
async function requestMethodsExample(): Promise<void> {
  try {
    // POST - 发送 JSON 数据（默认 Content-Type: application/json）
    const user = { name: 'Bob', age: 30 };
    const postRes = await axios.post('/api/users', user);
    console.log('Created user:', postRes.data);

    // PUT - 更新资源
    await axios.put('/api/users/123', { ...user, age: 31 });

    // PATCH - 部分更新
    await axios.patch('/api/users/123', { age: 32 });

    // DELETE - 删除资源
    await axios.delete('/api/users/123');
  } catch (error) {
    handleAxiosError(error);
  }
}

/**
 * 发送表单数据（application/x-www-form-urlencoded）
 * 需要配合 qs 或 URLSearchParams
 */
async function formUrlencodedExample(): Promise<void> {
  try {
    // 使用 URLSearchParams（浏览器和 Node.js 均支持）
    const params = new URLSearchParams();
    params.append('username', 'admin');
    params.append('password', 'secret');

    const res = await axios.post('/api/login', params, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    console.log('Login response:', res.data);
  } catch (error) {
    handleAxiosError(error);
  }
}

/**
 * 文件上传（multipart/form-data）
 */
async function fileUploadExample(file: File): Promise<void> {
  try {
    const formData = new FormData();
    formData.append('avatar', file);
    formData.append('userId', '123');

    // 注意：不要手动设置 Content-Type！
    // 浏览器会自动设置 boundary
    const res = await axios.post('/api/upload', formData, {
      headers: {
        // 'Content-Type': 'multipart/form-data' // ❌ 不要设置！
      },
      // 可选：显示上传进度
      onUploadProgress: (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total!);
        console.log(`Upload progress: ${percent}%`);
      }
    });
    console.log('Upload success:', res.data);
  } catch (error) {
    handleAxiosError(error);
  }
}

// =============================================================================
// 3. 全局配置与实例创建（工程化推荐）
// =============================================================================
/**
 * 创建 Axios 实例，便于统一管理配置
 */
const apiClient = axios.create({
  baseURL: 'https://api.example.com/v1', // 所有请求的公共前缀
  timeout: 10000,                        // 超时时间（毫秒）
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    // 注意：不要在此处硬编码 token，应在拦截器中动态添加
  }
});

/**
 * 请求拦截器：在请求发送前处理
 * 常用于：添加认证 token、日志记录、修改请求头等
 */
apiClient.interceptors.request.use(
  (config) => {
    // 从 localStorage 获取 token（实际项目中可能来自状态管理）
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('Sending request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error: AxiosError) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

/**
 * 响应拦截器：在收到响应后处理
 * 常用于：统一错误处理、数据格式化、刷新 token 等
 */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // 直接返回 data，简化调用方代码
    return response.data;
  },
  (error: AxiosError) => {
    // 统一错误处理
    if (error.response) {
      // 服务器返回了错误状态码（如 401, 500）
      switch (error.response.status) {
        case 401:
          console.error('Unauthorized! Redirecting to login...');
          // window.location.href = '/login';
          break;
        case 403:
          console.error('Forbidden access');
          break;
        case 500:
          console.error('Server internal error');
          break;
        default:
          console.error('API Error:', error.response.data);
      }
    } else if (error.request) {
      // 请求已发出但未收到响应（网络错误）
      console.error('Network error: No response received');
    } else {
      // 其他错误（如配置错误）
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

/**
 * 使用封装后的实例
 */
async function useApiClient(): Promise<void> {
  try {
    // 由于响应拦截器返回了 response.data，这里直接得到数据
    const users = await apiClient.get('/users'); // ✅ 不需要 .data
    console.log('Users from apiClient:', users);
  } catch (error) {
    // 错误已在拦截器中处理，此处可选择是否再次处理
    console.warn('Handled by interceptor, but caught again:', error);
  }
}

// =============================================================================
// 4. 并发请求
// =============================================================================
/**
 * 同时发送多个请求
 */
async function concurrentRequests(): Promise<void> {
  try {
    // 方法1：使用 Promise.all（推荐）
    const [userRes, postsRes] = await Promise.all([
      axios.get('/api/user/123'),
      axios.get('/api/posts?userId=123')
    ]);
    console.log('User:', userRes.data);
    console.log('Posts:', postsRes.data);

    // 方法2：使用 axios.all + axios.spread（旧方式，已不推荐）
    // const responses = await axios.all([axios.get(...), axios.get(...)]);
    // axios.spread((user, posts) => { ... })(responses);
  } catch (error) {
    handleAxiosError(error);
  }
}

// =============================================================================
// 5. 取消请求（AbortController）
// =============================================================================
/**
 * 使用 AbortController 取消请求（现代标准方式）
 */
async function cancellableRequest(): Promise<void> {
  const controller = new AbortController();

  // 设置 2 秒后取消请求
  setTimeout(() => controller.abort(), 2000);

  try {
    const res = await axios.get('/api/slow-endpoint', {
      signal: controller.signal // 关联信号
    });
    console.log('Request completed:', res.data);
  } catch (error) {
    if (axios.isCancel(error)) {
      console.log('Request was cancelled:', error.message);
    } else {
      handleAxiosError(error);
    }
  }
}

// =============================================================================
// 6. 错误处理工具函数
// =============================================================================
/**
 * 统一的 Axios 错误处理函数
 */
function handleAxiosError(error: unknown): void {
  if (axios.isAxiosError(error)) {
    // 是 AxiosError
    const axiosError = error as AxiosError;
    console.error('Axios Error:', {
      message: axiosError.message,
      status: axiosError.response?.status,
      data: axiosError.response?.data,
      config: axiosError.config
    });
  } else {
    // 非 Axios 错误（如网络中断、JSON 解析失败等）
    console.error('Non-Axios Error:', error);
  }
}

// =============================================================================
// 7. 导出常用 API 函数（实际项目结构）
// =============================================================================
/**
 * 封装具体的业务 API（实际项目中通常放在单独文件）
 */
export const UserAPI = {
  /**
   * 获取用户信息
   */
  getUser: (id: string | number) => apiClient.get(`/users/${id}`),

  /**
   * 创建新用户
   */
  createUser: (userData: { name: string; email: string }) => 
    apiClient.post('/users', userData),

  /**
   * 上传头像
   */
  uploadAvatar: (userId: string, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return apiClient.post(`/users/${userId}/avatar`, formData);
  }
};

// =============================================================================
// 8. 主函数（演示所有功能）
// =============================================================================
/**
 * 主入口函数（仅用于演示，实际项目中不会这样写）
 */
async function main(): Promise<void> {
  console.log('=== Axios TypeScript Usage Examples ===');

  // 基础 GET
  await basicGetExample();

  // 各种请求方法
  await requestMethodsExample();

  // 表单提交
  await formUrlencodedExample();

  // 使用封装的客户端
  await useApiClient();

  // 并发请求
  await concurrentRequests();

  // 可取消请求
  await cancellableRequest();

  console.log('All examples completed!');
}

// 如果直接运行此文件（Node.js 环境）
if (typeof require !== 'undefined' && require.main === module) {
  main().catch(console.error);
}

// 注意：fileUploadExample 和部分浏览器 API 在 Node.js 中不可用