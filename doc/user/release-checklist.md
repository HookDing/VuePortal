# 发布核对清单

1. **拉取最新代码**
   ```bash
   git pull
   ```

2. **确认配置**
   - `release.config.json` 中的包路径、输出目录是否符合当前需求；
   - `.env` / `ALLOWED_ORIGINS` 等环境变量是否已经就绪。

3. **运行脚本**
   - Windows： `powershell -ExecutionPolicy Bypass -File scripts/release-win.ps1`
   - macOS： `bash scripts/release-mac.sh`

   可通过参数修改模式：
   ```powershell
   # Windows
   .\scripts\release-win.ps1 -Mode staging
   ```
   ```bash
   # macOS / Linux
   ./scripts/release-mac.sh staging
   ```

4. **检查产物**
   - `release/frontend/`：Vite 构建后的静态资源，可直接上传至 CDN 或容器镜像。
   - `release/backend/`：`dist/`、`package.json`、`package-lock.json`，配合 Node.js 18 运行即可。

5. **可选**：压缩产物或直接交由 CI/CD 流水线上传。

> 脚本内部会自动安装依赖。如在 CI 内执行，可设置 `SKIP_INSTALL=1`（macOS）或传入 `-SkipInstall`（Windows）跳过 `npm install`。
