import { NextFunction, Request, Response } from 'express';
import { verify, VerifyOptions } from 'jsonwebtoken';
import logger from '../init/logger';

export const authenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const handleError = (statusCode: number, message: string) => {
    logger.error(message);
    res.status(statusCode).send(message);
  };

  const authHeader: string | undefined = req.headers['authorization'];
  const publicToken: string | undefined = authHeader?.split(' ')[1];
  if (!publicToken) {
    handleError(401, 'Missing JWT token');
    return;
  }

  const privateToken: string = process.env.PRIVATE_TOKEN as string;
  const options: VerifyOptions & { complete: false } = {
    algorithms: ['HS256'],
    complete: false,
  };
  verify(publicToken, privateToken, options, (err, payload) => {
    if (typeof payload !== 'object' || err) {
      handleError(403, 'Cannot read JWT payload');
    } else if (!payload.userId || typeof payload.userId !== 'string') {
      handleError(403, 'Cannot read userId property from JWT');
    } else {
      res.locals.userId = payload.userId;
      next();
    }
  });
};
