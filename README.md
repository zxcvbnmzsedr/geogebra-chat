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

# 查看Tauri环境信息
pnpm tauri info
```

## 跨平台构建

### 🎯 **推荐方案：使用GitHub Actions**

1. **推送代码到GitHub**：
   ```bash
   git add .
   git commit -m "Update to Tauri"
   git push origin main
   ```

2. **发布版本**（触发自动构建）：
   ```bash
   git tag v0.2.5
   git push origin v0.2.5
   ```

3. **GitHub Actions会自动构建**：
   - 🪟 **Windows**: `.exe` 和 `.msi` 安装程序
   - 🍎 **macOS**: `.dmg` 文件（Intel + Apple Silicon）
   - 🐧 **Linux**: `.AppImage` 和 `.deb` 包

### 💻 **本地构建**

#### macOS (当前平台)
```bash
pnpm tauri:build
# 输出: src-tauri/target/release/bundle/dmg/GeoGebra Chat_0.2.4_aarch64.dmg
```

#### Windows (需要Windows机器)
```powershell
# 1. 安装必要工具
winget install Rustlang.Rustup
# 安装 Visual Studio Build Tools

# 2. 克隆项目
git clone <your-repo>
cd geogebra-chat

# 3. 构建
pnpm install
pnpm tauri:build
```

#### Linux
```bash
# 安装依赖
sudo apt install libwebkit2gtk-4.0-dev libappindicator3-dev librsvg2-dev patchelf

# 构建
pnpm tauri:build
```

## 故障排除

### Windows NSIS 配置错误
如果遇到类似错误：
```
Error `tauri.conf.json` error on `bundle > windows > nsis`
```

**解决方案**：已修复配置文件，现在使用简化的NSIS配置：
```json
{
  "windows": {
    "nsis": {
      "installerIcon": "icons/icon.ico",
      "installMode": "perMachine"
    }
  }
}
```

### 构建环境检查
```bash
# 检查环境配置
pnpm tauri info

# 验证Rust安装
rustc --version
cargo --version
```

## 从Electron迁移的优势

| 特性 | Electron | Tauri |
|------|----------|-------|
| 包大小 | ~150MB | ~15MB |
| 内存占用 | ~200MB | ~50MB |
| 启动速度 | 较慢 | 很快 |
| 系统资源 | 高 | 低 |
| 安全性 | 中等 | 高 |
| 跨平台 | ✅ | ✅ |

## 技术架构

```
┌─────────────────┐    ┌─────────────────┐
│   Next.js App   │    │   Tauri Core    │
│   (Frontend)    │◄──►│   (Rust)        │
│                 │    │                 │
│ • React 19      │    │ • System APIs   │
│ • TypeScript    │    │ • File System   │
│ • Tailwind CSS  │    │ • Native OS     │
└─────────────────┘    └─────────────────┘
```

## 贡献

欢迎提交 Issue 和 Pull Request！

## 许可证

MIT License
