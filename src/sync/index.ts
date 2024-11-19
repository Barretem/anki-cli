
import * as ora from 'ora';
import * as chalk from 'chalk';
import { join } from 'path';
import { existsSync, readdirSync, statSync } from 'fs';
import { DEFAULT_DIRNAME_PATH, DEFAULT_ANKI_SERVICE_URL, DEFAULT_DECK_NAME } from '../util/constant';
import getVersion from '../services/getVersion';
import { Transformer } from "./markdown/transformer";
import { MarkdownFile } from "./models/MarkdownFile";
import { initState } from './state';
import { DeckNameStrategy } from './markdown/serializer';
import { initAnkiService }  from './AnkiService';

interface ModuleOptions {
  /** anki connect 的地址 */
  ankiServiceUrl?: string;
  /** 要转换的文件夹路径 */
  dirPath: string;
  /** 根分组名 */
  rootDeckName: string;
}

export default class Index {
  public conf: ModuleOptions
  constructor(options?: ModuleOptions) {
    this.conf = options || {
      ankiServiceUrl: DEFAULT_ANKI_SERVICE_URL,
      dirPath: DEFAULT_DIRNAME_PATH,
      rootDeckName: DEFAULT_DECK_NAME
    };
  }

  async start() {
    // 1. 检查anki链接是否成功
    try {
      await getVersion() ;
    } catch (error) {
      console.log(chalk.red(`❌ anki connect 链接失败，请检查链接是否正确`));
      process.exit(1);
    }
    // 2. 检查文件夹是否存在
    const dirPath = join(process.cwd(), this.conf.dirPath);
    if (!existsSync(dirPath)) {
      console.log(chalk.red(`❌ 文件夹不存在，请检查文件夹路径是否正确`));
      process.exit(1);
    }
    // 2. 将MD文件的路径取出来
    const mdFilePathList: string[] = [];
    function readDirectoryRecursively(dirPath) {
      const files = readdirSync(dirPath);
      files.forEach(file => {
        const fullPath = join(dirPath, file);
        const stat = statSync(fullPath);
        if (stat.isDirectory()) {
          readDirectoryRecursively(fullPath); // 递归遍历子目录
        } else {
          if (file.endsWith('.md')) {
            mdFilePathList.push(fullPath);
          }
        }
      });
    }
    readDirectoryRecursively(dirPath);
    // 3. 如果没有MD文件，就退出
    if (mdFilePathList.length === 0) {
      console.log(chalk.red(`❌ 文件夹中没有MD文件，请检查文件夹路径是否正确`));
      process.exit(1);
    }
    // 4. 注册 anki 服务
    initAnkiService(this.conf.ankiServiceUrl || DEFAULT_ANKI_SERVICE_URL);
    initState();
    // 5. 遍历文件夹中的MD文件，将其转换推送到Anki
    for(let filePath of mdFilePathList) {
      const spinner = ora(`syncing ${filePath} to anki`).start();
      spinner.color ='green'
      const rootDeckName = this.conf.rootDeckName;
      await new Transformer(MarkdownFile.fromActiveTextEditor(filePath ?? '.'), DeckNameStrategy.ParseDirStru, filePath, dirPath, rootDeckName).transform().catch((err) => {
        spinner.color ='red'
        const errorMsg = `sync ${filePath} to anki failed!`
        spinner.fail(`${chalk.grey(errorMsg)}`);
        throw err
      });
      const successMsg = `sync ${filePath} to anki success!`
      spinner.succeed(`${chalk.green(successMsg)}`);
    }
  }
}
