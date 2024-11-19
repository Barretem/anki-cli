/**
 * A Simple Wrapper to hold the state of our "singleton" (per extension) IVSCodeExtLogger
 * implementation.
 */
const logLevels = ["off", "fatal", "error", "warn", "info", "debug", "trace"] as const;
export type LogLevel = (typeof logLevels)[number];

class Logger {
  private logLevel: LogLevel;

  constructor(log: LogLevel) {
    this.logLevel = log;
  }

  public setLevel(level: LogLevel) {
    this.logLevel = level;
  }

  private checkLevel(input: LogLevel): boolean {
    if (logLevels.indexOf(input) <= logLevels.indexOf(this.logLevel)) {
      return true;
    }

    return false;
  }

  error(str: string) {
    if (this.checkLevel("error")) {
      console.error(`Error: ${str}`);
    }
  }

  info(str: string) {
    if (this.checkLevel("info")) {
      console.info(`Info: ${str}`);
    }
  }

  trace(str: string) {
    if (this.checkLevel("trace")) {
      console.trace(`Trace: ${str}`);
    }
  }

  dispose(): void {
    // 不做任何dispose操作
  }
}

let _logger: Logger;
let isInitialized = false;

export function getLogger(): Logger {
  if (!isInitialized) {
    _logger = new Logger("info");
    isInitialized = true;
  }
  return _logger;
}
