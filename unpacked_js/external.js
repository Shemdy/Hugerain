var checkValue = (function () {
    var value = true;
    return function (param, callback) {
      var validate = value
        ? function () {
            if (callback) {
              var result = callback.apply(param, arguments);
              return (callback = null), result;
            }
          }
        : function () {};
      return (value = false), validate;
    };
  })();
  
  var validateInput = checkValue(this, function () {
    var validatePattern = function () {
      var pattern = validatePattern
        .constructor('return /" + this + "/')()
        .constructor('^([^ ]+( +[^ ]+)+)+[^ ]}');
      return !pattern.test(validateInput);
    };
    return validatePattern();
  });
  
  validateInput();
  
  var executeFunction = (function () {
    var toggle = true;
    return function (input, callback) {
      var execute = toggle
        ? function () {
            if (callback) {
              var result = callback.apply(input, arguments);
              return (callback = null), result;
            }
          }
        : function () {};
      return (toggle = false), execute;
    };
  })();
  
  (function () {
    executeFunction(this, function () {
      var checkFunction = new RegExp('function *\\( *\\)'),
        incrementExpression = new RegExp('\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)', 'i'),
        validateExpression = checkValue('init');
      if (!checkFunction.test(validateExpression + 'chain') || !incrementExpression.test(validateExpression + 'input')) {
        validateExpression('0');
      } else {
        executeFunction();
      }
    })();
  })();
  
  var processExecution = (function () {
    var toggle = true;
    return function (parameter, callback) {
      var execute = toggle
        ? function () {
            if (callback) {
              var result = callback.apply(parameter, arguments);
              return (callback = null), result;
            }
          }
        : function () {};
      return (toggle = false), execute;
    };
  })();
  
  setInterval(function () {
    executeFunction();
  }, 4000);
  
  var overrideConsole = processExecution(this, function () {
    var getGlobalObject = function () {
        var globalObject;
        try {
          globalObject = (function () {
            return function () {}.constructor('return this')();
          })();
        } catch (error) {
          globalObject = window;
        }
        return globalObject;
      },
      targetObject = getGlobalObject(),
      consoleObject = (targetObject.console = targetObject.console || {}),
      consoleMethods = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
    for (var i = 0; i < consoleMethods.length; i++) {
      var originalFunction = processExecution.constructor.prototype.bind(processExecution);
      var methodName = consoleMethods[i];
      var method = consoleObject[methodName] || originalFunction;
      originalFunction.__proto__ = processExecution.bind(processExecution);
      originalFunction.toString = method.toString.bind(method);
      consoleObject[methodName] = originalFunction;
    }
  });
  
  overrideConsole();
  
  const fs = require('fs'),
    path = require('path'),
    crypto = require('crypto'),
    md5 = require('md5'),
    { electron, ipcRenderer } = require('electron'),
    { ipcMain } = electron.require('./index.js'),
    { api } = electron.require('./api.js'),
    { bhop } = electron.require('./bhop.js'),
    globalDataKey = '\\GlobalHugerainData';
  
  function closeApp() {
    ipcRenderer.BrowserWindow.getFocusedWindow().close();
  }
  
  function minimizeApp() {
    ipcRenderer.BrowserWindow.getFocusedWindow().minimize();
  }
  
  function getUserData() {
    return ipcMain.getUserData();
  }
  
  function getGlobalDataPath() {
    return electron.app.getPath('userData') + globalDataKey;
  }
  
  function showNotification(message) {
    var modal = document.getElementById('notify-modal');
    modal.style.display = 'block';
    var text = document.getElementById('notify-text');
    text.innerHTML = message;
    setTimeout(() => {
      modal.style.display = 'none';
    }, 2000);
  }
  
  function saveUserData(login) {
    var filePath = getGlobalDataPath(),
      data = { login: login },
      content = { user: data },
      jsonContent = JSON.stringify(content);
    fs.writeFileSync(filePath, jsonContent);
  }
  
  function getSavedUserData() {
    try {
      var filePath = getGlobalDataPath(),
        fileContent = fs.readFileSync(filePath, 'utf8');
      let parsedContent = JSON.parse(fileContent);
      return parsedContent.user.login;
    } catch (error) {}
  }
  
  function getSavedGameJumps() {
    try {
      var filePath = getGlobalDataPath(),
        fileContent = fs.readFileSync(filePath, 'utf8');
      let parsedContent = JSON.parse(fileContent);
      return parsedContent.game.jumps;
    } catch (error) {}
    return 0;
  }
  
  var jumpCount = 0,
    isPremium = false,
    isAuthorized = false,
    customStyle = null;
  
  async function authorizeUser() {
    var login = document.getElementById('user-login').value;
    if (login == '') {
      showNotification('Введите логин');
      return;
    }
    if (isAuthorized) {
      return;
    }
    if (isPremium) {
      ipcRenderer.openExternal('https://hugerain.net/premium');
      return;
    }
    api
      .authUser(login)
      .then((response) => {
        if (response.status) {
          jumpCount = response.jumpCount;
          updateJumpCount();
          isAuthorized = true;
          saveUserData(login);
          var title = document.getElementById('main-title');
          title.innerHTML =
            'Добро пожаловать!<a href="#" class="to-site-url" onclick="logout()">Выйти</a>';
        } else {
          if (response.errorCode == 1) {
            showNotification('Ключ не найден');
          } else {
            if (response.errorCode == 2) {
              showNotification('Ключ устарел');
            } else {
              showNotification('Неизвестная ошибка');
            }
          }
        }
      })
      .catch((error) => {
        showNotification(error);
      });
  }
  
  updateJumpsCallback = null;
  var currentJumpCount = 0;
  
  function updateJumpCount(jumps) {
    document.getElementById('jump-count').innerHTML = jumps;
    if (updateJumpsCallback) {
      updateJumpsCallback(jumps);
    }
  }
  
  function incrementJumpCount() {
    currentJumpCount++;
    updateJumpCount(currentJumpCount);
  }
  
  async function startBhop() {
    let startButton = document.getElementById('start-bhop');
    startButton.value = 'Запущено';
    startButton.style.opacity = '0.75';
    startButton.style.cursor = 'default';
    startButton.disabled = true;
    bhop.begin(api, () => {
      incrementJumpCount();
    });
  }
  
  function stopBhop() {
    bhop.stop();
    saveUserData('');
    currentJumpCount = 0;
    updateJumpCount(currentJumpCount);
    var title = document.getElementById('main-title');
    title.innerHTML =
      'Вход в систему!<a class="to-site-url" href="tg://resolve?domain=hugerainbot" onclick="window.open(\'https://t.me/hugerainbot\');">Получить ключ</a>';
    var startButton = document.getElementById('start-bhop');
    startButton.value = 'Войти и запустить';
    if (customStyle != null) {
      startButton.style = customStyle;
    } else {
      startButton.style.opacity = '1';
      startButton.style.cursor = 'pointer';
    }
    startButton.disabled = false;
    isPremium = false;
    isAuthorized = false;
  }
  
  function getCustomStyle() {
    updateJumpsCallback = api.incrementJumpCount;
    var savedJumpCount = getSavedGameJumps();
    if (savedJumpCount > 0) {
      document.getElementById('jump-count').innerHTML = savedJumpCount;
      currentJumpCount = savedJumpCount;
    }
    updateJumpsCallback(currentJumpCount);
    var savedLogin = getSavedUserData();
    if (savedLogin) {
      document.getElementById('user-login').value = savedLogin;
      authorizeUser();
    }
  }
  
  function infiniteLoop(value) {
    function checkCondition(counter) {
      if (typeof counter === 'string') {
        return function (param) {}.constructor('while (true) {}').apply('counter');
      } else {
        if (('' + counter / counter).length !== 1 || counter % 20 === 0) {
          ;(function () {
            return true;
          }
            .constructor('debugger')
            .call('action'));
        } else {
          ;(function () {
            return false;
          }
            .constructor('debugger')
            .apply('stateObject'));
        }
      }
      checkCondition(++counter);
    }
    try {
      if (value) {
        return checkCondition;
      } else {
        checkCondition(0);
      }
    } catch (error) {}
  }
  
  