/* eslint-disable no-undef */
let EatMyBetContract = artifacts.require('../contracts/EatMyBet.sol');

contract('eat_my_bet_contract_test', function(accounts) {

  let contract;

  function addHours(date, h) {
    date.setTime(date.getTime() + (h * 60 * 60 * 1000));
    return date;
  }

  it('should store match', function() {

    EatMyBetContract.deployed()
      .then(
        function(_contract) {
          contract = _contract;
          return contract.storeMatch(
            'CRO',
            'NIG',
            11232,
            addHours(new Date(), 2).getTime() / 1000
          );
        }
      )
      .then(
        function() {
          return contract.matches.call(0);
        }
      ).then(
      function(result) {
        // result should have 4 properties
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

    let orgStartTime = addHours(new Date(), 2).getTime() / 1000;

    EatMyBetContract.deployed()
      .then(
        function(_contract) {
          contract = _contract;
          return contract.updateMatchStartTime(
            0,
            addHours(new Date(), 4).getTime() / 1000
          );
        }
      )
      .then(
        function() {
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
            addHours(new Date(), 2).getUTCSeconds()
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
            1,
            156,
            {from: accounts[0], value: web3.toWei(0.01, 'ether')}
          );
        }
      ).then(
      function(result) {
        return contract.betPools.call(
          result.logs[0].args.betPoolId.toNumber()
        );
      }
    )
      .then(
        function(result) {
          return assert.equal(
            web3.toWei(0.01, 'ether'),
            result[4].toNumber()
          );
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
            2,
            156,
            {from: accounts[0], value: web3.toWei(0.1, 'ether')}
          );
        }
      )
      .then(
        function(result) {
          betPoolId = result.logs[0].args.betPoolId.toNumber();
          return contract.cancelBet(
            betPoolId,
            {from: accounts[0]}
          );
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

  it('should take bet', function() {
    let betPoolId;
    EatMyBetContract.deployed()
      .then(
        function(_contract) {
          contract = _contract;
          return contract.makeBet(
            1,
            1,
            176,
            {from: accounts[0], value: web3.toWei(0.1, 'ether')}
          );
        }
      )
      .then(
        function(result) {
          betPoolId = result.logs[0].args.betPoolId.toNumber();
          return contract.betPools.call(betPoolId);
        }
      )
      .then(
        function(result) {
          return contract.takeBets(
            [betPoolId],
            [web3.toWei(0.01, 'ether')],
            {from: accounts[0], value: web3.toWei(0.01, 'ether')}
          );
        }
      )
      .then(
        function() {
          return contract.getBetPoolEaters(betPoolId);
        }
      ).then(
      function(result) {
        return assert.equal(accounts[0], result[0]);
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
