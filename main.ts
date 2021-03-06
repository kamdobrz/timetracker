// import { app, BrowserWindow, screen, Menu, ipcMain } from 'electron';
// import * as path from 'path';

// const url = require('url')

const electron = require("electron")
const app = electron.app
const BrowserWindow = electron.BrowserWindow
const Tray = electron.Tray
const Menu = electron.Menu
const url = require('url')
const path = require('path')

let mainWindow, serve;
var trayIcon = null;
const args = process.argv.slice(1);
serve = args.some(val => val === '--serve');

if (serve) {
  require('electron-reload')(__dirname, {
  });
}

function createWindow(name) {

  const electronScreen = screen;
  // const size = electronScreen.getPrimaryDisplay().workAreaSize;

  // Create the browser window.
  name = new BrowserWindow({
    // x: 0,
    // y: 0,
    width: 800,
    height: 800
  });

  // and load the index.html of the app.
  name.loadURL(url.format({
    pathname: path.join(__dirname + '/' + name + '.html'),
    protocol: 'file',
    slashes: true,
    icon: __dirname + 'assets/img/icon.ico'
  }))

  // Open the DevTools.
  if (serve) {
    name.webContents.openDevTools();
  }

  // Emitted when the window is closed.
  name.on('closed', () => {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    name = null;
  });
}

try {

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // app.on('ready', createWindow);
  app.on('ready', function() {

    const iconName = '../src/assets/icon.png';
    const iconPath = path.join(__dirname, iconName);
  
    trayIcon = new Tray(iconPath);
    trayIcon.setToolTip('Hello World');


    mainWindow = new BrowserWindow({
      // height: 8000,
      // width: 1000,
      title: 'Kleder Track App'
    })
    
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true,
        icon: __dirname + '/img/icon.ico'
    }))

    mainWindow.on('closed', function() {
        app.quit()
    })
    
    const mainMenuTemplate:Array<any> = [
      {
        label: "Kleder Track App",
        submenu: [
          {
            label: 'About authors..'
          },
          {
            label: "Quit app",
            accelerator: process.platform == 'darwin' ? 'Command+Q': 'Ctrl+Q',
            click() {
              app.quit()
            }
          }
        ]
      },
      {
        label: "Options",
        submenu: [
          {
            label: 'Option 1',
            click() {
              this.createAddWindow('option-1')
            }
          },
          {
            label: 'Option 2',
            click() {
              this.createAddWindow('option-2')
            }
          },
          {
            role: 'reload'
          }
        ]
      }
    ]

    if (process.platform == 'darwin') {
      console.log('done')
      mainMenuTemplate.unshift({})
    }
  
    if (process.env.NODE_ENV !== 'production') {
      mainWindow.webContents.openDevTools();
      mainMenuTemplate.push({
          label: 'Dev Tools',
          submenu: [
              {
                  label: 'Toggle DevTools',
                  click() {
                      mainWindow.toggleDevTools()
                  }
              },
              {
                  role: 'reload'
              }
          ]
      })
    }

    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate)
    Menu.setApplicationMenu(mainMenu)

    trayIcon.on('click', () => {
      mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show()
    })

  });
  
  // Quit when all windows are closed.
  app.on('window-all-closed', () => {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });

  // app.on('activate', () => {
  //   // On OS X it's common to re-create a window in the app when the
  //   // dock icon is clicked and there are no other windows open.
  //   if (mainWindow === null) {
  //     this.createWindow();
  //   }
  // });

} catch (e) {
  // Catch Error
  // throw e;
}
