# 🎨 Chat with GeoGebra

通过聊天辅助 GeoGebra 绘图的智能应用，现在支持桌面版本！

Fork from https://github.com/tiwe0/chat-with-geogebra.git

## ✨ 功能特性

- 🤖 智能聊天辅助 GeoGebra 绘图
- 💻 支持 Web 和桌面应用
- 🎨 现代化的用户界面
- 📱 响应式设计

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
- **包管理**: pnpm

## 📖 详细文档

更多桌面应用相关信息，请查看 [ELECTRON_README.md](./ELECTRON_README.md)

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## �� 许可证

MIT License
