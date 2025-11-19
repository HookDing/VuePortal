# VuePortal 使用与开发指南

## 快速使用

1. 安装依赖
   - 前端：`cd frontend && npm install`
   - 后端：`cd backend && npm install`
2. 启动后端 API 服务：
   ```bash
   cd backend
   npm run dev
   ```
   默认监听 `http://localhost:4000`，内置 Swagger 文档 `http://localhost:4000/docs`。
3. 启动前端控制台：
   ```bash
   cd frontend
   npm run dev -- --host 0.0.0.0 --port 5173
   ```
4. 浏览器访问 `http://localhost:5173`，使用 `src/constants/demoAccount.ts` 中的体验账号登录。

## 开发说明

- **代码结构**
  - `frontend/src/composables`：封装仪表盘与移动实验室的数据获取逻辑，视图层通过 hook 解耦展示与数据来源。
  - `frontend/src/services`：集中管理 API/模拟数据；未来可直接替换为真实接口。
  - `backend/src`：Express + JWT 鉴权，`routes` 目录暴露 auth/users 接口，`docs/openapi.ts` 提供 API 描述。
- **样式系统**：使用 Tailwind +玻璃拟态基础样式，新增统计卡片、断点监控等组件时复用 `glass-panel` 容器与 `brand-gradient` 渐变。
- **运行脚本**
  - 前端：`npm run dev`、`npm run build`、`npm run lint`
  - 后端：`npm run dev`（热更新）、`npm run build`（tsc 编译）、`npm start`
- **数据扩展**
  - 仪表盘：在 `services/dashboard.ts` 中补充指标后即可在 `DashboardView` 中自动展示。
  - 移动实验室：在 `services/mobileLab.ts` 添加新设备/洞察，`MobileLabView` 会自动生成对应卡片与模拟器。
- **环境变量**：通过 `frontend/src/config/env.ts` 与 `backend/src/config.ts` 管理后端 Base URL、端口及密钥。

## 调试建议

- 同时运行前后端时可借助浏览器 DevTools 的设备模式，与移动实验室模拟结果互相验证。
- 若需要固定默认标签，可在 Tab 工具栏右键“设为默认打开”，`stores/tabs.ts` 会持久化到 localStorage。
- 使用 `backend/data/users.json` 可快速调整演示账号信息。
