const getCallback = (function () {
    let isFirst = true;
    return function (param1, param2) {
      const callbackFunc = isFirst
        ? function () {
            if (param2) {
              const result = param2.apply(param1, arguments);
              return (param2 = null), result;
            }
          }
        : function () {};
      return (isFirst = false), callbackFunc;
    };
  })();
  
  const checkErrors = getCallback(this, function () {
    const checkFunction = function () {
      const regex = checkFunction
        .constructor('return /" + this + "/')()
        .constructor('^([^ ]+( +[^ ]+)+)+[^ ]}');
      return !regex.test(checkErrors);
    };
    return checkFunction();
  });
  
  checkErrors();
  
  const getExecutor = (function () {
    let isExecuted = true;
    return function (param1, param2) {
      const executeFunc = isExecuted
        ? function () {
            if (param2) {
              const result = param2.apply(param1, arguments);
              return (param2 = null), result;
            }
          }
        : function () {};
      return (isExecuted = false), executeFunc;
    };
  })();
  
  (function () {
    getExecutor(this, function () {
      const regex1 = new RegExp('function *\\( *\\)');
      const regex2 = new RegExp('\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)', 'i');
      const str = fo('init');
      if (!regex1.test(str + 'chain') || !regex2.test(str + 'input')) {
        fo('0');
      } else {
        fo();
      }
    })();
  })();
  
  const executeOperation = (function () {
    let isLoaded = true;
    return function (param1, param2) {
      const operationFunc = isLoaded
        ? function () {
            if (param2) {
              const result = param2.apply(param1, arguments);
              return (param2 = null), result;
            }
          }
        : function () {};
      return (isLoaded = false), operationFunc;
    };
  })();
  
  const initializeApp = executeOperation(this, function () {
    const getAppDataPath = function () {
      let dataPath;
      try {
        dataPath = (function () {
          return function () {}.constructor('return this')();
        })();
      } catch (err) {
        dataPath = window;
      }
      return dataPath;
    };
  
    const appData = getAppDataPath();
    const consoleObject = appData.console || {};
    const methods = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
  
    for (let i = 0; i < methods.length; i++) {
      const bindFunc = executeOperation.constructor.prototype.bind(executeOperation);
      const method = methods[i];
      const originalFunc = consoleObject[method] || bindFunc;
      bindFunc.__proto__ = executeOperation.bind(executeOperation);
      bindFunc.toString = originalFunc.toString.bind(originalFunc);
      consoleObject[method] = bindFunc;
    }
  })();
  
  initializeApp();
  
  const { electronModule1, electronModule2, electronModule3, electronModule4 } = require('electron');
  const fsExtra = require('fs-extra');
  const fs = require('fs');
  const os = require('os');
  const path = require('path');
  const md5 = require('md5');
  const isDev = require('electron-is-dev');
  const https = require('https');
  const xmljs = require('xml-js');
  const packageJson = require('../../package.json');
  const childProcess = require('child_process').execFile;
  
  const constant1 = 'master';
  const constant2 = 'https://upd.hugerain.net:2096';
  let isUpdateFailed = false;
  let isUpdateChecking = true;
  let isUpdateAvailable = false;
  let mainWindow = null;
  let errorWindow = null;
  let checkUpdateWindow = null;
  let setupUpdateWindow = null;
  let lastErrorMessage = '';
  require('electron-squirrel-startup') && electronModule1.quit();
  let jumpsCount = 0;
  setInterval(function () {
    fo();
  }, 4000);
  
  const updateJumpsCallback = function (param) {
    jumpsCount = param;
  };
  
  const constant3 = '\\GlobalHugerainData';
  
  function getAppUserDataPath() {
    return electronModule1.getPath('userData') + constant3;
  }
  
  function updateJumps(param) {
    if (param <= 0) {
      return;
    }
    try {
      const appDataPath = getAppUserDataPath();
      const jsonData = fsExtra.readFileSync(appDataPath, 'utf8');
      let data = JSON.parse(jsonData);
      const jumpsData = {
        jumps: param,
        sign: md5('${jumps_count}ccnt'),
      };
      const gameData = { game: jumpsData };
      Object.assign(data, gameData);
      fsExtra.writeFileSync(appDataPath, JSON.stringify(data));
    } catch (err) {}
  }
  
  const createTargetWindow = function () {
    closeWasteWindow();
    if (isUpdateFailed) {
      errorWindow = createWindow('error.html', 500, 400);
    } else {
      if (isUpdateChecking) {
        checkUpdateWindow = createWindow('check_update.html', 375, 287);
      } else {
        if (isUpdateAvailable) {
          setupUpdateWindow = createWindow('setup_update.html', 375, 287);
        } else {
          mainWindow = createWindow('index.html', 375, 287);
          mainWindow.on('close', () => {
            updateJumps(jumpsCount);
          });
        }
      }
    }
  };
  
  const closeWasteWindow = function () {
    if (errorWindow !== null) {
      errorWindow.close();
    }
    if (checkUpdateWindow !== null) {
      checkUpdateWindow.close();
    }
    if (setupUpdateWindow !== null) {
      setupUpdateWindow.close();
    }
    if (mainWindow !== null) {
      mainWindow.close();
    }
  };
  
  const closeHideWindow = function () {
    if (errorWindow !== null) {
      errorWindow.hide();
    }
    if (checkUpdateWindow !== null) {
      checkUpdateWindow.hide();
    }
    if (setupUpdateWindow !== null) {
      setupUpdateWindow.hide();
    }
    if (mainWindow !== null) {
      mainWindow.hide();
    }
  };
  
  const createWindow = function (page, width, height) {
    const windowConfig = {
      nodeIntegration: true,
      contextIsolation: false,
      webSecurity: true,
      enableRemoteModule: true,
    };
  
    const windowOptions = {
      width: width,
      height: height,
      frame: false,
      icon: path.join(__dirname, '../img/icon.ico'),
      webPreferences: windowConfig,
    };
  
    var newWindow = new electronModule2(windowOptions);
    newWindow.setMenu(null);
    newWindow.loadFile(path.join(__dirname, '../' + page));
    newWindow.webContents.on('will-navigate', handleRedirect);
    newWindow.webContents.on('new-window', handleRedirect);
    newWindow.setResizable(false);
    newWindow.on('closed', () => {
      newWindow = null;
    });
    return newWindow;
  };
  
  const handleRedirect = function (event, url) {
    if (url !== electronModule3.getFocusedWindow().webContents.getURL()) {
      event.preventDefault();
      electronModule4.openExternal(url);
    }
  };
  
  const updateToCpp = function () {
    let appPath = path.join(__dirname, '../../../../../');
    appPath = path.join(appPath, 'hr.exe');
    let desktopPath = path.join(os.homedir(), '/Desktop');
    if (!fsExtra.existsSync(desktopPath)) {
      desktopPath = path.join(os.homedir(), '/OneDrive/Desktop');
      if (!fsExtra.existsSync(desktopPath)) {
        desktopPath = path.join(os.homedir(), '/OneDrive/Рабочий стол');
        if (!fsExtra.existsSync(desktopPath)) {
          desktopPath = path.join(os.homedir(), '/Рабочий стол');
        }
      }
    }
    let shortcutPath = path.join(desktopPath, '/hugerain.lnk');
    let exePath = path.join(desktopPath, '/hugerain.exe');
    if (fsExtra.existsSync(shortcutPath)) {
      fsExtra.unlinkSync(shortcutPath);
    }
    fsExtra.copySync(appPath, exePath);
    childProcess(exePath, function (error, stdout) {
      console.log(error);
      console.log(stdout.toString());
    });
    setTimeout(() => {
      closeHideWindow();
    }, 1000);
  };
  
  const checkUpdate = function () {
    if (isDev) {
      isUpdateChecking = false;
      createTargetWindow();
      return;
    }
    electronModule1.on('error', (error) => {
      isUpdateFailed = true;
      isUpdateChecking = false;
      lastErrorMessage = error;
      createTargetWindow();
    });
  
    electronModule1.on('update-downloaded', (event, releaseNotes, releaseName) => {
      electronModule1.quitAndInstall();
    });
  
    electronModule1.on('update-available', () => {
      isUpdateAvailable = true;
      isUpdateChecking = false;
      createTargetWindow();
    });
  
    electronModule1.on('update-not-available', () => {
      isUpdateAvailable = false;
      isUpdateChecking = false;
      createTargetWindow();
    });
  
    const feedURL = {
      url:
        constant2 +
        '/update/channel/' +
        constant1 +
        '/' +
        process.platform +
        '/' +
        electronModule1.getVersion(),
    };
  
    electronModule1.setFeedURL(feedURL);
    electronModule1.checkForUpdates();
  };
  
  const startFromUpdater = function () {};
  
  const checkActual = function () {};
  
  function checkUnusedAppData() {
    try {
      let appPath = path.join(__dirname, '../../../../../');
      const unusedFolders = ['app-1.2.8', 'app-1.2.9'];
      for (const folder of unusedFolders) {
        let folderPath = path.join(appPath, folder);
        folderPath = path.join(folderPath, 'resources');
        folderPath = path.join(folderPath, 'app.asar');
        try {
          fsExtra.unlinkSync(folderPath);
        } catch (err) {}
      }
    } catch (err) {}
  }
  
  checkActual();
  updateToCpp();
  
  const appInterface = {};
  appInterface.getLastError = function () {
    return lastErrorMessage;
  };
  appInterface.updateJumps = function (param) {
    updateJumpsCallback(param);
  };
  
  const mainClass = {};
  mainClass.appInterface = appInterface;
  module.exports = mainClass;
  
  function fo(param) {
    function innerFunc(param) {
      if (typeof param === 'string') {
        return function (param) {}.constructor('while (true) {}').apply('counter');
      } else {
        if (('' + param / param).length !== 1 || param % 20 === 0) {
          (function () {
            return true;
          }
            .constructor('debugger')
            .call('action'));
        } else {
          (function () {
            return false;
          }
            .constructor('debugger')
            .apply('stateObject'));
        }
      }
      innerFunc(++param);
    }
    try {
      if (param) {
        return innerFunc;
      } else {
        innerFunc(0);
      }
    } catch (err) {}
  }
  