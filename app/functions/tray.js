const { Tray, Menu, nativeImage } = require('electron');
const path = require('path');

let tray = null;

function createTray(win, app) {
    const iconPath = path.join(__dirname, '../../assets/favicon.png');
    tray = new Tray(iconPath);

    const contextMenu = Menu.buildFromTemplate([
        { 
            label: 'Mostrar SoundCloud', 
            click: () => win.show() 
        },
        { type: 'separator' },
        { 
            label: 'Salir', 
            click: () => {
                app.isQuiting = true;
                app.quit();
            } 
        }
    ]);

    tray.setToolTip('SoundCloud Desktop');
    tray.setContextMenu(contextMenu);

    tray.on('double-click', () => {
        win.isVisible() ? win.hide() : win.show();
    });

    win.on('close', (event) => {
        if (!app.isQuiting) {
            event.preventDefault();
            win.hide();
        }
        return false;
    });
}

module.exports = { createTray };