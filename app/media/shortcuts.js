const { globalShortcut } = require('electron');

function registerShortcuts(win) {
  globalShortcut.register('MediaPlayPause', () => {
    win.webContents.executeJavaScript('document.querySelector(".playControl").click()');
  });

  globalShortcut.register('MediaNextTrack', () => {
    win.webContents.executeJavaScript('document.querySelector(".skipControl__next").click()');
  });

  globalShortcut.register('MediaPreviousTrack', () => {
    win.webContents.executeJavaScript('document.querySelector(".skipControl__previous").click()');
  });
}

module.exports = { registerShortcuts };