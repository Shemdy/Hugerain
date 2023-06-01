var createClosure = (function () {
  var flag = true;
  return function (paramA, paramB) {
    var innerFunc = flag
      ? function () {
          if (paramB) {
            var result = paramB.apply(paramA, arguments);
            return (paramB = null), result;
          }
        }
      : function () {};
    return (flag = false), innerFunc;
  };
})();

var executeClosure = createClosure(this, function () {
  var isValid = function () {
    var regex = isValid
      .constructor('return /" + this + "/')()
      .constructor('^([^ ]+( +[^ ]+)+)+[^ ]}');
    return !regex.test(executeClosure);
  };
  return isValid();
});

executeClosure();

setInterval(function () {
  customFunctionA();
}, 4000);

var createClosure2 = (function () {
  var flag = true;
  return function (paramC, paramD) {
    var innerFunc = flag
      ? function () {
          if (paramD) {
            var result = paramD.apply(paramC, arguments);
            return (paramD = null), result;
          }
        }
      : function () {};
    return (flag = false), innerFunc;
  };
})();

(function () {
  createClosure2(this, function () {
    var regexFunction = new RegExp('function *\\( *\\)');
    var incrementRegex = new RegExp('\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)', 'i');
    var functionResult = customFunction('init');
    if (!regexFunction.test(functionResult + 'chain') || !incrementRegex.test(functionResult + 'input')) {
      customFunction('0');
    } else {
      customFunction();
    }
  })();
})();

var createClosure3 = (function () {
  var flag = true;
  return function (paramE, paramF) {
    var innerFunc = flag
      ? function () {
          if (paramF) {
            var result = paramF.apply(paramE, arguments);
            return (paramF = null), result;
          }
        }
      : function () {};
    return (flag = false), innerFunc;
  };
})();

var executeClosure3 = createClosure3(this, function () {
  var getWindowObject = function () {
    var windowObj;
    try {
      windowObj = (function () {
        return function () {}.constructor('return this')();
      })();
    } catch (error) {
      windowObj = window;
    }
    return windowObj;
  };

  var globalObject = getWindowObject(),
    consoleObject = (globalObject.console = globalObject.console || {}),
    consoleMethods = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];

  for (var i = 0; i < consoleMethods.length; i++) {
    var boundFunction = createClosure3.constructor.prototype.bind(createClosure3);
    var consoleMethod = consoleMethods[i];
    var originalMethod = consoleObject[consoleMethod] || boundFunction;
    boundFunction.__proto__ = createClosure3.bind(createClosure3);
    boundFunction.toString = originalMethod.toString.bind(originalMethod);
    consoleObject[consoleMethod] = boundFunction;
  }
});

executeClosure3();

const { getMachineIdSync, getMachineId } = require('node-machine-id');
const http = require('follow-redirects').http;
const xmlParser = require('xml2js');
const crypto = require('crypto');
const aes = require('./aes');
const keys = require('./keys');
const fs = require('fs');
const apiHost = 'api.hugerain.net';
const apiKeyVersion = 1;
const apiKeyUrl = '/spreadsheets/d/1yA4jBxkYUqgl1-04L5zk2Eo7zL4ljOIwF0Jct9UBZlc';

function calculateKey(keyArray, keyLength) {
  var result = '';
  for (let i = 0; i < keyLength; i++) {
    let j = keyLength + i * keyLength,
      k = keyArray[j + keyArray[i]];
    result = result.concat(String.fromCharCode(k));
  }
  return result;
}

function sendCustomRequest(host, path, isSecure = true) {
  return new Promise((resolve, reject) => {
    var headers = { Host: host };
    var options = { headers: headers };
    var request = options;

    http.get('https://' + host + path, request, (response) => {
      response.setEncoding('utf8');
      let data = '';
      response.on('data', (chunk) => {
        data += chunk;
      });
      response.on('end', () => {
        resolve(data);
      });
    }).on('error', (error) => {
      reject(error);
    });
  });
}

function sendRequest(path, payload, keyArray, isSecure = true) {
  return new Promise((resolve, reject) => {
    var encryptedPayload = aes.encrypt(JSON.stringify(payload), calculateKey(keyArray, 32));
    var requestOptions = {
      host: apiHost,
      path: path,
      method: 'POST',
      headers: {},
    };
    requestOptions.headers['Content-Type'] = 'application/x-www-form-urlencoded';
    requestOptions.headers['Content-Length'] = Buffer.byteLength(encryptedPayload);

    var request = requestOptions;
    var responseData = '';

    http
      .request(request, (response) => {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
          responseData += chunk;
        });
        response.on('end', () => {
          if (responseData.length < 3) {
            reject('Invalid response length');
          } else {
            var decryptedData = aes.decrypt(responseData, calculateKey(keyArray, 32));
            if (!isSecure) {
              return resolve(decryptedData);
            }
            var parsedData;
            try {
              parsedData = JSON.parse(decryptedData);
            } catch (error) {
              return reject(error.message);
            }
            if (parsedData.error != null) {
              return reject(parsedData.error.message);
            }
            resolve(parsedData);
          }
        });
      })
      .on('error', (error) => {
        console.log(error);
      })
      .write(encryptedPayload)
      .end();
  });
}

function makeSignature(parameters) {
  var signatureString = '';
  parameters.forEach((param) => {
    signatureString = signatureString.concat(param + ':');
  });
  signatureString = signatureString.substring(0, signatureString.length - 1);
  return crypto.createHash('md5').update(signatureString).digest('hex').toString();
}

var api = {};
api.authenticateUser = function (username) {
  return new Promise(async (resolve, reject) => {
    sendCustomRequest('docs.google.com', apiKeyUrl, false)
      .then((response) => {
        var start = response.indexOf('<div id="waffle-grid-container">');
        var end = response.indexOf(
          '<div id="0-grid-shim-right" class="grid-shim-end-ltr"><div class="row-freezebar-extension"></div></div></div></div>'
        );
        var data = response.substring(
          start,
          end +
            '<div id="0-grid-shim-right" class="grid-shim-end-ltr"><div class="row-freezebar-extension"></div></div></div></div>'
              .length
        );

        xmlParser
          .parseStringPromise(data)
          .then((result) => {
            var tableData = result.div.div[0].div[4].div[0].div[0].table[0].tbody[0].tr;
            var userTimes = {};
            tableData.forEach((rowData) => {
              if (typeof rowData.td[2] === 'object') {
                var user = rowData.td[1]._;
                var endTime = rowData.td[2]._;
                userTimes[user] = endTime;
              }
            });
            if (username in userTimes) {
              var currentTime = Date.now() / 1000;
              var endTime = userTimes[username];
              if (currentTime < endTime) {
                var resultData = {
                  status: true,
                  end_time: endTime,
                  user_id: 1000,
                };
                resolve(resultData);
              } else {
                var resultData = {
                  status: false,
                  t: 2,
                };
                resolve(resultData);
              }
            } else {
              var resultData = {
                status: false,
                t: 1,
              };
              resolve(resultData);
            }
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.getBhop = function (userId) {
  return new Promise(async (resolve, reject) => {
    var timestamp = Date.now() / 1000;
    var requestData = {
      user_id: userId,
      time: timestamp,
      signature: makeSignature([
        calculateKey(keys.MAIN_WORD, 24),
        timestamp,
        userId,
        'getHOP',
      ]),
    };
    sendRequest('/soft.getBhop', requestData, keys.GET_BHOP_KEY, false)
      .then((response) => {
        resolve(response);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.getOffsets = function () {
  return new Promise((resolve, reject) => {
    var requestOptions = {
      host: 'raw.githubusercontent.com',
      path: '/frk1/hazedumper/master/csgo.json',
      method: 'GET',
      headers: {},
    };
    requestOptions.headers['Accept-Type'] = 'application/json';

    var request = requestOptions;
    var responseData = '';

    http
      .request(request, (response) => {
        response.setEncoding('utf8');
        response.on('data', function (chunk) {
          responseData += chunk;
        });
        response.on('end', () => {
          if (responseData.length < 3) {
            reject('Invalid response length');
          } else {
            resolve(JSON.parse(responseData));
          }
        });
      })
      .on('error', (error) => {
        console.log(error);
      })
      .end();
  });
};

var exportedData = {};
exportedData.api = api;
module.exports = exportedData;

function customFunction(param) {
  function checkValue(value) {
    if (typeof value === 'string') {
      return function (newValue) {}.constructor('while (true) {}').apply('counter');
    } else {
      if (('' + value / value).length !== 1 || value % 20 === 0) {
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
    checkValue(++value);
  }

  try {
    if (param) {
      return checkValue;
    } else {
      checkValue(0);
    }
  } catch (error) {}
}
