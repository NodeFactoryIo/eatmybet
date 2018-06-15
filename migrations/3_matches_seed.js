/* eslint-disable no-undef */
let EatMyBet = artifacts.require('./EatMyBet.sol');
const matches = require('./matches.json');

module.exports = function(deployer) {
  EatMyBet.deployed()
    .then(contract => {
      let gameIds = [];
      let startTimes = [];
      for (let i = 0; i < matches.length; i++) {
        gameIds.push(matches[i].gameId);
        startTimes.push(Math.round(new Date(matches[i].dateTime).getTime() / 1000));
      }
      contract.storeMatch(gameIds, startTimes)
        .catch(log => {
          console.log('Error ocurred while storing match: ', log);
          process.exit();
        });
    });
};
