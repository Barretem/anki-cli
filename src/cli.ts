import * as minimist from 'minimist'

import { getPkgVersion } from './util'
import Sync from './sync/index';

export default class CLI {
  appPath: string
  constructor (appPath) {
    this.appPath = appPath || process.cwd()
  }

  run () {
    return this.parseArgs()
  }

  async parseArgs () {
    const args = minimist(process.argv.slice(2), {
      alias: {
        version: ['v'],
        help: ['h'],
        dirPath: ['p'], // 要转换的文件夹路径.
        ankiServiceUrl: ['a'], // anki connect 的地址
        rootDeckName: ['r'], // 根分组名
      },
      boolean: ['version', 'help'],
      default: {
        build: true,
      },
    })
    const _ = args._
    const command = _[0]
    if (command) {
      switch (command) {
        case 'sync': {
          const sync = new Sync({
            ankiServiceUrl: args.ankiServiceUrl,
            dirPath: args.dirPath,
            rootDeckName: args.rootDeckName,
          });
          sync.start();
          break;
        }
        default:
          break
      }
    } else {
      if (args.h) {
        console.log('Usage: anki <command> [options]')
        console.log()
        console.log('Options:')
        console.log('  -v, --version       output the version number')
        console.log('  -h, --help          output usage information')
        console.log()
        console.log('Commands:')
        console.log('  init [projectName]  Init a project with default templete')
        console.log('  config <cmd>        Anki config')
        console.log('  create              Create page for project')
        console.log('  build               Build a project with options')
        console.log('  update              Update packages of anki')
        console.log('  info                Diagnostics Anki env info')
        console.log('  doctor              Diagnose anki project')
        console.log('  inspect             Inspect the webpack config')
        console.log('  help [cmd]          display help for [cmd]')
      } else if (args.v) {
        console.log(getPkgVersion())
      }
    }
  }
}
