/* eslint-disable no-undef */
let EatMyBetContract = artifacts.require('../contracts/EatMyBet.sol');

contract('eat_my_bet_contract_test', function(accounts) {

  let contract;

  it('should make bet', function() {
    EatMyBetContract.deployed()
      .then(
        function(_contract) {
          contract = _contract;
          return contract.storeMatch('CRO', 'RUS', new Date().getTime() / 1000);
        }
      )
      .then(
        function(result) {
          const matchId = result.toNumber();
          return contract.makeBet(matchId, 0, 156);
        }
      ).then(
        function() {
          // result should have 3 properties
          return contract.betPools.call(0);
        }
      )
      .then(
        function(result) {
          assert.isTrue(result != null);
        }
      )
      .catch(
        function(error) {
          console.log('error:', error);
          return assert.fail(0, 1);
        }
      );

  });

});
