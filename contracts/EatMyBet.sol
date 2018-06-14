pragma solidity 0.4.23;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract EatMyBet is Ownable {


    uint8 public constant NUM_DECIMALS = 2;

    uint public constant MIN_POOL_SIZE = 0.01 ether;

    uint public constant RESULT_DELAY = 3 hours;

    uint8 public constant RESULT_UNDEFINED = 0;

    uint public constant CANCELATION_FEE_PERCENTAGE = 10;

    uint public feePercentage = 4;

    uint private eatMyBetProfit = 0;

    event PoolCreated(uint betPoolId, uint indexed matchId, uint8 indexed bet, uint16 coef);

    event PoolFilled(uint indexed betPoolId);

    event PoolClosed(uint indexed betPoolId);

    struct Match {

        uint startTime;

        uint fifaGameId;

        string homeTeam;

        string awayTeam;

    }

    struct BetPool {

        uint8 bet;

        uint8 result;

        uint16 coef;

        uint matchId;

        uint poolSize;

        address owner;

        address[] eaters;

        mapping(address => uint) eatenAmount;

    }

    Match[] public matches;

    BetPool[] public betPools;

    modifier onlyBetOwner(uint _betPoolId) {
        require(betPools.length > _betPoolId);
        require(betPools[_betPoolId].owner == msg.sender);
        _;
    }

    function getMatchId(uint _fifaGameId) public view returns (uint){
        for (uint i = 0; i < matches.length; i++) {
            if (matches[i].fifaGameId == _fifaGameId) return i;
        }
        return 0;
    }

    function storeMatch(
        string _homeTeam,
        string _awayTeam,
        uint _fifaGameId,
        uint _startTime
    ) public onlyOwner {
        matches.push(
            Match(
                {
                startTime : _startTime,
                fifaGameId : _fifaGameId,
                homeTeam : _homeTeam,
                awayTeam : _awayTeam
                }
            )
        );
    }

    function updateMatchStartTime(
        uint _matchId, uint _startTime
    ) public onlyOwner {
        matches[_matchId].startTime = _startTime;
    }

    function setFeePercentage(uint _feePercentage) public onlyOwner {
        require(_feePercentage < 5);
        feePercentage = _feePercentage;
    }

    function withrawProfit() public payable onlyOwner {
        require(eatMyBetProfit > 0);
        uint profit = eatMyBetProfit;
        eatMyBetProfit = 0;
        owner.transfer(profit);
    }

    function getMatchCount() public view returns (uint) {
        return matches.length;
    }

    function getBetPoolCount() public view returns (uint) {
        return betPools.length;
    }

    function makeBet(uint _matchId, uint8 _bet, uint16 _coef) public payable {
        require(msg.value >= MIN_POOL_SIZE);
        require(_matchId < matches.length);
        require(_bet > 0 && _bet <= 3);
        require(_bet <= 2);
        require(_coef >= 100);
        address[] memory eaters;
        BetPool memory betPool = BetPool(_bet, RESULT_UNDEFINED, _coef, _matchId, msg.value, msg.sender, eaters);
        uint betPoolId = betPools.push(betPool) - 1;
        emit PoolCreated(betPoolId, _matchId, _bet, _coef);
    }

    function cancelBet(uint _betPoolId) public onlyBetOwner(_betPoolId) {
        BetPool storage betPool = betPools[_betPoolId];
        require(betPool.eaters.length == 0);
        uint profit = betPool.poolSize * (CANCELATION_FEE_PERCENTAGE / 100);
        eatMyBetProfit = eatMyBetProfit + profit;
        delete betPools[_betPoolId];
        emit PoolClosed(_betPoolId);
        msg.sender.transfer(betPool.poolSize - profit);
    }

    function takeBets(uint[] _betPoolIds, uint[] _amounts) public payable {
        uint totalAmount = 0;
        for (uint i = 0; i < _amounts.length; i++) {
            totalAmount = totalAmount + _amounts[i];
        }
        require(totalAmount >= msg.value);
        for (uint j = 0; j < _betPoolIds.length; j++) {
            require(_amounts[j] >= MIN_POOL_SIZE);
            BetPool storage betPool = betPools[_betPoolIds[j]];
            Match storage game = matches[betPool.matchId];
            uint remaining = getRemainingBetPoolAmount(_betPoolIds[j]);
            require(
                remaining >= (_amounts[j] * (betPool.coef / 100))
                && betPool.result == RESULT_UNDEFINED
                && now < (game.startTime - 1 hours)
            );
            betPool.eaters.push(msg.sender);
            betPool.eatenAmount[msg.sender] = _amounts[j];
            if (remaining == (_amounts[j] * (betPool.coef / 100))) {
                emit PoolFilled(_betPoolIds[j]);
            }
        }
    }

    function getBetPoolTakenBets(uint _betPoolId) public view returns (uint[]) {
        BetPool storage betPool = betPools[_betPoolId];
        uint length = betPool.eaters.length;
        uint[] memory amounts = new uint[](length);
        for (uint i = 0; i < length; i++) {
            amounts[i] = betPool.eatenAmount[betPool.eaters[i]] * (betPool.coef / 100);
        }
        return amounts;
    }

    function getBetPoolTakenAmount(uint _betPoolId) public view returns (uint) {
        uint[] memory amounts = getBetPoolTakenBets(_betPoolId);
        uint total = 0;
        for (uint i = 0; i < amounts.length; i++) {
            total = total + amounts[i];
        }
        return total;
    }

    function getBetPoolEaters(uint _betPoolId) public view returns (address[]) {
        BetPool storage betPool = betPools[_betPoolId];
        return betPool.eaters;
    }

    function claimBetRewards(uint[] _betPoolIds) public {
        for (uint i = 0; i < _betPoolIds.length; i++) {
            BetPool storage betPool = betPools[_betPoolIds[i]];
            require(betPool.owner != address(0));
            if (betPool.result == RESULT_UNDEFINED) {
                //TODO:  call oraclize
                betPool.result = 1;
            }
            uint taken = 0;
            uint profit = 0;
            if (msg.sender == betPool.owner && betPool.result == betPool.bet) {
                taken = getBetPoolTakenAmount(_betPoolIds[i]);
                require(taken > 0);
                profit = taken * (feePercentage / 100);
                betPool.owner.transfer(taken - profit);
            }
            if (msg.sender != betPool.owner && betPool.result != betPool.bet) {
                taken = betPool.eatenAmount[msg.sender] * (betPool.coef / 100);
                require(taken > 0);
                profit = taken * (feePercentage / 100);
                msg.sender.transfer(taken - profit);
            }
        }
    }

    function getRemainingBetPoolAmount(uint _betPoolId) internal view returns (uint) {
        BetPool storage betPool = betPools[_betPoolId];
        uint remaining = betPool.poolSize;
        for (uint i = 0; i < betPool.eaters.length; i++) {
            remaining -= (betPool.eatenAmount[betPool.eaters[i]] * (betPool.coef / 100));
        }
        return remaining;
    }


}

