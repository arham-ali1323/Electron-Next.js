import path from 'path';
import { app, BrowserWindow, Tray, Menu, globalShortcut, ipcMain, nativeImage } from 'electron';
import Store from 'electron-store';

const store = new Store({ name: 'memory-journal' });
let mainWindow = null;
let tray = null;

const trayIcon = nativeImage.createFromDataURL(
  'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAABFklEQVR42mNgGAXUBwwAEMzIwMDAw4B0jAFdIjOAZLD0AciOJiYGBgYGBgYmJiYGBgYGBgYGBgYGJgYEJdQEK5xMKkIZ6hVsDqQ8WMBh8x5sA1xAGzAkalYg7sEMTugPrAlxqGUgNoF3IwEnYeUDtBMS8G5wDgSxm6B8SsDkRiGFQZYjIJY2BHg3MwCxaHcJtQFkfgZVL7AhBqEEOQF6h2CApOAbeHbO6kJ0GyA8Teg+MjpwTTO4A5gF4fxF89oVM2BgwMTQEgMBh/6RlwM4gS0dMthJLUwC3kSgtAF66AahFdMSgDpQ2iTg2HrAAQ5ABgE1yBgD6aMbd0gWIgAAAABJRU5ErkJggg=='
);

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 420,
    height: 640,
    show: false,
    frame: false,
    transparent: false,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  const startUrl = process.env.ELECTRON_START_URL || 'http://localhost:3000';
  mainWindow.loadURL(startUrl);

  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();
      mainWindow.hide();
    }
  });
}

function createTray() {
  tray = new Tray(trayIcon);
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Jani',
      click: () => {
        if (mainWindow) mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuiting = true;
        app.quit();
      }
    }
  ]);

  tray.setToolTip('Jani – your Punjabi desktop companion');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
    }
  });
}

app.whenReady().then(() => {
  createWindow();
  createTray();

  globalShortcut.register('Alt+Space', () => {
    if (!mainWindow) return;
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
    if (mainWindow) mainWindow.show();
  });
});

app.on('before-quit', () => {
  app.isQuiting = true;
});

app.on('window-all-closed', (event) => {
  event.preventDefault();
});

ipcMain.handle('memory:get', () => store.store);
ipcMain.handle('memory:set', (event, key, value) => {
  store.set(key, value);
  return true;
});
