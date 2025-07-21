const { contextBridge, ipcRenderer } = require('electron');

// レンダラープロセスに安全なAPIを公開
contextBridge.exposeInMainWorld('electronAPI', {
  // メニューイベントの受信
  onMenuNewProject: (callback) => {
    ipcRenderer.on('menu-new-project', callback);
  },
  
  // エラーイベントの受信
  onError: (callback) => {
    ipcRenderer.on('error', callback);
  },
  
  // イベントリスナーの削除
  removeAllListeners: (channel) => {
    ipcRenderer.removeAllListeners(channel);
  },
  
  // アプリケーション情報の取得
  getAppInfo: () => {
    return {
      version: process.env.npm_package_version || '1.0.0',
      name: process.env.npm_package_name || 'システム設計アシスタント',
      platform: process.platform,
      arch: process.arch
    };
  },
  
  // ファイルシステム操作（将来的な拡張用）
  showOpenDialog: (options) => {
    return ipcRenderer.invoke('show-open-dialog', options);
  },
  
  showSaveDialog: (options) => {
    return ipcRenderer.invoke('show-save-dialog', options);
  },
  
  // 通知の表示
  showNotification: (title, body) => {
    return ipcRenderer.invoke('show-notification', { title, body });
  },
  
  // ダイアログの表示
  showMessageBox: (options) => {
    return ipcRenderer.invoke('show-message-box', options);
  }
});

// 開発環境でのデバッグ情報
if (process.env.NODE_ENV === 'development') {
  console.log('Electron preload script loaded');
  console.log('Available APIs:', Object.keys(contextBridge.exposeInMainWorld));
} 