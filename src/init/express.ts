import express from 'express';
import { applyUserDataController } from '../controller/UserDataController';
import { authenticateUser } from '../middleware/authentication';

const expressApp = express();
const apiPath = '/api/v1';

// Add security by stopping technology information leak
expressApp.disable('x-powered-by');
// Middleware
expressApp.use(express.json());
expressApp.use(authenticateUser);
// Controllers
expressApp.use(`${apiPath}/userData`, applyUserDataController());

export default expressApp;
