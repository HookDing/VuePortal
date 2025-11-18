# VuePortal

多端门户，提供统一的前后端演示环境：前端基于 Vue 3 + Vite 构建玻璃拟态的多标签控制台，后端为 Express + JWT 的轻量 API 服务，便于验证登录、用户管理与端到端体验。

## 主要特性

- 📊 **仪表盘**：多卡片布局集中展示会话、任务、设备覆盖与通道状态。
- 📱 **移动端实验室**：可视化多设备模拟、双端对比、网络信号与洞察卡片。
- 🔐 **鉴权体系**：Pinia 管理 token，后端提供注册/登录接口与 Swagger 文档。
- 🧩 **模块化代码**：服务、composable、视图分离，方便替换真实数据或拓展新模块。

## 项目结构

```
VuePortal
├── frontend/        # Vue 3 + Vite + Tailwind 控制台
│   ├── src/composables   # 仪表盘 & 移动实验室数据 hook
│   ├── src/services      # HTTP、仪表盘、移动实验室服务
│   └── src/views         # 页面视图及布局
├── backend/         # Express API、JWT 鉴权与 Swagger 文档
│   ├── routes/           # auth/users 路由
│   └── docs/             # OpenAPI 说明
└── docs/            # 开发与使用指南
```

## 快速开始

1. 安装依赖
   ```bash
   cd frontend && npm install
   cd ../backend && npm install
   ```
2. 启动 API 服务
   ```bash
   cd backend
   npm run dev
   ```
3. 启动前端控制台
   ```bash
   cd frontend
   npm run dev
   ```
4. 浏览器访问 `http://localhost:5173`，使用 `frontend/src/constants/demoAccount.ts` 中的体验账号登录，体验多端门户与移动实验室。

## 文档

- [使用与开发指南](docs/GUIDE.md)：包含运行脚本、目录说明与调试建议。
- 后端 Swagger：运行 API 服务后访问 `http://localhost:4000/docs`。

## 贡献

欢迎提交 Issue 或 PR，协同完善多端适配、移动实验室以及更多业务模块。
