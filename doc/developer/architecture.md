# 架构总览

VuePortal 由响应式的 **Vue 3 + Vite** 前端与 **Express + SQLite** 后端组成。此前端保持“玻璃窗口”视觉，新的布局变量确保不同分辨率下的窗口宽度一致；后端统一通过 SQLite 存放账户与运行元数据信息，便于在本地与发布包之间迁移。

## 工作区与窗口系统

- `frontend/src/assets/main.css` 引入 `workspace-window`、`window-grid`、`lab-grid` 等样式，通过 CSS 变量统一窗口宽度、间距与最大宽度，使 1080p～4K 屏幕都能充分利用视口面积。
- 带状态的窗口拆分到 `LabDeviceWall.vue`、`LabInsightPanel.vue` 等组合组件，避免页面级耦合。所有窗口都继承 `glass-panel + workspace-window`，保证一致的圆角、阴影与最小高度。
- `DeviceFrame.vue` 改为使用 `aspect-ratio` 控制外壳比例，配合 `max-width: 100%` 在缩放时自动伸缩，解决移动实验室子窗口挤压或重叠的问题。

## 数据 & API

- `backend/src/storage/database.ts` 初始化 `data/portal.db` SQLite 数据库，并开启 `WAL` 以提高并发读取能力。
- `userStore` 改为标准 SQL 操作，所有账户数据集中在 `users` 表，可直接通过 SQLite 工具导入、备份或迁移。
- `config.allowedOrigins` 允许通过 `ALLOWED_ORIGINS` 环境变量配置 CORS 白名单，前后端通过 `VITE_API_BASE_URL`/`ALLOWED_ORIGINS` 即可无缝切换部署环境。

## 发布 & 可移植性

- 根目录新增 `release.config.json`，描述需要构建的包、输出目录与额外文件。
- `scripts/run-release.mjs` 读取配置执行 `npm install` + `npm run build`，并把 `frontend/dist`、`backend/dist` 等产物复制到 `release/`。
- `scripts/release-win.ps1` 与 `scripts/release-mac.sh` 分别封装 Windows / macOS 命令，团队成员只需运行脚本即可得到可发布的压缩包或容器镜像输入。

## 目录速览

```
doc/
  developer/
    architecture.md      # 本文件，覆盖布局、接口与发布结构
    api-contracts.md     # 约束接口、鉴权及 SQLite 模型
  user/
    getting-started.md   # 面向体验者的部署指引
    release-checklist.md # 发布核查与脚本说明
```

更多运行命令、调试建议仍保存在 `docs/` 目录，可在 `README.md` 的“文档资源”章节中查阅。
