import * as fs from 'fs';
import { exec } from 'child_process'
import * as path from 'path'

export function getRootPath (): string {
  return path.resolve(__dirname, '../../')
}

export function getPkgVersion (): string {
  return require(path.join(getRootPath(), 'package.json')).version
}

export function getPkgItemByKey (key: string) {
  const packageMap = require(path.join(getRootPath(), 'package.json'))
  if (Object.keys(packageMap).indexOf(key) === -1) {
    return {}
  } else {
    return packageMap[key]
  }
}

export function printPkgVersion () {
  const ankiVersion = getPkgVersion()
  console.log(`🥝 anki v${ankiVersion}`)
  console.log()
}

export const getAllFilesInFolder = async (
  folder: string,
  filter: string[] = []
): Promise<string[]> => {
  let files: string[] = []
  const list = readDirWithFileTypes(folder)

  await Promise.all(
    list.map(async item => {
      const itemPath = path.join(folder, item.name)
      if (item.isDirectory) {
        const _files = await getAllFilesInFolder(itemPath, filter)
        files = [...files, ..._files]
      } else if (item.isFile) {
        if (!filter.find(rule => rule === item.name)) files.push(itemPath)
      }
    })
  )

  return files
}

export type TemplateSourceType = 'git' | 'url'

export function getTemplateSourceType (url: string): TemplateSourceType {
  if (/^github:/.test(url) || /^gitlab:/.test(url) || /^direct:/.test(url)) {
    return 'git'
  } else {
    return 'url'
  }
}

interface FileStat {
  name: string
  isDirectory: boolean
  isFile: boolean
}

export function readDirWithFileTypes (folder: string): FileStat[] {
  const list = fs.readdirSync(folder)
  const res = list.map(name => {
    const stat = fs.statSync(path.join(folder, name))
    return {
      name,
      isDirectory: stat.isDirectory(),
      isFile: stat.isFile()
    }
  })
  return res
}

export function clearConsole () {
  const readline = require('readline')
  if (process.stdout.isTTY) {
    const blank = '\n'.repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)
  }
}

export function execCommand (params: {
  command: string
  successCallback?: (data: string) => void
  failCallback?: (data: string) => void
}) {
  const { command, successCallback, failCallback } = params
  const child = exec(command)
  child.stdout!.on('data', function (data) {
    successCallback?.(data)
  })
  child.stderr!.on('data', function (data) {
    failCallback?.(data)
  })
}

export function getPkgNameByFilterVersion (pkgString: string) {
  const versionFlagIndex = pkgString.lastIndexOf('@')
  return versionFlagIndex === 0 ? pkgString : pkgString.slice(0, versionFlagIndex)
}
