# VuePortal

多端门户演示工程：前端基于 **Vue 3 + Vite** 打造可跨分辨率的玻璃窗口式控制台，后端采用 **Express + SQLite**，提供鉴权、用户管理及移动实验室的演示 API。

## 亮点

- 🪟 **一致的窗口体系**：`workspace-window`、`window-grid` 等样式统一了宽度与间距，在 13" 到 4K 屏幕上都能充分利用显示面积。
- 📱 **移动实验室组件化**：`LabDeviceWall` + `LabInsightPanel` 拆分主窗口与洞察区，`DeviceFrame` 基于 `aspect-ratio` 自适应缩放，解决缩放时窗口重叠问题。
- 🧱 **SQLite 集中存储**：`data/portal.db` 自动创建并种子用户，`userStore` 通过标准 SQL CRUD，方便迁移与备份。
- 🔌 **前后端解耦**：`ALLOWED_ORIGINS`/`VITE_API_BASE_URL` 控制跨域与接口地址，任意部署方案都能无缝切换。
- 📦 **一键发布**：`release.config.json` + `scripts/run-release.mjs` 驱动 Windows/macOS 发布脚本，统一构建产物与打包目录。

## 项目结构

```
VuePortal
├── frontend/                # Vue 3 + Vite 客户端
├── backend/                 # Express + SQLite API
├── docs/                    # 原有指南（ GUIDE 等 ）
├── doc/                     # 新增：Developer/User 文档分组
│   ├── developer/
│   └── user/
├── scripts/                 # release-win.ps1 / release-mac.sh / run-release.mjs
└── release.config.json      # 发布配置
```

## 本地运行

```bash
# 1. 安装依赖
cd frontend && npm install
cd ../backend && npm install

# 2. 启动 API
cp .env.example .env    # 可选：自定义 PORT / ALLOWED_ORIGINS
npm run dev

# 3. 启动前端
cd ../frontend
cp .env.example .env    # VITE_API_BASE_URL 默认 http://localhost:4000/api
npm run dev
```

浏览器访问 `http://localhost:5173`，使用 `frontend/src/constants/demoAccount.ts` 中的体验账号快速登录，或直接注册新用户。

## 配置要点

| 位置 | 变量 | 说明 |
| --- | --- | --- |
| `backend/.env` | `PORT` | API 监听端口 |
|  | `JWT_SECRET` / `TOKEN_EXPIRES_IN` | 鉴权相关配置 |
|  | `ALLOWED_ORIGINS` | 逗号分隔的前端白名单，默认 `http://localhost:5173` |
| `frontend/.env` | `VITE_API_BASE_URL` | API 根地址；开发态可为 `/api`，生产部署写完整域名 |

SQLite 数据文件位于 `backend/data/portal.db`，直接复制即可在不同环境间迁移账户数据。

## 发布脚本

1. 确认 `release.config.json` 中的包配置；
2. Windows：
   ```powershell
   .\scripts\release-win.ps1          # -Mode staging -SkipInstall 可选
   ```
3. macOS / Linux：
   ```bash
   bash scripts/release-mac.sh        # SKIP_INSTALL=1 ./scripts/release-mac.sh prod
   ```
4. 成品位于 `release/<package>/`，包含 `dist/` 以及指定的额外文件，可直接交由 CI 上传或压缩。

## 文档资源

- `doc/developer/architecture.md`：布局、SQLite 与发布架构说明。
- `doc/developer/api-contracts.md`：接口、字段与环境变量。
- `doc/user/getting-started.md`：用户/体验方快速上手。
- `doc/user/release-checklist.md`：发布核查及脚本使用。
- `docs/GUIDE.md`：原有的综合指南、调试建议。

## 接口与数据

- 所有用户操作均写入 SQLite `users` 表，`demo@vue.dev / 123456` 会在首次运行时自动注入。
- `ALLOWED_ORIGINS` 支持多域名，让 API 可与任意外部前端协作；前端只需设置 `VITE_API_BASE_URL` 即可接入其他环境的 API。

## 贡献

欢迎提交 Issue / PR，一起扩展移动实验室、仪表盘或更多业务模块。提交前可先运行 `npm run build`（前后端）与发布脚本，确保改动可编译、可交付。
