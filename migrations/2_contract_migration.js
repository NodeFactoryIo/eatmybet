/* eslint-disable no-undef */
let EatMyBet = artifacts.require('./EatMyBet.sol');

module.exports = function(deployer, network, accounts) {
  deployer.deploy(EatMyBet, network, {from: accounts[0], value: web3.toWei(1, 'ether')});
};
