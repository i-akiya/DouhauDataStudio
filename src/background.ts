'use strict'

import { app, protocol, Menu, BrowserWindow } from 'electron'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
const { ipcMain } = require('electron')
const path = require('path')
const fs = require('fs-extra')

const isDevelopment = process.env.NODE_ENV !== 'production'
const user_home = app.getPath('home')
const ddsHome = user_home.toString().concat('/.douhau-data-studio')

// log
var log = require('electron-log');
log.transports.file.level = 'info';
log.transports.file.file = path.join(ddsHome, '/logs', 'douhau-data-studio.log')
log.info("Start Douhau Data Studio")
process.on('uncaughtException', function(err) {
  log.error('electron:event:uncaughtException');
  log.error(err);
  log.error(err.stack);
  app.quit();
});

// check .douhau-data-studio directory

fs.ensureDirSync(ddsHome)
// check rshiny directory & files
var dir_rshiny_build_app: String[] = app.getPath('exe').split("/")
dir_rshiny_build_app.pop()
dir_rshiny_build_app.pop()
var path_rshiny: String
const rshiny_dir_dds_user_home: string = path.join(ddsHome, '/rshiny')
if (isDevelopment) {
  path_rshiny = path.join('./', 'rshiny')
  log.info(path_rshiny)
} else {
  path_rshiny = path.join(dir_rshiny_build_app.join("/").toString(), 'rshiny')
}

if (!fs.existsSync(rshiny_dir_dds_user_home)) {
  try {
    fs.copySync(path_rshiny, rshiny_dir_dds_user_home)
    log.info('Copy rshiny directory to under the user home directory ".douhau-data-studio".')
  } catch (err) {
    log.error(err)
  }
}

// Launch R Shiny
const execa = require('execa');
(async () => {
  try {
    //const { stdout } = await execa('Rscript', [path.join(path_rshiny, 'rshiny', 'start-shiny.R')])
    if (process.platform === 'darwin'){
      const { stdout } = await execa('Rscript', [path.join(user_home.toString(), '.douhau-data-studio', 'rshiny', 'start-shiny.R')])
    } else if (process.platform === 'win32'){
      const { stdout } = await execa('Rscript.exe', [path.join(user_home.toString(), '.douhau-data-studio', 'rshiny', 'start-shiny.R')])
    }

  } catch (error) {
    log.error(error)
  }
})();





// Application menu
var menu = Menu.buildFromTemplate([
  {
    label: 'File',
    submenu: [
      {
        label: 'Study Space Selector',
        accelerator: 'CmdOrCtrl+O',
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            if (isDevelopment) {
              // Load the url of the dev server if in development mode
              focusedWindow.loadURL('http://localhost:8080/home')
            } else {
              // createProtocol('app')
              // Load the index.html when not in development
              focusedWindow.loadURL('app://./home')
            }
          }
        }
      },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { label: 'Copy', accelerator: 'CmdOrCtrl+C' },
      { label: 'Paste', accelerator: 'CmdOrCtrl+V' },
    ]
  },
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'CmdOrCtrl+R',
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.reload();
        }
      },
      {
        label: 'Toggle Full Screen',
        accelerator: (function() {
          if (process.platform == 'darwin')
            return 'Ctrl+Command+F';
          else
            return 'F11';
        })(),
        click: function(item, focusedWindow) {
          if (focusedWindow)
            focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      },
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'About',
        click: function(item, focusedWindow) {
          if (focusedWindow) {
            if (isDevelopment) {
              // Load the url of the dev server if in development mode
              showAboutDialog()
            } else {
              // createProtocol('app')
              // Load the index.html when not in development
              showAboutDialog()
            }
          }
        }
      },
      { label: 'Donate' },
    ]
  },
]);
Menu.setApplicationMenu(menu);

// Load YAML
function loadYamlFile(filename) {
  const yaml = require('js-yaml');
  const yamlText = fs.readFileSync(filename, 'utf8')
  return yaml.safeLoad(yamlText);
}
// Load data-src-list.yaml
var dataSrcList
try {
  dataSrcList = loadYamlFile(path.join(ddsHome, 'data-src-list.yaml'));
  // 送信元のチャンネル('asynchronous-reply')に返信する
} catch (err) {
  console.error(err.message);
}

// About Dialog
function showAboutDialog() {
  const aboutDialog = new BrowserWindow({ width: 800, height: 600 })
  if (isDevelopment) {
    // Load the url of the dev server if in development mode
    aboutDialog.loadURL('http://localhost:8080/about.html')
  } else {
    // createProtocol('app')
    // Load the index.html when not in development
    aboutDialog.loadURL('app://./about.html')
  }
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win: BrowserWindow | null

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

function createWindow() {
  // execa('Rscript', ['start-shiny.R']).stdout.pipe(process.stdout);
  // Create the browser window.
  win = new BrowserWindow({
    width: 1400,
    height: 850,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: (process.env
        .ELECTRON_NODE_INTEGRATION as unknown) as boolean,
      preload: path.join(__dirname, 'preload.js')
    }
  })

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string)
    if (!process.env.IS_TEST) win.webContents.openDevTools()
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }

  win.on('closed', () => {
    win = null
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow()
  }
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}



// IPC asynchronous
// Push load data-src-list
ipcMain.on('load-data-src-list', (event, arg) => {
  try {
    event.reply('load-data-src-list', dataSrcList)
  } catch (err) {
    console.error(err.message)
  }
})

// Add data source
ipcMain.on('add-data-src-list', (event, arg) => {
  dataSrcList.push(arg)
  const yaml = require('js-yaml');
  let yamlStr = yaml.safeDump(dataSrcList);
  fs.writeFileSync(path.join(ddsHome, 'data-src-list.yaml'), yamlStr, 'utf8');
})

// Alter data source
ipcMain.on('alter-data-src-list', (event, arg) => {
  const index = dataSrcList.findIndex((x) => x['id'] === arg['id'])
  dataSrcList[index] = arg
  const yaml = require('js-yaml');
  let yamlStr = yaml.safeDump(dataSrcList);
  fs.writeFileSync(path.join(ddsHome, 'data-src-list.yaml'), yamlStr, 'utf8');
})

// Delete data source
ipcMain.on('delete-data-src-list', (event, arg) => {
  dataSrcList = dataSrcList.filter(s => s['id'] !== arg )
  const yaml = require('js-yaml');
  let yamlStr = yaml.safeDump(dataSrcList);
  fs.writeFileSync(path.join(ddsHome, 'data-src-list.yaml'), yamlStr, 'utf8');
})




//const target = dataSrcList.find((dataSrc) => {
//    return (dataSrc.id === '0EcERDl5kx5l');
//});

//try {
//  if ( Object.keys(target).length > 0 ){
//      console.log( target )
//  }
//} catch(err) {
//      console.log("NOT Found")
//}


//const aa_1 = { id: 'tZ1bxPFZJBVx',
//              name: 'study_z',
//              description: 'description z',
//              dataSource: '/Users/ippei/develop/data/zcdisc/sdtm/'
//              }
//dataSrcList.push(aa_1)
//console.log(dataSrcList)
