const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { initSession, readSession, saveSession } = require('./app/session/save');
const { startPresence, setSearching, setListening } = require('./app/discord/presence');
const { createTray } = require('./app/functions/tray');
const { registerShortcuts } = require('./app/media/shortcuts');
const { injectCleaner } = require('./app/functions/ads');
const path = require('path');

let win;

function createWindow() {
  win = new BrowserWindow({
    width: 1200,
    height: 800,
    title: 'SoundCloud',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

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
        buttons: ['Minimizar', 'Cerrar', 'Cancelar'],
        defaultId: 0,
        cancelId: 2,
        title: 'SoundCloud',
        message: '¿Qué deseas hacer?'
      });

      if (choice === 0) {
        win.hide();
      } else if (choice === 1) {
        app.isQuiting = true;
        app.quit();
      }
    }
  });

  createTray(win, app);
  registerShortcuts(win);
  injectCleaner(win);
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