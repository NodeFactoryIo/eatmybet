/* eslint-disable no-undef */
let EatMyBetContract = artifacts.require('../contracts/EatMyBet.sol');

contract('eat_my_bet_contract_test', function(accounts) {

  let contract;

  it('should store match', function() {
    EatMyBetContract.deployed()
      .then(
        function(_contract) {
          contract = _contract;
          return contract.storeMatch(
            'CRO',
            'NIG',
            11232,
            new Date().getTime() / 1000
          );
        }
      )
      .then(
        function() {
          return contract.matches.call(0);
        }
      ).then(
        function(result) {
          // result should have 3 properties
          return assert.equal(result.length, 4);
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
        assert.notEqual(result[0].toNumber(), orgStartTime);
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
          return contract.storeMatch(
            'USA',
            'RUS',
            123314,
            new Date().getTime() / 1000
          );
        }
      )
      .then(
        function() {
          return contract.getMatchCount();
        }
      )
      .then(
        function(result) {
          const matchId = result.toNumber() - 1;
          return contract.makeBet(
            matchId,
            0,
            156,
            {from: accounts[0], value: web3.toWei(0.1, 'ether')}
          );
        }
      ).then(
        function() {
          return contract.betPools.call(0);
        }
      )
      .then(
        function(result) {
          return assert.isTrue(result != null);
        }
      )
      .catch(
        function(error) {
          console.log('error:', error);
          return assert.fail(0, 1);
        }
      );
  });

  it('should delete bet', function() {

    let betPoolId;

    EatMyBetContract.deployed()
      .then(
        function(_contract) {
          contract = _contract;
          return contract.makeBet(
            0,
            0,
            156,
            {from: accounts[0], value: web3.toWei(0.1, 'ether')}
          );
        }
      )
      .then(
        function() {
          return contract.getBetPoolCount();
        }
      )
      .then(
        function(result) {
          betPoolId = result.toNumber() - 1;
          return contract.cancelBet(betPoolId, {from: accounts[0]});
        }
      )
      .then(
        function() {
          return contract.betPools.call(betPoolId);
        }
      ).then(
        function(result) {
          return assert.isTrue(result[2].toNumber() === 0);
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
