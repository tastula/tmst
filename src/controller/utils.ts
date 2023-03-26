import assert, { AssertionError } from 'assert';
import { Request, Response } from 'express';
import logger from '../init/logger';

interface ErrorInfo {
  statusCode: number;
  message: string;
}

export const readRequestParams = (req: Request, res: Response) => {
  const dataKey = req.params.key;
  const userId = res.locals?.userId as string;
  assert(dataKey.length);
  assert(userId?.length);

  return { dataKey, userId };
};

export const handleError = (err: unknown, res: Response) => {
  let errInfo: ErrorInfo = {
    statusCode: 500,
    message: `An unexpected error: ${err as string}`,
  };

  // Override default info if the error is known
  if (err instanceof AssertionError) {
    errInfo = { statusCode: 400, message: 'Cannot read request body/params' };
  }

  logger.error(errInfo.message);
  res.status(errInfo.statusCode).send(errInfo.message);
};
