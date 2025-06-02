# GeoGebra Chat 桌面应用

这个项目现在支持打包成桌面应用程序。

## 开发环境运行

### 运行 Electron 开发版本
```bash
pnpm electron:dev
```

这个命令会：
1. 启动 Next.js 开发服务器
2. 等待服务器启动完成
3. 启动 Electron 应用

### 仅运行 Web 版本
```bash
pnpm dev
```

## 构建和打包

### 构建 Electron 应用
```bash
pnpm build:electron
```

这会构建 Next.js 应用并编译 Electron 主进程文件。

### 打包桌面应用
```bash
pnpm electron:pack
```

这会创建本地的桌面应用包，不会发布。

### 构建发布版本
```bash
pnpm electron:dist
```

这会创建用于发布的桌面应用安装包。

## 平台支持

- **macOS**: 生成 .dmg 文件 (支持 Intel 和 Apple Silicon)
- **Windows**: 生成 .exe 安装程序
- **Linux**: 生成 AppImage

## 应用图标

请将以下图标文件放置在 `public` 目录：

- `icon.png` - 512x512 PNG 格式 (Linux)
- `icon.ico` - Windows 图标 (可选)
- `icon.icns` - macOS 图标 (可选)

如果没有提供 .ico 和 .icns 文件，electron-builder 会自动从 PNG 生成。

## 自定义配置

Electron 配置在 `package.json` 的 `build` 字段中。你可以修改：

- 应用名称和 ID
- 图标和分类
- 安装程序选项
- 支持的架构

## 注意事项

1. 确保 `public/icon.png` 存在且为 512x512 像素
2. 第一次构建可能需要下载平台相关的二进制文件
3. 在不同平台上构建需要相应的开发环境

## 故障排除

如果遇到构建问题：

1. 清理缓存：`pnpm store prune`
2. 重新安装依赖：`rm -rf node_modules && pnpm install`
3. 确保 TypeScript 编译正常：`pnpm build:electron` 