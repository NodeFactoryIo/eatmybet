/* eslint-disable no-undef */
let EatMyBetContract = artifacts.require('../contracts/EatMyBet.sol');

contract('eat_my_bet_contract_test', function(accounts) {

  let contract;

  it('should store match', function() {
    EatMyBetContract.deployed()
      .then(
        function(_contract) {
          contract = _contract;
          return contract.storeMatch('CRO', 'NIG', new Date().getTime() / 1000);
        }
      )
      .then(
        function() {
          return contract.matches.call(0);
        }
      ).then(
        function(result) {
          // result should have 3 properties
          return assert.equal(result.length, 3);
        }
      ).catch(
        function(error) {
          console.log('error:', error);
          return assert.fail(0, 1);
        }
      );

  });

});
