import { contextBridge, ipcRenderer } from 'electron';

// 在窗口对象上暴露 API
contextBridge.exposeInMainWorld('electronAPI', {
  // 这里可以添加主进程与渲染进程的通信接口
  // 例如：
  // getVersion: () => ipcRenderer.invoke('get-version'),
  // openExternal: (url: string) => ipcRenderer.invoke('open-external', url),
}); 