/* eslint-disable no-undef */
let EatMyBet = artifacts.require('./EatMyBet.sol');

module.exports = function(deployer) {
  deployer.deploy(EatMyBet);
};
