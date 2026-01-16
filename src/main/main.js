/**
 * ☄️ CometX Browser - Main Process
 * الكيان الرقمي السيادي | Neural Sovereignty
 * 
 * @author Sulaiman Al-Shammari (KHAWRIZM)
 * @version 2.0.0
 * @license MIT
 */

const { app, BrowserWindow, BrowserView, ipcMain, Menu, shell, session, globalShortcut } = require('electron');
const path = require('path');
const Store = require('electron-store');

// Initialize store for settings
const store = new Store({
    defaults: {
        language: 'ar',
        theme: 'dark',
        windowBounds: { width: 1400, height: 900 },
        lastTabs: [],
        searchEngine: 'google',
        aiEnabled: true
    }
});

// Keep reference to prevent garbage collection
let mainWindow = null;
let tabs = [];
let activeTabId = 0;

// ============================================
// Window Creation
// ============================================
function createWindow() {
    const { width, height } = store.get('windowBounds');

    mainWindow = new BrowserWindow({
        width,
        height,
        minWidth: 800,
        minHeight: 600,
        frame: false, // Custom title bar
        titleBarStyle: 'hidden',
        backgroundColor: '#021a15',
        icon: path.join(__dirname, '../../assets/icons/icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            preload: path.join(__dirname, 'preload.js'),
            webviewTag: true,
            sandbox: false
        },
        show: false // Show when ready
    });

    // Load main UI
    mainWindow.loadFile('index.html');

    // Show when ready
    mainWindow.once('ready-to-show', () => {
        mainWindow.show();

        // Create initial tab
        createTab('https://www.google.com');
    });

    // Save window size on resize
    mainWindow.on('resize', () => {
        const bounds = mainWindow.getBounds();
        store.set('windowBounds', { width: bounds.width, height: bounds.height });
    });

    // Handle window close
    mainWindow.on('closed', () => {
        mainWindow = null;
        tabs = [];
    });

    // Handle external links
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('http')) {
            createTab(url);
        }
        return { action: 'deny' };
    });
}

// ============================================
// Tab Management
// ============================================
function createTab(url = 'about:blank') {
    const tabId = Date.now();

    const view = new BrowserView({
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            sandbox: true,
            webSecurity: true
        }
    });

    mainWindow.addBrowserView(view);

    // Set bounds (below the browser chrome)
    const bounds = mainWindow.getBounds();
    view.setBounds({
        x: 0,
        y: 130, // Height of title bar + nav bar + tabs bar
        width: bounds.width,
        height: bounds.height - 160 // Subtract chrome height + status bar
    });

    view.setAutoResize({ width: true, height: true });
    view.webContents.loadURL(url);

    // Track tab info
    const tab = {
        id: tabId,
        view,
        url,
        title: 'Loading...',
        favicon: '☄️'
    };

    tabs.push(tab);

    // Update title on navigation
    view.webContents.on('page-title-updated', (event, title) => {
        tab.title = title;
        mainWindow.webContents.send('tab-updated', { id: tabId, title, url: tab.url });
    });

    // Update URL on navigation
    view.webContents.on('did-navigate', (event, url) => {
        tab.url = url;
        mainWindow.webContents.send('tab-updated', { id: tabId, title: tab.title, url });
        mainWindow.webContents.send('url-changed', url);
    });

    view.webContents.on('did-navigate-in-page', (event, url) => {
        tab.url = url;
        mainWindow.webContents.send('url-changed', url);
    });

    // Handle new window requests
    view.webContents.setWindowOpenHandler(({ url }) => {
        createTab(url);
        return { action: 'deny' };
    });

    // Notify renderer
    mainWindow.webContents.send('tab-created', { id: tabId, title: tab.title, url });

    // Switch to new tab
    switchTab(tabId);

    return tabId;
}

function switchTab(tabId) {
    const tab = tabs.find(t => t.id === tabId);
    if (!tab) return;

    // Hide all views
    tabs.forEach(t => {
        mainWindow.removeBrowserView(t.view);
    });

    // Show selected view
    mainWindow.addBrowserView(tab.view);
    activeTabId = tabId;

    // Update bounds
    const bounds = mainWindow.getBounds();
    tab.view.setBounds({
        x: 0,
        y: 130,
        width: bounds.width,
        height: bounds.height - 160
    });

    mainWindow.webContents.send('tab-switched', tabId);
    mainWindow.webContents.send('url-changed', tab.url);
}

function closeTab(tabId) {
    const index = tabs.findIndex(t => t.id === tabId);
    if (index === -1) return;

    const tab = tabs[index];
    mainWindow.removeBrowserView(tab.view);
    tab.view.webContents.destroy();
    tabs.splice(index, 1);

    mainWindow.webContents.send('tab-closed', tabId);

    // Switch to another tab or create new one
    if (tabs.length === 0) {
        createTab('https://www.google.com');
    } else {
        const newIndex = Math.min(index, tabs.length - 1);
        switchTab(tabs[newIndex].id);
    }
}

// ============================================
// IPC Handlers
// ============================================
ipcMain.handle('create-tab', (event, url) => createTab(url));
ipcMain.handle('switch-tab', (event, tabId) => switchTab(tabId));
ipcMain.handle('close-tab', (event, tabId) => closeTab(tabId));

ipcMain.handle('navigate', (event, url) => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) {
        // Add protocol if missing
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('file://')) {
            // Check if it's a search query or URL
            if (url.includes('.') && !url.includes(' ')) {
                url = 'https://' + url;
            } else {
                // Search query
                url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
            }
        }
        tab.view.webContents.loadURL(url);
    }
});

ipcMain.handle('go-back', () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab && tab.view.webContents.canGoBack()) {
        tab.view.webContents.goBack();
    }
});

ipcMain.handle('go-forward', () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab && tab.view.webContents.canGoForward()) {
        tab.view.webContents.goForward();
    }
});

ipcMain.handle('reload', () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) {
        tab.view.webContents.reload();
    }
});

ipcMain.handle('go-home', () => {
    const tab = tabs.find(t => t.id === activeTabId);
    if (tab) {
        tab.view.webContents.loadURL('https://www.google.com');
    }
});

// Settings
ipcMain.handle('get-setting', (event, key) => store.get(key));
ipcMain.handle('set-setting', (event, key, value) => store.set(key, value));

// Window controls
ipcMain.handle('window-minimize', () => mainWindow.minimize());
ipcMain.handle('window-maximize', () => {
    if (mainWindow.isMaximized()) {
        mainWindow.unmaximize();
    } else {
        mainWindow.maximize();
    }
});
ipcMain.handle('window-close', () => mainWindow.close());

// Get app info
ipcMain.handle('get-app-info', () => ({
    name: app.getName(),
    version: app.getVersion(),
    platform: process.platform,
    arch: process.arch,
    electron: process.versions.electron,
    chrome: process.versions.chrome,
    node: process.versions.node
}));

// ============================================
// App Lifecycle
// ============================================
app.whenReady().then(() => {
    createWindow();

    // Register global shortcuts
    globalShortcut.register('CommandOrControl+T', () => {
        createTab('https://www.google.com');
    });

    globalShortcut.register('CommandOrControl+W', () => {
        closeTab(activeTabId);
    });

    globalShortcut.register('CommandOrControl+L', () => {
        mainWindow.webContents.send('focus-url');
    });

    globalShortcut.register('CommandOrControl+R', () => {
        const tab = tabs.find(t => t.id === activeTabId);
        if (tab) tab.view.webContents.reload();
    });

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('will-quit', () => {
    globalShortcut.unregisterAll();
});

// Security: Disable navigation to unknown protocols
app.on('web-contents-created', (event, contents) => {
    contents.on('will-navigate', (event, url) => {
        const parsedUrl = new URL(url);
        if (!['http:', 'https:', 'file:'].includes(parsedUrl.protocol)) {
            event.preventDefault();
        }
    });
});

// ============================================
// Console Branding
// ============================================
console.log(`
╔═══════════════════════════════════════════════════════╗
║  ☄️  CometX Sovereign Browser v2.0.0                  ║
║  الكيان الرقمي السيادي | Neural Sovereignty          ║
╠═══════════════════════════════════════════════════════╣
║  🔒 Privacy: 100% Local                               ║
║  ⚖️  Bias: 0% - Completely Neutral                    ║
║  🧠 Architecture: Three-Lobe System                   ║
║  🇸🇦 Made in Saudi Arabia | Vision 2030              ║
╠═══════════════════════════════════════════════════════╣
║  "من الرماد ينهض العنقاء"                             ║
║  "From the ashes rises the phoenix"                   ║
╚═══════════════════════════════════════════════════════╝
`);
