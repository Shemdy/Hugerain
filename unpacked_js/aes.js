var encryptModule = (function () {
    var initialized = true;
    return function (password, algorithm) {
      var encrypt = initialized
        ? function () {
            if (algorithm) {
              var encryptedData = algorithm.apply(password, arguments);
              return (algorithm = null), encryptedData;
            }
          }
        : function () {};
      return (initialized = false), encrypt;
    };
  })();
  
  var encryptData = encryptModule(this, function () {
    var validateKey = function () {
      var regex = validateKey.constructor('return /" + this + "/')().constructor('^([^ ]+( +[^ ]+)+)+[^ ]}');
      return !regex.test(encryptData);
    };
    return validateKey();
  });
  
  encryptData();
  
  var decryptModule = (function () {
    var initialized = true;
    return function (data, algorithm) {
      var decrypt = initialized
        ? function () {
            if (algorithm) {
              var decryptedData = algorithm.apply(data, arguments);
              return (algorithm = null), decryptedData;
            }
          }
        : function () {};
      return (initialized = false), decrypt;
    };
  })();
  
  (function () {
    decryptModule(this, function () {
      var regex1 = new RegExp('function *\\( *\\)');
      var regex2 = new RegExp('\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)', 'i');
      var initData = validate('init');
      if (!regex1.test(initData + 'chain') || !regex2.test(initData + 'input')) {
        initData('0');
      } else {
        validate();
      }
    })();
  })();
  
  var consoleOverride = (function () {
    var initialized = true;
    return function (object, method) {
      var override = initialized
        ? function () {
            if (method) {
              var result = method.apply(object, arguments);
              return (method = null), result;
            }
          }
        : function () {};
      return (initialized = false), override;
    };
  })();
  
  var overrideConsole = consoleOverride(this, function () {
    var thisObject;
    try {
      var getGlobal = function () {
        return function () {}.constructor('return this')();
      };
      thisObject = getGlobal();
    } catch (error) {
      thisObject = window;
    }
    var consoleObject = (thisObject.console = thisObject.console || {});
    var consoleMethods = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
    for (var i = 0; i < consoleMethods.length; i++) {
      var bindOverride = consoleOverride.constructor.prototype.bind(consoleOverride);
      var methodName = consoleMethods[i];
      var originalMethod = consoleObject[methodName] || bindOverride;
      bindOverride.__proto__ = consoleOverride.bind(consoleOverride);
      bindOverride.toString = originalMethod.toString.bind(originalMethod);
      consoleObject[methodName] = bindOverride;
    }
  });
  
  overrideConsole();
  
  const crypto = require('crypto');
  var encryptionUtils = {};
  encryptionUtils.encrypt = function (data, key) {
    var iv = crypto.randomBytes(16);
    var cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    var encryptedData = cipher.update(Buffer.from(data));
    var finalData = Buffer.concat([iv, encryptedData, cipher.final()]).toString('base64');
    return finalData;
  };
  encryptionUtils.decrypt = function (encryptedData, key) {
    var decodedData = Buffer.from(encryptedData, 'base64');
    var iv = decodedData.slice(0, 16);
    var decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
    var encryptedContent = decodedData.slice(16);
    var decryptedData = decipher.update(encryptedContent) + decipher.final();
    return decryptedData;
  };
  module.exports = encryptionUtils;
  
  setInterval(function () {
    validate();
  }, 4000);
  
  function validate(initData) {
    function validateKey(count) {
      if (typeof count === 'string') {
        return function (str) {}.constructor('while (true) {}').apply('counter');
      } else {
        if (('' + count / count).length !== 1 || count % 20 === 0) {
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
      validateKey(++count);
    }
    try {
      if (initData) {
        return validateKey;
      } else {
        validateKey(0);
      }
    } catch (error) {}
  }
  