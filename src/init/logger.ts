export enum LoggingLevel {
  NONE = 0,
  ERROR,
  WARN,
  LOG,
  DEBUG,
  TRACE,
}

export class ConsoleLogger {
  private loggingLevel: LoggingLevel = LoggingLevel.LOG;

  setLevel(level: LoggingLevel) {
    this.loggingLevel = level;
  }
  error(data: string | object) {
    return this.loggingAllowed(LoggingLevel.ERROR) && console.error(data);
  }
  warn(data: string | object) {
    return this.loggingAllowed(LoggingLevel.WARN) && console.warn(data);
  }
  log(data: string | object) {
    return this.loggingAllowed(LoggingLevel.LOG) && console.log(data);
  }
  debug(data: string | object) {
    return this.loggingAllowed(LoggingLevel.DEBUG) && console.debug(data);
  }
  trace(data: string | object) {
    return this.loggingAllowed(LoggingLevel.TRACE) && console.trace(data);
  }

  private loggingAllowed(level: LoggingLevel): boolean {
    return this.loggingLevel >= level;
  }
}

const logger = new ConsoleLogger();

export default logger;
