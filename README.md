# GeoGebra Chat

通过聊天辅助GeoGebra绘图的桌面应用。

## 技术栈迁移

**注意：该项目已从 Electron 迁移到 Tauri！**

- ✅ **前端**：Next.js 15 + React 19 + TypeScript
- ✅ **UI库**：Radix UI + Tailwind CSS
- ✅ **桌面框架**：Tauri 2.0（替代 Electron）
- ✅ **包管理器**：pnpm
- ✅ **AI集成**：Vercel AI SDK

## 开发环境要求

### 前置条件
1. **Node.js**: >= 18
2. **pnpm**: 包管理器
3. **Rust**: Tauri需要（如果未安装，运行 `curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh`）

### macOS 额外要求
```bash
xcode-select --install
```

### Windows 额外要求
```powershell
# 安装 Rust
winget install Rustlang.Rustup

# 安装 Visual Studio Build Tools 或 Visual Studio Community
# 需要包含 "C++ build tools" 和 "Windows 10/11 SDK"

# WebView2 (Windows 11通常已预装)
# 如果没有，请从微软官网下载安装
```

### Linux 额外要求
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf

# Fedora
sudo dnf install webkit2gtk4.0-devel openssl-devel curl wget libappindicator-gtk3-devel librsvg2-devel
```

## 安装和运行

```bash
# 安装依赖
pnpm install

# 开发模式（启动桌面应用）
pnpm tauri:dev

# 仅启动Web开发服务器
pnpm dev

# 构建生产版本
pnpm tauri:build

# 代码检查
pnpm lint
```

## 跨平台构建

### 本地构建
- **当前平台**: `pnpm tauri:build`
- **Windows**: 需要在Windows系统上运行构建命令
- **macOS**: 需要在macOS系统上运行构建命令  
- **Linux**: 需要在Linux系统上运行构建命令

### GitHub Actions自动构建（推荐）
项目配置了GitHub Actions，可以自动为所有平台构建：

1. 推送代码到GitHub
2. GitHub Actions会自动构建Windows、macOS、Linux版本
3. 构建完成后可在Actions页面下载对应平台的安装包

支持的构建产物：
- **Windows**: `.exe` 安装程序 (NSIS) + `.msi` 安装程序
- **macOS**: `.dmg` 文件 (支持Intel和Apple Silicon)
- **Linux**: `.AppImage` 可执行文件 + `.deb` 包

## 主要变化

### Electron → Tauri 迁移优势

1. **更小的包体积**：Tauri应用比Electron应用小得多
2. **更低的内存使用**：使用系统原生WebView
3. **更好的性能**：Rust后端提供更高效的系统集成
4. **更强的安全性**：Tauri内置权限系统

### 脚本变化

| 旧命令 (Electron) | 新命令 (Tauri) |
|-------------------|----------------|
| `pnpm electron:dev` | `pnpm tauri:dev` |
| `pnpm electron:pack` | `pnpm tauri:build` |

### 配置文件变化

- ❌ 移除：`electron/` 目录
- ❌ 移除：`package.json` 中的 `build` 配置
- ✅ 新增：`src-tauri/` 目录和相关配置

## 项目结构

```
├── .github/workflows/     # GitHub Actions CI/CD
├── app/                   # Next.js App Router
├── components/            # React组件
├── hooks/                 # 自定义hooks
├── lib/                   # 工具库
├── public/                # 静态资源
├── src-tauri/            # Tauri Rust后端
│   ├── src/              # Rust源码
│   ├── icons/            # 应用图标
│   ├── tauri.conf.json   # Tauri配置
│   └── Cargo.toml        # Rust依赖
├── styles/               # 样式文件
├── utils/                # 工具函数
├── next.config.ts        # Next.js配置
├── package.json          # 项目配置
└── tailwind.config.ts    # Tailwind配置
```

## 功能特性

- 🚀 现代化的桌面应用框架（Tauri）
- 🎨 现代化UI设计（Radix UI + Tailwind CSS）
- 🤖 AI辅助绘图功能（集成AI SDK）
- 📱 响应式设计
- 🎯 TypeScript类型安全
- 🌍 跨平台支持（Windows、macOS、Linux）

## 开发指南

### 添加新的Tauri命令

1. 在 `src-tauri/src/main.rs` 中定义Rust函数
2. 在前端使用 `@tauri-apps/api` 调用

### 调试

- **前端调试**：在浏览器开发者工具中调试（Web版）
- **桌面应用调试**：Tauri开发模式会自动打开开发者工具
- **Rust后端调试**：使用 `println!` 或日志库

## 构建和分发

```bash
# 构建当前平台
pnpm tauri:build

# 构建结果位置
# Windows: src-tauri/target/release/bundle/nsis/ (.exe)
#          src-tauri/target/release/bundle/msi/ (.msi)
# macOS:   src-tauri/target/release/bundle/macos/ (.app)
#          src-tauri/target/release/bundle/dmg/ (.dmg)
# Linux:   src-tauri/target/release/bundle/appimage/ (.AppImage)
#          src-tauri/target/release/bundle/deb/ (.deb)
```

### 发布流程

1. 更新版本号：`src-tauri/tauri.conf.json` 和 `package.json`
2. 提交并推送代码
3. 创建Git标签：`git tag v0.2.4 && git push origin v0.2.4`
4. GitHub Actions自动构建并创建Release

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

[MIT License](LICENSE)
