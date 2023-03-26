import { beforeEach, describe, expect, it } from '@jest/globals';
import { ConsoleLogger, LoggingLevel } from '../../src/init/logger';

type callResponse = false | undefined;
interface CallResponses {
  error: callResponse;
  warn: callResponse;
  log: callResponse;
  debug: callResponse;
  trace: callResponse;
}

let logger: ConsoleLogger = new ConsoleLogger();

// Test the self-made logger
describe('Logger', () => {
  const checkEnabledLevels = (responses: CallResponses) => {
    expect(logger.error('')).toBe(responses.error);
    expect(logger.warn('')).toBe(responses.warn);
    expect(logger.log('')).toBe(responses.log);
    expect(logger.debug('')).toBe(responses.debug);
    expect(logger.trace('')).toBe(responses.trace);
  };

  beforeEach(() => {
    logger = new ConsoleLogger();
  });

  it('defaults to level LOG', () => {
    checkEnabledLevels({
      error: undefined,
      warn: undefined,
      log: undefined,
      debug: false,
      trace: false,
    });
  });

  it('disables and enables all logging', () => {
    logger.setLevel(LoggingLevel.NONE);
    checkEnabledLevels({
      error: false,
      warn: false,
      log: false,
      debug: false,
      trace: false,
    });
    logger.setLevel(LoggingLevel.TRACE);
    checkEnabledLevels({
      error: undefined,
      warn: undefined,
      log: undefined,
      debug: undefined,
      trace: undefined,
    });
  });
});
