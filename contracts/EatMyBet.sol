pragma solidity 0.4.23;

import "zeppelin-solidity/contracts/ownership/Ownable.sol";


contract EatMyBet is Ownable {


    uint8 public constant NUM_DECIMALS = 2;

    uint public constant MIN_POOL_SIZE = 0.01 ether;

    struct Match {

        string homeTeam;

        string awayTeam;

        uint startTime;

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
                    homeTeam: _homeTeam,
                    awayTeam: _awayTeam,
                    startTime: _startTime
                }
            )
        );
    }

}

