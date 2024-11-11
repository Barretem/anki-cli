import * as minimist from 'minimist'

import { getPkgVersion } from './util'

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
        port: ['p'],
        resetCache: ['reset-cache'], // specially for rn, Removes cached files.
        publicPath: ['public-path'], // specially for rn, assets public path.
        bundleOutput: ['bundle-output'], // specially for rn, File name where to store the resulting bundle.
        sourcemapOutput: ['sourcemap-output'], // specially for rn, File name where to store the sourcemap file for resulting bundle.
        sourceMapUrl: ['sourcemap-use-absolute-path'], // specially for rn, Report SourceMapURL using its full path.
        sourcemapSourcesRoot: ['sourcemap-sources-root'], // specially for rn, Path to make sourcemaps sources entries relative to.
        assetsDest: ['assets-dest'], // specially for rn, Directory name where to store assets referenced in the bundle.
        envPrefix: ['env-prefix'],
      },
      boolean: ['version', 'help', 'disable-global-config'],
      default: {
        build: true,
      },
    })
    const _ = args._
    const command = _[0]
    if (command) {
      switch (command) {
        case 'build': {
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
