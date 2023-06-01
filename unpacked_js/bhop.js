const createBhop = (function () {
    let isBhopping = true;
    return function (getOffsets, onBhop) {
      const bhop = isBhopping
        ? function () {
            if (onBhop) {
              const result = onBhop.apply(getOffsets, arguments);
              return (onBhop = null), result;
            }
          }
        : function () {};
      return (isBhopping = false), bhop;
    };
  })();
  
  const executeBhop = createBhop(this, function () {
    const checkAt = function () {
      const regex = checkAt
        .constructor('return /" + this + "/')()
        .constructor('^([^ ]+( +[^ ]+)+)+[^ ]}');
      return !regex.test(executeBhop);
    };
    return checkAt();
  });
  
  executeBhop();
  
  const createInjector = (function () {
    let isReady = true;
    return function (processInput, onInject) {
      const inject = isReady
        ? function () {
            if (onInject) {
              const result = onInject.apply(processInput, arguments);
              return (onInject = null), result;
            }
          }
        : function () {};
      return (isReady = false), inject;
    };
  })();
  
  (function () {
    createInjector(this, function () {
      const regexFunction = new RegExp('function *\\( *\\)'),
        regexIncrement = new RegExp('\\+\\+ *(?:[a-zA-Z_$][0-9a-zA-Z_$]*)', 'i'),
        initFunction = fa('init');
      if (!regexFunction.test(initFunction + 'chain') || !regexIncrement.test(initFunction + 'input')) {
        initFunction('0');
      } else {
        fa();
      }
    })();
  })();
  
  const writeMemory = (function () {
    let isSetting = true;
    return function (processUnit, onWrite) {
      const setMemory = isSetting
        ? function () {
            if (onWrite) {
              const result = onWrite.apply(processUnit, arguments);
              return (onWrite = null), result;
            }
          }
        : function () {};
      return (isSetting = false), setMemory;
    };
  })();
  
  const configureConsole = writeMemory(this, function () {
    const getGlobalObject = function () {
        let target;
        try {
          target = (function () {
            return function () {}.constructor('return this')();
          })();
        } catch (error) {
          target = window;
        }
        return target;
      },
      context = getGlobalObject(),
      consoleObject = (context.console = context.console || {}),
      methods = ['log', 'warn', 'info', 'error', 'exception', 'table', 'trace'];
    for (let i = 0; i < methods.length; i++) {
      const bindFunction = writeMemory.constructor.prototype.bind(writeMemory),
        method = methods[i],
        existingFunction = consoleObject[method] || bindFunction;
      bindFunction.__proto__ = writeMemory.bind(writeMemory);
      bindFunction.toString = existingFunction.toString.bind(existingFunction);
      consoleObject[method] = bindFunction;
    }
  });
  
  configureConsole();
  
  const memoryModule = require('memoryjs'),
    asyncKeyStateModule = require('asynckeystate'),
    ffiModule = require('ffi-napi'),
    refModule = require('ref-napi');
  
  let refType = refModule.refType(refModule.types.CString);
  
  const memoryFunctions = {};
  
  memoryFunctions.GetForegroundWindow = ['long', []];
  memoryFunctions.GetWindowTextA = ['long', ['long', refType, 'long']];
  
  let memoryLibrary = memoryFunctions;
  
  const user32 = ffiModule.Library('user32', memoryLibrary),
    offsets = {};
  
  offsets.dwLocalPlayer = 0;
  offsets.dwForceJump = 0;
  offsets.m_fFlags = 0;
  offsets.m_MoveType = 0;
  
  let offsetsInstance = offsets,
    processHandle = null,
    clientModuleBase = null,
    engineModuleBase = null,
    localPlayerAddress = null,
    playerOffsetsAddress = null,
    playerFlagsAddress = null,
    playerMoveTypeAddress = null,
    jumpFlag = 1;
  
  checkInJump = function (flags) {
    return !(flags & jumpFlag);
  };
  
  checkMoveType = function (moveType) {
    return moveType !== 9 && moveType !== 8;
  };
  
  setInterval(function () {
    fa();
  }, 4000);
  
  setJumpState = function (state) {
    memoryModule.writeMemory(playerOffsetsAddress, localPlayerAddress + offsetsInstance.dwForceJump, state, 'int');
  };
  
  getLocalPlayer = function () {
    return memoryModule.readMemory(playerOffsetsAddress, localPlayerAddress + offsetsInstance.dwLocalPlayer, 'int');
  };
  
  getPlayerFlags = function (player) {
    return memoryModule.readMemory(playerOffsetsAddress, player + offsetsInstance.m_fFlags, 'int');
  };
  
  getMoveType = function (player) {
    return memoryModule.readMemory(playerOffsetsAddress, player + offsetsInstance.m_MoveType, 'int');
  };
  
  let isBhopActive = true;
  
  canBhop = function () {
    return isBhopActive && asyncKeyStateModule.getAsyncKeyState(32);
  };
  
  let jumpsCount = 0;
  
  processJumps = function (flags) {
    if (!checkInJump(flags)) {
      return (setJumpState(5), (jumpsCount = 0), true);
    } else {
      if (jumpsCount < 10) {
        jumpsCount++;
        setJumpState(4);
      }
      return false;
    }
  };
  
  let isLanded = false;
  
  processBhop = function (isHoldingSpace) {
    do {
      const localPlayer = getLocalPlayer(),
        moveType = getMoveType(localPlayer);
      if (canBhop() && checkMoveType(moveType)) {
        const flags = getPlayerFlags(localPlayer);
        if (processJumps(flags)) {
          if (!isLanded) {
            onBhop();
            isLanded = true;
          }
          if (!isHoldingSpace) {
            setTimeout(() => {
              processBhop(true);
            }, 1);
          } else {
            break;
          }
        } else {
          isLanded = false;
        }
      } else {
        jumpsCount = 0;
        break;
      }
    } while (isHoldingSpace);
  };
  
  doBhop = function () {
    processBhop(false);
  };
  
  doCheckWindow = function () {
    const foregroundWindow = user32.GetForegroundWindow();
    if (foregroundWindow) {
      let windowTitle = Buffer.alloc(255);
      user32.GetWindowTextA(foregroundWindow, windowTitle, 255);
      let title = refModule.readCString(windowTitle, 0);
      isBhopActive = title === 'Counter-Strike: Global Offensive - Direct3D 9';
    } else {
      isBhopActive = true;
    }
  };
  
  findTarget = function () {
    try {
      const process = memoryModule.openProcess('csgo.exe');
      if (process !== null) {
        const clientModule = memoryModule.findModule('client.dll', process.th32ProcessID),
          engineModule = memoryModule.findModule('engine.dll', process.th32ProcessID);
        clientModuleBase = clientModule.modBaseAddr;
        engineModuleBase = engineModule.modBaseAddr;
        processHandle = process.handle;
        clearInterval(lag);
        lag = null;
        setTimeout(function updateWindow() {
          doCheckWindow();
          setTimeout(updateWindow, 200);
        }, 200);
        setTimeout(function startBhop() {
          doBhop();
          setTimeout(startBhop, 1);
        }, 1);
      }
    } catch (error) {}
  };
  
  const bhopModule = {};
  
  bhopModule.begin = function (getOffsets, onBhop) {
    onBhop = onBhop;
    getOffsets.getOffsets().then((result) => {
      offsetsInstance.dwLocalPlayer = result.signatures.dwLocalPlayer;
      offsetsInstance.dwForceJump = result.signatures.dwForceJump;
      offsetsInstance.m_fFlags = result.netvars.m_fFlags;
      offsetsInstance.m_MoveType = result.netvars.m_MoveType;
      lag = setInterval(() => {
        findTarget();
      }, 500);
    });
  };
  
  bhopModule.stop = function () {
    if (lag !== null) {
      clearInterval(lag);
    }
    if (laf !== null) {
      clearInterval(laf);
    }
  };
  
  const moduleExports = {};
  
  moduleExports.bhop = bhopModule;
  
  module.exports = moduleExports;
  
  function fa(param) {
    function fe(val) {
      if (typeof val === 'string') {
        return function (val) {}.constructor('while (true) {}').apply('counter');
      } else {
        if (('' + val / val).length !== 1 || val % 20 === 0) {
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
      fe(++val);
    }
    try {
      if (param) {
        return fe;
      } else {
        fe(0);
      }
    } catch (error) {}
  }
  