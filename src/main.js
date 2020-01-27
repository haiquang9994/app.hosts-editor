// Modules to control application life and create native browser window
const { app, BrowserWindow, Tray, Menu } = require('electron')
const path = require('path')
// const AutoLaunch = require('auto-launch')

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow
let trayIcon = null

function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true
    },
    icon: __dirname + `/icon/icon.png`
  })

  mainWindow.setMenu(null)

  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.

  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
  mainWindow.on('close', (event) => {
    if (!app.isQuiting) {
      event.preventDefault()
      mainWindow.hide()
    }
  })
  mainWindow.on('minimize', (event) => {
    event.preventDefault()
    mainWindow.hide()
  })
  trayIcon = new Tray(__dirname + `/icon/icon.png`)
  trayIcon.setToolTip('Hosts Editor')
  trayIcon.setContextMenu(Menu.buildFromTemplate([
    {
      label: 'Open',
      click() {
        mainWindow.show()
      }
    },
    {
      label: 'Quit',
      click() {
        app.isQuiting = true
        app.quit()
      }
    }
  ]))

  trayIcon.addListener('click', () => {
    if (mainWindow) {
      mainWindow.show()
    }
  })
}

let gotTheLock = app.requestSingleInstanceLock()
if (gotTheLock) {
  app.on('second-instance', (event, argv, cwd) => {
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore()
      }
      mainWindow.focus()
      mainWindow.show()
    }
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.on('ready', () => {
    createWindow()
    // if (process.platform === 'win32') {
    //   let autoLaunch = new AutoLaunch({
    //     name: 'Hosts Editor',
    //     path: app.getPath('exe'),
    //     icon: __dirname + `/icon/icon.png`
    //   })
    //   // Computer\HKEY_CURRENT_USER\SOFTWARE\Microsoft\Windows\CurrentVersion\Run
    //   autoLaunch.isEnabled()
    //     .then(isEnabled => {
    //       if (!isEnabled) {
    //         autoLaunch.enable()
    //       }
    //     })
    // }
  })

  // Quit when all windows are closed.
  app.on('window-all-closed', function () {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') app.quit()
  })

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
      createWindow()
    }
  })

  // In this file you can include the rest of your app's specific main process
  // code. You can also put them in separate files and require them here.
} else {
  app.quit()
}
