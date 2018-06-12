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

  it('should update match start time', function() {

    let orgStartTime = new Date().getTime() / 1000;

    EatMyBetContract.deployed()
      .then(
        function(_contract) {
          contract = _contract;
          return contract.updateMatchStartTime(0, (new Date() + 30) / 1000);
        }
      )
      .then(
        function() {
        // result should have 3 properties
          return contract.matches.call(0);
        }
      ).then(function(result) {
        assert.notEqual(result[2].toNumber(), orgStartTime);
      })
      .catch(
        function(error) {
          console.log('error:', error);
          return assert.fail(0, 1);
        }
      );

  });

  it('should obtain total match count', function() {
    EatMyBetContract.deployed()
      .then(
        function(_contract) {
          contract = _contract;
          return contract.getMatchCount();
        }
      )
      .then(
        function(result) {
          return assert.equal(result.toNumber(), 1);
        }
      )
      .catch(
        function(error) {
          console.log('error:', error);
          return assert.fail(0, 1);
        }
      );

  });

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
