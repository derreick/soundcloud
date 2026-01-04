const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { initSession, readSession, saveSession } = require('./app/session/save');
const { startPresence, setSearching, setListening } = require('./app/discord/presence');
const { createTray } = require('./app/ui/tray');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
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

  createTray(win, app);
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