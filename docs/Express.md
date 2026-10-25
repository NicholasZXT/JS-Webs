
# 实践开源项目推荐

（1）[fless‑lab/node‑ts‑starter](https://github.com/fless-lab/node-ts-starter)

**技术栈**：Express + TypeScript + **Prisma(PostgreSQL)** + Zod + vitest + ESLint/Prettier + dotenv + helmet + Docker 配置。

**优点**

1. **架构现代，分层清晰**：`config/`配置、`middlewares/`中间件、`modules/`按模块组织（controller/service/schema/router）、`lib/`第三方客户端封装，非常贴近 Java 后端 MVC / 模块划分思维。
2. 使用当前主流工具链：Prisma 现代 ORM 替代 TypeORM，Zod 做运行时请求校验（TS 编译类型不能校验 http 入参，这点是 Node 后端重点坑），vitest 做单元 / 集成测试。
3. 内置全局异常中间件、404 处理、安全中间件 helmet、CORS、环境变量强校验、Dockerfile，工程化比较完整。
4. 代码干净，**没有多余业务噪音**，只有 user 模块示例 CRUD，便于阅读学习，适合照着仿写自己的项目。
5. tsconfig 开启严格模式，类型写的比较规范，能学习如何对`Request`做类型扩展（往 req 上挂载登录用户信息）。

**缺点**

1. 只提供基础 JWT 登录，**没有 RBAC 角色权限完整示例**；无 Redis 相关示例。
2. 是模板脚手架，不是业务项目，没有复杂业务场景。
3. 社区 star 数不高，属于个人维护项目，需要自己看 commit 活跃度。

**总结**：推荐看。


（2）[edwinhern/express-typescript-2024](https://github.com/edwinhern/express-typescript)

**技术栈**：Express + TypeScript + Zod 校验 + Winston 日志 + Jest + Docker + OpenAPI (Swagger)

- 亮点：结构非常标准（routes/controllers/services/middlewares）、统一错误处理、全局异常中间件、环境变量管理、请求入参强类型校验、测试用例齐全
- 适合学：TS 在 Node 后端工程化、中间件设计、REST 最佳实践、错误链路处理；Java 开发者很容易对标 MVC 分层思想
- 缺点：没有复杂 RBAC 和多表业务，偏向规范模板，业务逻辑较轻


（3）[express-locallibrary-tutorial](https://github.com/mdn/express-locallibrary-tutorial)

MDN LocalLibrary 配套源码（官方教程配套 Express MVC）。

**技术栈**：Express + Mongoose + 模板引擎

- 亮点：MDN 官方示例，架构干净，图书管理 CRUD、分页、表单校验、用户权限，注释清晰，没有花里胡哨的封装，原汁原味 Express，非常适合吃透路由、中间件、MVC 基础范式MDN Web Do...
- 适合：先巩固原生 Express 的分层，再上 TS 项目


（4）[prisma/prisma-examples](https://github.com/prisma/prisma-examples)

**技术栈**：Express + TS + Prisma（PostgreSQL）

- 亮点：现代 ORM 方案，清晰的 REST 接口、关联查询、分页、JWT 登录，没有厚重脚手架，薄封装，方便看懂 “Node 后端怎么和关系型数据库交互”，和 Java 里 MyBatis/JPA 可以对照理解Prisma
- 适合：如果想避开 Mongoose MongoDB，学习 PostgreSQL + Prisma 的现代后端写法


（5）[w3tecch/express-typescript-boilerplate](https://github.com/w3tecch/express-typescript-boilerplate)

**技术栈**：Express + TS + TypeORM + JWT + Swagger + Jest

- 亮点：成熟、star 多，包含 RBAC 角色权限、数据库迁移、依赖注入风格（对 Java 背景非常友好）、事务处理、统一响应包装
- 适合学：权限系统、ORM、数据库迁移、DI 思想在 JS 后端的实现
- 注意：这个仓库偏脚手架，代码量更大，概念多一点，可以看完上面轻量的再看这个


（6）[nodejsapps/TypeScript‑Node‑Starter](https://github.com/nodejsapps/TypeScript-Node-Starter)

> 此仓库是 **微软原版 microsoft/TypeScript‑Node‑Starter 的复刻 / 升级版本**；微软原版已经归档（不再维护）

**技术栈**：Express + TypeScript、express‑validator、JWT、Passport 登录策略、Mongoose（MongoDB）、dotenv，包含简单前端页面示例（EJS 模板），同时兼顾服务端渲染页面和 API 接口。

**优点**

1. **历史经典**，完整演示：tsconfig 配置、类型声明文件`.d.ts`、vscode 调试配置、环境变量、Passport 多种登录策略、session、登录注册完整流程，文档注释非常多，适合理解早期 TS+Express 的写法。
2. 同时包含传统服务端渲染页面 + REST API 两套写法，你可以对比看 API 模式。
3. 有完整用户注册、本地登录、第三方 OAuth 登录示例，鉴权相关代码非常丰富。

**缺点**

1. 技术栈偏旧：用 express‑validator（老校验库）、Mongoose MongoDB，**没有用 Zod/Prisma 这套现代工具链**；部分写法是几年前的风格。
2. 项目混了 EJS 服务端渲染模板代码，里面很多页面相关逻辑，如果你只想学纯后端 REST API，会有无关代码干扰。
3. 复刻仓库，要看维护者更新频率；原版微软已经归档，不接收新特性更新。
4. 测试覆盖较弱，没有 Docker、统一结构化日志等现代工程化内容。

**总结**：可以作为补充阅读，不建议作为首要学习对象。