import { Request, Response, Router } from 'express';
import logger from '../init/logger';
import { toUserDataIn, UserDataIn, UserDataOut } from '../model/UserData';
import * as UserDataService from '../service/UserDataService';
import { handleError, readRequestParams } from './utils';

const getUserData = (req: Request, res: Response) => {
  try {
    logger.log(`Received a ${req.method} request for ${req.url}`);
    const params = readRequestParams(req, res);
    UserDataService.getUserData(params.dataKey, params.userId)
      .then((dto?: UserDataOut) => res.status(dto ? 200 : 204).json(dto))
      .catch((err) => handleError(err, res));
  } catch (err) {
    handleError(err, res);
  }
};

const createUserData = (req: Request, res: Response) => {
  try {
    logger.log(`Received a ${req.method} request for ${req.url}`);
    const params = readRequestParams(req, res);
    const body: UserDataIn = toUserDataIn(req);
    UserDataService.upsertUserData(
      params.dataKey,
      body.dataType,
      body.data,
      params.userId
    )
      .then(() => res.status(201).send())
      .catch((err) => handleError(err, res));
  } catch (err) {
    handleError(err, res);
  }
};

const deleteUserData = (req: Request, res: Response) => {
  try {
    logger.log(`Received a ${req.method} request for ${req.url}`);
    const params = readRequestParams(req, res);
    UserDataService.deleteUserData(params.dataKey, params.userId)
      .then(() => res.status(200).send())
      .catch((err) => handleError(err, res));
  } catch (err) {
    handleError(err, res);
  }
};

export const applyUserDataController = (): Router => {
  const router = Router();
  router.get('/:key', getUserData);
  router.post('/:key', createUserData);
  router.delete('/:key', deleteUserData);

  return router;
};
