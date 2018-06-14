import { Router } from 'express';
import Scrapper from './services/scrapper';
import EatMyBetContract from '../build/contracts/EatMyBet.json';

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

  api.get('/fixtures-01/get-result', async(req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    let ret = await Scrapper.ScrapFifaForResult(req, res);
    res.json(ret);
  });

  api.get('/contracts', (req, res) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With');
    res.status(200).send({
      EatMyBetContract: EatMyBetContract,
    });
  });

  return api;
};
