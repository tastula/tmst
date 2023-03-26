import expressApp from './init/express';
import logger from './init/logger';

const port = 4000;

expressApp.listen(port, () => {
  logger.log(`Started listening on port ${port}`);
});
