/* eslint-disable max-len */
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import cors from 'cors';
import errorhandler from 'errorhandler';
import morgan from 'morgan';
import debug from 'debug';
import chalk from 'chalk';
import { config } from 'dotenv';
import os from 'os';
import formData from 'express-form-data';
import routes from './routes';
import util from './helpers/Utilities';

config();

const isProduction = process.env.NODE_ENV === 'production';
const app = express();
const log = debug('dev');
const port = process.env.PORT || 4000;

const options = {
  uploadDir: os.tmpdir(),
  autoClean: true
};

app.use(formData.parse(options));
app.use(formData.format());
app.use(formData.stream());
app.use(formData.union());

app.use(cors());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

/* istanbul ignore next */
if (!isProduction) app.use(errorhandler());

app.get('/', (req, res) => res.status(301).redirect('/api/v2'));

app.use('/api/v1', routes);

app.use('*', (req, res) => util.errorStat(res, 404, 'Endpoint not found'));

const setHeaders = () => (req, res, next) => {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader(
    'Access-Control-Allow-Origin',
    req.headers.origin || 'http://localhost:4000'
  );
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept'
  );
  if (req.method === 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
};

app.use(setHeaders());
/* istanbul ignore next */
app.use((err, req, res, next) => {
  if (!isProduction) log(err.stack);
  if (res.headersSent) return next(err);
  return res.status(err.status || 500).json({
    status: res.statusCode,
    error: err.message
  });
});

app.listen(port, () => log(`Listening on port ${chalk.yellow(`${port}`)}`));

export default app;
