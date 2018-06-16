/* eslint-disable no-undef */
let EatMyBetContract = artifacts.require('../contracts/EatMyBet.sol');

contract('eat_my_bet_contract_test', function(accounts) {

  let contract;

  function addHours(date, h) {
    date.setTime(date.getTime() + (h * 60 * 60 * 1000));
    return date;
  }

  it('should store match', function() {

    const startTime = Math.round(addHours(new Date(), 2).getTime() / 1000);

    EatMyBetContract.deployed()
      .then(
        function(_contract) {
          contract = _contract;
          return contract.storeMatch(
            [123],
            [startTime]
          );
        }
      )
      .then(
        function() {
          return contract.matchStartTimes.call(123);
        }
      ).then(
        function(result) {
        // result should have 4 properties
          return assert.equal(result.toNumber(), startTime);
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
          return contract.storeMatch(
            [124],
            [orgStartTime]
          );
        }
      )
      .then(function() {
        return contract.updateMatchStartTime(
          124,
          addHours(new Date(), 4).getTime() / 1000
        );
      })
      .then(
        function() {
          return contract.matchStartTimes.call(124);
        }
      ).then(function(result) {
        assert.notEqual(result.toNumber(), orgStartTime);
      })
      .catch(
        function(error) {
          console.log('error:', error);
          return assert.fail(0, 1);
        }
      );

  });

  it('should set fee percentage', function() {
    EatMyBetContract.deployed()
      .then(function(_contract) {
        contract = _contract;
        return contract.feePercentage();
      })
      .then(function(result) {
        assert.equal(result.toNumber(), 4);
        return contract.setFeePercentage(3);
      })
      .then(function() {
        return contract.feePercentage();
      })
      .then(function(result) {
        return assert.equal(result.toNumber(), 3);
      })
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
            [125],
            [addHours(new Date(), 2).getUTCSeconds()]
          );
        }
      )
      .then(
        function() {
          return contract.makeBet(
            125,
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
            result[5].toNumber()
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
            125,
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
        function(result) {
          assert.equal(result.logs[0].event, 'PoolClosed');
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
            125,
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
        function() {
          return contract.takeBets(
            [betPoolId],
            [web3.toWei(0.01, 'ether')],
            {from: accounts[0], value: web3.toWei(0.01, 'ether')}
          );
        }
      )
      .then(
        function(result) {
          assert.equal(result.logs[0].event, 'BetTaken');
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

  it('should fill pool', function() {
    let betPoolId;
    EatMyBetContract.deployed()
      .then(
        function(_contract) {
          contract = _contract;
          return contract.makeBet(
            125,
            1,
            200,
            {from: accounts[0], value: web3.toWei(0.1, 'ether')}
          );
        }
      )
      .then(
        function(result) {
          betPoolId = result.logs[0].args.betPoolId.toNumber();
          return contract.takeBets(
            [betPoolId],
            [web3.toWei(0.025, 'ether')],
            {from: accounts[1], value: web3.toWei(0.025, 'ether')}
          );
        }
      )
      .then(
        function() {
          return contract.takeBets(
            [betPoolId],
            [web3.toWei(0.025, 'ether')],
            {from: accounts[2], value: web3.toWei(0.025, 'ether')}
          );
        }
      )
      .then(
        function(result) {
          assert.equal(result.logs[0].event, 'BetTaken');
          return assert.equal(result.logs[1].event, 'PoolFilled');
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
