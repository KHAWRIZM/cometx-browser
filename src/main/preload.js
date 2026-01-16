/**
 * ☄️ CometX Browser - Preload Script
 * Secure bridge between main and renderer processes
 */

const { contextBridge, ipcRenderer } = require('electron');

// Expose protected APIs to renderer
contextBridge.exposeInMainWorld('cometx', {
    // Tab management
    createTab: (url) => ipcRenderer.invoke('create-tab', url),
    switchTab: (tabId) => ipcRenderer.invoke('switch-tab', tabId),
    closeTab: (tabId) => ipcRenderer.invoke('close-tab', tabId),

    // Navigation
    navigate: (url) => ipcRenderer.invoke('navigate', url),
    goBack: () => ipcRenderer.invoke('go-back'),
    goForward: () => ipcRenderer.invoke('go-forward'),
    reload: () => ipcRenderer.invoke('reload'),
    goHome: () => ipcRenderer.invoke('go-home'),

    // Window controls
    minimize: () => ipcRenderer.invoke('window-minimize'),
    maximize: () => ipcRenderer.invoke('window-maximize'),
    close: () => ipcRenderer.invoke('window-close'),

    // Settings
    getSetting: (key) => ipcRenderer.invoke('get-setting', key),
    setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),

    // App info
    getAppInfo: () => ipcRenderer.invoke('get-app-info'),

    // Event listeners
    onTabCreated: (callback) => {
        ipcRenderer.on('tab-created', (event, data) => callback(data));
    },
    onTabUpdated: (callback) => {
        ipcRenderer.on('tab-updated', (event, data) => callback(data));
    },
    onTabSwitched: (callback) => {
        ipcRenderer.on('tab-switched', (event, tabId) => callback(tabId));
    },
    onTabClosed: (callback) => {
        ipcRenderer.on('tab-closed', (event, tabId) => callback(tabId));
    },
    onUrlChanged: (callback) => {
        ipcRenderer.on('url-changed', (event, url) => callback(url));
    },
    onFocusUrl: (callback) => {
        ipcRenderer.on('focus-url', () => callback());
    },

    // Platform info
    platform: process.platform,
    isElectron: true
});

// Log that preload is ready
console.log('☄️ CometX Preload Ready');
