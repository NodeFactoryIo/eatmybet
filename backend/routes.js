import { Router } from 'express';
import Scrapper from './services/scrapper';

export default () => {
  const api = Router();

  api.get('/', (req, res) => {
    res.send('You have reached backend server!');
  });

  api.get('/fixtures-01', async(req, res) => {
    let ret = await Scrapper.ScrapFifa(req, res);
    res.json(ret);
  });

  api.get('/fixtures-01/get-result', async(req, res) => {
    let ret = await Scrapper.ScrapFifaForResult(req, res);
    res.json(ret);
  });

  return api;
};
