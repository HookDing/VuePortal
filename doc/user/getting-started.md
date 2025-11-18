# 用户快速上手

## 环境要求

- Node.js ≥ 18（包含 npm）
- SQLite 3（可选，用于查看 `data/portal.db`）
- 现代浏览器（Chrome、Edge、Safari 最新版）

## 安装与运行

```bash
# 安装依赖
cd frontend && npm install
cd ../backend && npm install

# 启动 API（默认 http://localhost:4000）
npm run dev

# 启动前端（默认 http://localhost:5173）
cd ../frontend
npm run dev
```

> 登录体验账号位于 `frontend/src/constants/demoAccount.ts`，也可直接在登录页注册新用户。

## 布局体验建议

- 浏览器宽度 ≥ 1440px 可同时展示“导航 + 工作区 + 侧边洞察”，更高分辨率下窗口会自动增宽。
- 移动实验室：
  - “单端聚焦”模式下 DeviceFrame 会自动充满列宽；
  - “双端比对”模式会根据列宽自动缩放，无需担心右侧洞察卡片被挤压。

## 环境切换

- **前端**：复制 `frontend/.env.example` 为 `.env`，根据部署地址调整 `VITE_API_BASE_URL`。
- **后端**：设置 `ALLOWED_ORIGINS`（多个域名逗号分隔），即可允许移动端或其他 Web 容器直接调试。
