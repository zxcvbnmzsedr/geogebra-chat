# 🎨 Chat with GeoGebra

通过聊天辅助 GeoGebra 绘图的智能应用，现在支持桌面版本！

Fork from https://github.com/tiwe0/chat-with-geogebra.git

## ✨ 功能特性

- 🤖 智能聊天辅助 GeoGebra 绘图
- 💻 支持 Web 和桌面应用
- 🎨 现代化的用户界面
- 📱 响应式设计
- 🔒 **内网支持** - 支持本地GeoGebra资源，无需外网访问

## 🌐 GeoGebra 资源配置

项目支持两种GeoGebra资源模式：

### 🏠 本地模式（推荐用于内网环境）
```bash
# 创建 .env.local 文件
echo "NEXT_PUBLIC_GEOGEBRA_MODE=local" > .env.local
```

### ☁️ 远程模式（需要外网访问）
```bash
# 创建 .env.local 文件
echo "NEXT_PUBLIC_GEOGEBRA_MODE=remote" > .env.local
```

> 💡 **详细配置说明请查看 [GEOGEBRA_SETUP.md](./GEOGEBRA_SETUP.md)**

## 🚀 快速开始

### Web 版本

```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev
```

### 桌面应用

```bash
# 启动桌面应用开发环境
pnpm electron:dev

# 或者使用便捷脚本
./start-electron.sh
```

## 📦 构建和打包

### 构建 Web 版本
```bash
pnpm build
```

### 打包桌面应用
```bash
# 构建桌面应用
pnpm build:electron

# 打包为安装程序（不发布）
pnpm electron:pack

# 构建发布版本
pnpm electron:dist
```

## 🖥️ 桌面应用支持

- **macOS**: 生成 .dmg 文件 (支持 Intel 和 Apple Silicon)
- **Windows**: 生成 .exe 安装程序
- **Linux**: 生成 AppImage

## 📋 技术栈

- **前端**: Next.js 15, React 19, TypeScript
- **样式**: Tailwind CSS
- **桌面**: Electron
- **数学绘图**: GeoGebra (支持本地和远程资源)
- **包管理**: pnpm

## 📖 详细文档

- [桌面应用配置](./ELECTRON_README.md)
- [GeoGebra本地资源配置](./GEOGEBRA_SETUP.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
