import { Router } from 'express';
import Scrapper from './services/scrapper';
import EatMyBetContract from '../build/contracts/EatMyBet.json';
import cacheMiddleware from './middleware/cache-middleware';

export default () => {
  const api = Router();

  api.get('/', (req, res) => {
    res.send('You have reached backend server!');
  });

  api.get('/fixtures-01', cacheMiddleware(24 * 60 * 60), async(req, res) => {
    let ret = await Scrapper.ScrapFifa(req, res);
    res.json(ret);
  });

  api.get('/fixtures-01/get-result', cacheMiddleware(12 * 60 * 60), async(req, res) => {
    let ret = await Scrapper.ScrapFifaForResult(req, res);
    res.json(ret);
  });

  api.get('/contracts', (req, res) => {
    res.status(200).send({
      EatMyBetContract: EatMyBetContract,
    });
  });

  return api;
};
