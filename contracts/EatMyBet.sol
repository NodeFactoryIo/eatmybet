pragma solidity 0.4.23;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract EatMyBet is Ownable {


    uint8 public constant NUM_DECIMALS = 2;

    uint public constant MIN_POOL_SIZE = 0.01 ether;

    uint public constant RESULT_DELAY = 3 hours;

    struct Match {

        string homeTeam;

        string awayTeam;

        uint startTime;

    }

    struct BetPool {

        uint8 bet;

        uint8 result;

        uint16 coef;

        uint matchId;

        uint poolSize;

        address[] eaters;

        mapping(address => uint) eatenAmount;

    }

    Match[] public matches;

    function storeMatch(
        string _homeTeam,
        string _awayTeam,
        uint _startTime
    ) public payable onlyOwner {
        matches.push(
            Match(
                {
                    homeTeam : _homeTeam,
                    awayTeam : _awayTeam,
                    startTime : _startTime
                }
            )
        );
    }

    function updateMatchStartTime(
        uint _matchId, uint _startTime
    ) public payable onlyOwner {
        matches[_matchId].startTime = _startTime;
    }

    function getMatchCount() public view returns (uint) {
        return matches.length;
    }

}

