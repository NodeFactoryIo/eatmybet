import { Router } from 'express';
import Scrapper from './services/scrapper';

export default () => {
  const api = Router();

  api.get('/', (req, res) => {
    res.send('You have reached backend server!');
  });

  api.get('/fixtures-01', async(req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    
    let ret = await Scrapper.ScrapFifa(req, res);
    res.json(ret);
  });

  return api;
};
