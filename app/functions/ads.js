const cleanCSS = `
  .announcement, 
  .sc-ads, 
  .adBox, 
  .visuals__ads { 
    display: none !important; 
  }
`;

function injectCleaner(win) {
  win.webContents.on('did-finish-load', () => {
    win.webContents.insertCSS(cleanCSS);
  });
}

module.exports = { injectCleaner };