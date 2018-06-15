import express from 'express';
import routes from './routes';
import cors from 'cors';

const corsOptions = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  preflightContinue: false,
  optionsSuccessStatus: 200,
};

const app = express();
app.use(cors(corsOptions));

const initApp = async() => {
  app.use('/', routes());
  return app;
};

const bindApp = async(appToBind) => {
  const port = process.env.DEPLOY_PORT || 3000;

  appToBind.listen(port, () => {
    console.log(`Express Listening at http://localhost:${port}`);
  });
};


export {
  initApp,
  bindApp,
};
