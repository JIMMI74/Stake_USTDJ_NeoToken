// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./NeoToken.sol";
import "./USDTJ.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";


interface Token {
    function transfer(address to, uint256 value) external returns (bool);
    function transferFrom(address from, address to, uint256 value) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract Intermediary {
    string public name = "Intermediary";
    address public owner;

    NeoToken neoToken;
    USDTJ usdtj;

    address[] public investors;



    mapping(address => uint256) public depositStakingBalance;
    mapping(address => uint256) public reward;


    mapping(address => bool) public staked;
    mapping(address => bool) public isStaking;
    event Staked(address indexed from, uint256 amount);
    event UnStaked(address indexed from, uint256 amount, uint256 reward);

    constructor(NeoToken _neoToken, USDTJ _usdtj) {
        neoToken = _neoToken;
        usdtj = _usdtj;
        owner = msg.sender;
    }


    function stake(uint256 _amount) public payable{
        require(_amount > 0, "amount cannot be 0");
        require(usdtj.balanceOf(msg.sender) >= _amount, "not enough tokens");
            
            // Method Safe from utils Library;
        
        SafeERC20.safeIncreaseAllowance(usdtj, msg.sender, _amount);
       
        //from msg.sender to addrees(this)- I take it from the person who requested it;
        SafeERC20.safeTransferFrom(usdtj, msg.sender, address(this), _amount);


        
      
        SafeERC20.safeTransfer(neoToken, msg.sender, _amount);
   
     

        // I add in staking to the previous amount
        
        depositStakingBalance[msg.sender] += _amount;

        if (!staked[msg.sender]) {
            investors.push(msg.sender);
        }

        isStaking[msg.sender] = true;
        staked[msg.sender] = true;
        emit Staked(msg.sender, _amount);
    }

    function unstake() public {
        uint256 balance = depositStakingBalance[msg.sender];
        
         //Amount must be > 0
        require(balance > 0, "staking balance cannot be less than zero");
            
       
         
         // spender = to msg.sender - from the intermediary to the user
        uint256 bonus = claim();
        uint256 balance_bonus = balance + claim(); // =>usdtj

        // msg.sender will be inetermediary and I pass it the caller
        SafeERC20.safeTransferFrom(neoToken,msg.sender,address(this), balance);
      


       
        // from intermediary to msg.sender
        SafeERC20.safeTransfer(usdtj,msg.sender,balance_bonus);
      

        
        // trasfer neoToken to intermediary
       
        depositStakingBalance[msg.sender] = 0;
        // Update Staking Status
        isStaking[msg.sender] = false;
        emit UnStaked(msg.sender, balance, bonus);
    }
    function claim() public view returns (uint256){
        uint256 userReward = depositStakingBalance[msg.sender] / 10;
        // reward  10% //balance % 10 == 0;
        return userReward;    
    }
    function getBalance(address ContractAddress ) public view returns(uint256 _amount){
        return usdtj.balanceOf(ContractAddress);
    }
     function getReward(address ContractAddress ) public view returns(uint256 _amount){
        return neoToken.balanceOf(ContractAddress);
        }
    function getStakingBalance(address ContractAddress ) public view returns(uint256 _amount){
        return depositStakingBalance[ContractAddress];
       }

}






