/**
 * Promise 综合使用示例
 * 
 * 演示 JavaScript/TypeScript 中 Promise 的核心用法：
 * 1. 创建 Promise
 * 2. 基本调用 (.then / .catch)
 * 3. 链式调用
 * 4. 错误处理
 * 5. 并行处理 (all, race, allSettled)
 * 6. 与 async/await 结合
 */

// ==========================================
// 1. 模拟异步任务 (创建 Promise)
// ==========================================
console.log("\n--- 1. 模拟异步任务Promise创建 ---");
/**
 * 模拟一个成功的异步操作
 * @param value 返回的值
 * @param delay 延迟时间 (ms)
 */
const mockSuccessTask = (value: string, delay: number): Promise<string> => {
    /**
    Promise 构造函数接受一个 executor 函数，所有的异步逻辑都在这个函数内部启动.
    executor 函数会立即执行，但它内部的异步操作（如 setTimeout）不会阻塞主线程。
    executor 函数的参数名称约定为 resolve 和 reject，虽然可以使用任何名称，但不推荐。
    这两个参数是由 JavaScript 引擎提供的回调函数，用于控制 Promise 的状态。
    resolve(value): 当 Promise 成功时调用
      - 它接受一个参数 value，用于将成功的结果（value）传递给下一个 .then 处理；
      - 将 Promise 的状态从 pending（待定）变为 fulfilled（已兑现）。
    reject(error): 当 Promise 失败时调用
      - 它接受一个参数 error（通常是Error对象），用于将错误信息传递给下一个 .catch 处理；
      - 将 Promise 的状态从 pending（待定）变为 rejected（已拒绝）。
    executor的返回值会被忽略，Promise 的状态只能通过调用 resolve 或 reject 来改变。
    如果 executor 内部抛出异常（throw），Promise 会自动调用 reject，并将异常作为拒绝的原因。
     */
    return new Promise((resolve, reject) => {
        console.log(`[任务开始] ${value} (等待 ${delay}ms)...`);
        setTimeout(() => {
            // 模拟成功
            resolve(value);
        }, delay);
    });
};

/**
 * 模拟一个可能失败的异步操作
 */
const mockRandomTask = (shouldSucceed: boolean): Promise<string> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (shouldSucceed) {
                resolve("操作成功");
            } else {
                reject(new Error("操作失败：网络波动"));
            }
        }, 1000);
    });
};

// ==========================================
// 2. 基本调用与链式调用
// ==========================================
const basicUsage = () => {
    console.log("\n--- 2. 基本调用与链式调用 ---");

    mockSuccessTask("第一步", 1000)
        .then((data) => {
            // 处理第一步的结果
            console.log(`[Then 1] 收到: ${data}`);
            // 关键点：return 一个值或新的 Promise，才能传递给下一个 .then
            return mockSuccessTask("第二步", 1000);
        })
        .then((nextData) => {
            // 处理第二步的结果
            console.log(`[Then 2] 收到: ${nextData}`);
            return "最终结果";
        })
        .then((final) => {
            console.log(`[Then 3] 最终: ${final}`);
        });
};

// ==========================================
// 3. 错误处理
// ==========================================
const errorHandling = () => {
    console.log("\n--- 3. 错误处理 ---");

    mockRandomTask(false) // 传入 false 模拟失败
        .then((data) => {
            console.log("这行不会执行");
            return data;
        })
        .catch((error) => {
            // 捕获上面任何一步发生的错误（包括 reject 和代码异常）
            console.error("[Catch] 捕获到错误:", error.message);
            // 可以在这里返回一个默认值，让流程继续（“错误恢复”）
            return "默认值";
        })
        .then((val) => {
            console.log(`[Then] 错误恢复后的值: ${val}`);
        })
        .finally(() => {
            // 无论成功还是失败，最后都会执行
            // 常用于清理资源，如关闭加载动画
            console.log("[Finally] 流程结束");
        });
};

// ==========================================
// 4. 并行处理 (Static Methods)
// ==========================================
const parallelProcessing = async () => {
    console.log("\n--- 4. 并行处理 ---");

    const p1: Promise<string> = mockSuccessTask("任务 A", 1000);
    const p2: Promise<string> = mockSuccessTask("任务 B", 1500);
    const p3: Promise<string> = mockSuccessTask("任务 C", 800);

    // 4.1 Promise.all: 等待所有任务成功
    // 如果有一个失败，整体立即失败
    try {
        console.log("[All] 等待所有任务完成...");
        const results = await Promise.all([p1, p2, p3]);
        console.log("[All] 全部完成:", results); // ['任务 A', '任务 B', '任务 C']
    } catch (err) {
        console.error("[All] 有任务失败:", err);
    }

    // 4.2 Promise.race: 竞速
    // 谁先改变状态（成功或失败），就采用谁的结果
    try {
        console.log("[Race] 开始竞速...");
        const winner = await Promise.race([p1, p2, p3]);
        console.log(`[Race] 赢家是: ${winner}`); // 应该是 任务 C (800ms)
    } catch (err) {
        console.error("[Race] 竞速失败:", err);
    }

    // 4.3 Promise.allSettled: 等待所有任务结束（不管成功失败）
    // 常用于需要知道每个任务最终状态的场景
    const mixedTasks = [
        mockSuccessTask("成功任务", 1000),
        Promise.reject("失败任务")
    ];
    
    console.log("[AllSettled] 等待混合任务...");
    const statuses = await Promise.allSettled(mixedTasks);
    console.log("[AllSettled] 结果状态:", statuses);
    // 输出格式: [{ status: 'fulfilled', value: ... }, { status: 'rejected', reason: ... }]
};

// ==========================================
// 5. 与 async/await 结合 (推荐模式)
// ==========================================
const asyncAwaitUsage = async () => {
    console.log("\n--- 5. async/await 模式 ---");

    try {
        // 看起来像同步代码，但不会阻塞主线程
        const step1: string = await mockSuccessTask("步骤 1", 1000);
        console.log(`[Async] 完成: ${step1}`);

        const step2: string = await mockSuccessTask("步骤 2", 1000);
        console.log(`[Async] 完成: ${step2}`);

        // 并行处理也可以配合 await
        const [res1, res2] = await Promise.all([
            mockSuccessTask("并行 A", 500),
            mockSuccessTask("并行 B", 500)
        ]);
        console.log(`[Async] 并行结果: ${res1}, ${res2}`);

    } catch (error) {
        // try/catch 可以捕获 await 表达式的 reject
        console.error("[Async] 发生错误:", error);
    }
};

// ==========================================
// 主入口
// ==========================================
const main = () => {
    console.log(">>> 开始 Promise 演示\n");
    
    basicUsage();
    errorHandling();
    
    // 并行处理和 async/await 需要顶层 await 或包装在 async 函数中
    parallelProcessing();
    asyncAwaitUsage();
};

// 执行演示
main();