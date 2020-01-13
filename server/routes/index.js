import express from 'express';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import userRoute from './user';
import articleRoute from './article';
import imageRoute from './image';
import util from '../helpers/Utilities';

const router = express();

const swaggerDocument = yaml.load(`${__dirname}/../docs/express-server.yml`);
router.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

router.get('/', (req, res) => util.successStat(res, 200, 'message', 'Welcome'));

router.use('/users', userRoute);
router.use('/articles', articleRoute);
router.use('/upload', imageRoute);

export default router;
