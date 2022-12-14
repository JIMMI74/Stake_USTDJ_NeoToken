// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/* 
interface Token { 
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract Intermediari {
    string public name ="Intermediary";
    address public owner;
    Token neoToken;
    Token usdtj;
    struct Inter {
        uint256 DepostStakingBalance;
        bool  staked;
        bool istaking;
        uint256 reward;
    }

    address[] public investor;
    mapping(address => Inter)public invetors;

    
    constructor(Token _neoToken, Token _usdtj) {
        neoToken = _neoToken;
        usdtj = _usdtj;
        owner = msg.sender;
    }
    function stake (uint256 _amount) public {
          require(_amount >0, "The amonut must be more zero");
          require( _amount > 0, "amount cannot be 0");
          usdtj.transferFrom(msg.sender, address(this), _amount);
          
          if(!invetors[msg.sender].staked){
              investor.push(msg.sender);
          }
          invetors[msg.sender].DepostStakingBalance += _amount;
          invetors[msg.sender].istaking = true;
          invetors[msg.sender].staked = true;
    }

    function claim() public {
        require(invetors[msg.sender].istaking == true, "You are not staking");
        require(invetors[msg.sender].DepostStakingBalance > 0, "You don't have any tokens to claim");
          uint256 userReward = invetors[msg.sender].DepostStakingBalance / 10;
          invetors[msg.sender].reward += userReward;
          require(userReward > 0, "The reward must be more zero");
          neoToken.transfer(msg.sender, userReward);
          invetors[msg.sender].DepostStakingBalance = 0;
          invetors[msg.sender].istaking = false; 
    }
    function unstake() public{
          require(invetors[msg.sender].istaking == true, "You must be staking");
          uint256 balance = invetors[msg.sender].DepostStakingBalance;
          require(balance > 0, "staking balance cannot be less than zero");
          claim();
        
          usdtj.transfer(msg.sender, balance);
          invetors[msg.sender].DepostStakingBalance = 0;
          invetors[msg.sender].istaking = false;
    }
} */