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
├── app/                    # Next.js App Router
├── components/             # React组件
├── hooks/                  # 自定义hooks
├── lib/                    # 工具库
├── public/                 # 静态资源
├── src-tauri/             # Tauri Rust后端
│   ├── src/               # Rust源码
│   ├── icons/             # 应用图标
│   ├── tauri.conf.json    # Tauri配置
│   └── Cargo.toml         # Rust依赖
├── styles/                # 样式文件
├── utils/                 # 工具函数
├── next.config.ts         # Next.js配置
├── package.json           # 项目配置
└── tailwind.config.ts     # Tailwind配置
```

## 功能特性

- 🚀 现代化的桌面应用框架（Tauri）
- 🎨 现代化UI设计（Radix UI + Tailwind CSS）
- 🤖 AI辅助绘图功能（集成AI SDK）
- 📱 响应式设计
- 🎯 TypeScript类型安全

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
# 构建所有平台（需要对应平台环境）
pnpm tauri:build

# 构建结果位置
# macOS: src-tauri/target/release/bundle/macos/
# Windows: src-tauri/target/release/bundle/msi/
# Linux: src-tauri/target/release/bundle/appimage/
```

## 贡献

欢迎提交Issue和Pull Request！

## 许可证

[MIT License](LICENSE)
