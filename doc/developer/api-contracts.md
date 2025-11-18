# API & 数据契约

## SQLite 模型

| 表 | 字段 | 说明 |
| --- | --- | --- |
| `users` | `id TEXT PRIMARY KEY` | UUID v4 |
|  | `email TEXT UNIQUE` | 登录邮箱 |
|  | `name TEXT` | 展示姓名 |
|  | `passwordHash TEXT` | `bcrypt` 哈希 |
|  | `role TEXT` | `admin` / `member` |
|  | `createdAt TEXT` | ISO 字符串 |

> `userStore` 会在库初始化时自动插入 `demo@vue.dev`，密码 `123456`，方便验收。

## 鉴权接口

| Method | Path | Payload | 描述 |
| --- | --- | --- | --- |
| `POST /api/auth/register` | `{ email, password, name }` | 首次注册即写入 SQLite；如邮箱已存在且密码匹配，则返回原 token（方便在多终端复用） |
| `POST /api/auth/login` | `{ email, password }` | 校验 bcrypt，返回 `{ token, user }` |
| `GET /api/auth/me` | `Authorization: Bearer <token>` | 读取 JWT 载荷返回安全用户 |

## 用户接口

| Method | Path | 说明 |
| --- | --- | --- |
| `PATCH /api/users/me` | 更新姓名。 |
| `PATCH /api/users/me/password` | 验证旧密码并写入新哈希。 |
| `GET /api/users` | 仅管理员：返回所有 `SafeUser`。 |
| `PATCH /api/users/:id/password` | 管理员重置密码。 |
| `PATCH /api/users/:id` | 管理员更新姓名或角色。 |

## 运行配置

| 变量 | 默认值 | 用途 |
| --- | --- | --- |
| `PORT` | `4000` | 后端端口 |
| `JWT_SECRET` | `demo-secret` | Token 签名 |
| `TOKEN_EXPIRES_IN` | `12h` | Token 生命周期 |
| `ALLOWED_ORIGINS` | `http://localhost:5173` | 多个域名用逗号分隔；可让 API 与任意前端协作 |
| `VITE_API_BASE_URL` | `/api` | 前端 `.env` 配置：本地走 Vite 代理，生产可直接指向 Kubernetes / SLB |

部署到新的运行环境时，只需：

1. 复制 `data/portal.db`（或让应用在首次启动时自动生成）。
2. 设置 `ALLOWED_ORIGINS`/`VITE_API_BASE_URL` 指向新的域名。
3. 运行 `scripts/release-*.sh|ps1` 重新打包即可无缝迁移。
