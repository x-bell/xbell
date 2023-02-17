const { existsSync, readFileSync } = require('fs')
const { join } = require('path')

const { platform, arch } = process

let nativeBinding = null
let localFileExisted = false
let loadError = null

function isMusl() {
  // For Node 10
  if (!process.report || typeof process.report.getReport !== 'function') {
    try {
      const lddPath = require('child_process').execSync('which ldd').toString().trim();
      return readFileSync(lddPath, 'utf8').includes('musl')
    } catch (e) {
      return true
    }
  } else {
    const { glibcVersionRuntime } = process.report.getReport().header
    return !glibcVersionRuntime
  }
}

switch (platform) {
  case 'android':
    switch (arch) {
      case 'arm64':
        localFileExisted = existsSync(join(__dirname, 'compiler.android-arm64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./compiler.android-arm64.node')
          } else {
            nativeBinding = require('@xbell/compiler-android-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm':
        localFileExisted = existsSync(join(__dirname, 'compiler.android-arm-eabi.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./compiler.android-arm-eabi.node')
          } else {
            nativeBinding = require('@xbell/compiler-android-arm-eabi')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Android ${arch}`)
    }
    break
  case 'win32':
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(
          join(__dirname, 'compiler.win32-x64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./compiler.win32-x64-msvc.node')
          } else {
            nativeBinding = require('@xbell/compiler-win32-x64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'ia32':
        localFileExisted = existsSync(
          join(__dirname, 'compiler.win32-ia32-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./compiler.win32-ia32-msvc.node')
          } else {
            nativeBinding = require('@xbell/compiler-win32-ia32-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'compiler.win32-arm64-msvc.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./compiler.win32-arm64-msvc.node')
          } else {
            nativeBinding = require('@xbell/compiler-win32-arm64-msvc')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Windows: ${arch}`)
    }
    break
  case 'darwin':
    localFileExisted = existsSync(join(__dirname, 'compiler.darwin-universal.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./compiler.darwin-universal.node')
      } else {
        nativeBinding = require('@xbell/compiler-darwin-universal')
      }
      break
    } catch {}
    switch (arch) {
      case 'x64':
        localFileExisted = existsSync(join(__dirname, 'compiler.darwin-x64.node'))
        try {
          if (localFileExisted) {
            nativeBinding = require('./compiler.darwin-x64.node')
          } else {
            nativeBinding = require('@xbell/compiler-darwin-x64')
          }
        } catch (e) {
          loadError = e
        }
        break
      case 'arm64':
        localFileExisted = existsSync(
          join(__dirname, 'compiler.darwin-arm64.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./compiler.darwin-arm64.node')
          } else {
            nativeBinding = require('@xbell/compiler-darwin-arm64')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on macOS: ${arch}`)
    }
    break
  case 'freebsd':
    if (arch !== 'x64') {
      throw new Error(`Unsupported architecture on FreeBSD: ${arch}`)
    }
    localFileExisted = existsSync(join(__dirname, 'compiler.freebsd-x64.node'))
    try {
      if (localFileExisted) {
        nativeBinding = require('./compiler.freebsd-x64.node')
      } else {
        nativeBinding = require('@xbell/compiler-freebsd-x64')
      }
    } catch (e) {
      loadError = e
    }
    break
  case 'linux':
    switch (arch) {
      case 'x64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'compiler.linux-x64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./compiler.linux-x64-musl.node')
            } else {
              nativeBinding = require('@xbell/compiler-linux-x64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'compiler.linux-x64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./compiler.linux-x64-gnu.node')
            } else {
              nativeBinding = require('@xbell/compiler-linux-x64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm64':
        if (isMusl()) {
          localFileExisted = existsSync(
            join(__dirname, 'compiler.linux-arm64-musl.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./compiler.linux-arm64-musl.node')
            } else {
              nativeBinding = require('@xbell/compiler-linux-arm64-musl')
            }
          } catch (e) {
            loadError = e
          }
        } else {
          localFileExisted = existsSync(
            join(__dirname, 'compiler.linux-arm64-gnu.node')
          )
          try {
            if (localFileExisted) {
              nativeBinding = require('./compiler.linux-arm64-gnu.node')
            } else {
              nativeBinding = require('@xbell/compiler-linux-arm64-gnu')
            }
          } catch (e) {
            loadError = e
          }
        }
        break
      case 'arm':
        localFileExisted = existsSync(
          join(__dirname, 'compiler.linux-arm-gnueabihf.node')
        )
        try {
          if (localFileExisted) {
            nativeBinding = require('./compiler.linux-arm-gnueabihf.node')
          } else {
            nativeBinding = require('@xbell/compiler-linux-arm-gnueabihf')
          }
        } catch (e) {
          loadError = e
        }
        break
      default:
        throw new Error(`Unsupported architecture on Linux: ${arch}`)
    }
    break
  default:
    throw new Error(`Unsupported OS: ${platform}, architecture: ${arch}`)
}

if (!nativeBinding) {
  if (loadError) {
    throw loadError
  }
  throw new Error(`Failed to load native binding`)
}

const { compile } = nativeBinding

module.exports.compile = compile
