/* eslint-disable no-undef */
let EatMyBet = artifacts.require('./EatMyBet.sol');
const matches = require('./matches.json');

module.exports = function(deployer) {
  // EatMyBet.deployed()
  //   .then(contract => {
  //     for (let i = 0; i < matches.length; i++) {
  //       const gameId = matches[i].gameId;
  //       const home = matches[i].homeTeamNameShort;
  //       const away = matches[i].awayTeamNameShort;
  //       const startTime = new Date(matches[i].dateTime).getTime();
  //
  //       contract.storeMatch(home, away, gameId, startTime)
  //         .catch(log => {
  //           console.log('Error ocurred while storing match: ', log);
  //           process.exit();
  //         });
  //     }
  //   });
};
