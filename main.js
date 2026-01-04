const { app, BrowserWindow, ipcMain, dialog, nativeImage } = require('electron');
const { initSession, readSession, saveSession } = require('./app/session/save');
const { startPresence, setSearching, setListening } = require('./app/discord/presence');
const { createTray } = require('./app/functions/tray');
const { registerShortcuts } = require('./app/media/shortcuts');
const { injectCleaner } = require('./plugins/adblocker');
const { checkUpdates } = require('./plugins/updateChecker');
const path = require('path');

let win;

app.setAppUserModelId('com.soundcloud.desktop');

const iconPath = path.resolve(__dirname, './app/assets/favicon.png');
const icon = nativeImage.createFromPath(iconPath);

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'SoundCloud',
    icon: iconPath,
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.setIcon(icon);

  win.loadURL('https://soundcloud.com');

  win.on('page-title-updated', (event) => {
    event.preventDefault();
    win.setTitle('SoundCloud');
  });

  win.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault();

      const choice = dialog.showMessageBoxSync(win, {
        type: 'question',
        buttons: ['Minimize', 'Close', 'Cancel'],
        defaultId: 0,
        cancelId: 2,
        title: 'SoundCloud',
        message: 'Select an action:',
      });

      if (choice === 0) {
        win.hide();
      } else if (choice === 1) {
        app.isQuiting = true;
        app.quit();
      }
    }
  });

  win.webContents.on('did-finish-load', () => {
    checkUpdates(win);
  });

  createTray(win, app, iconPath);
  registerShortcuts(win);
  injectCleaner(win);
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) {
      if (win.isMinimized()) win.restore();
      win.show();
      win.focus();
    }
  });
}

ipcMain.on('sc:searching', () => {
  setSearching();
});

ipcMain.on('sc:listening', (_, track) => {
  setListening(track);
});

app.whenReady().then(() => {
  initSession(app);
  startPresence();

  const session = readSession();
  if (session.firstRun) {
    session.firstRun = false;
    saveSession(session);
  }

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

app.on('will-quit', () => {
  const { globalShortcut } = require('electron');
  globalShortcut.unregisterAll();
});