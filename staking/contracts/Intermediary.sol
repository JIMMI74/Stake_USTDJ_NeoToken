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
/* 
    function approveToken(uint256 amount) public payable returns(bool){
        // si approva le transazioni da intemediary a msg.sender
        usdtj.approve(msg.sender,amount);
        neoToken.approve(msg.sender,amount);
        return true;
    } */

    function stake(uint256 _amount) public payable{
        require(_amount > 0, "amount cannot be 0");
        require(usdtj.balanceOf(msg.sender) >= _amount, "not enough tokens");

         //prendo dalla persona ustdj  // prendi da msg.sender e trasferisci a address(this)
        SafeERC20.safeIncreaseAllowance(usdtj, msg.sender, _amount);
        //usdtj.approve(msg.sender, _amount);
        // require(usdtj.allowance(address(this),msg.sender) >= _amount, "Ustdj: insufficient allowace. 1");
        // require(usdtj.allowance(msg.sender,address(this)) >= _amount, "Ustdj: insufficient allowace. 2");
        //SafeERC20.safeTransfer(usdtj, address(this), _amount);
        // usdtj.transfer(address(this), _amount);// da msg.sender ad addrees(this) lo prendo dalla persona che ha cha richiesto;
        SafeERC20.safeTransferFrom(usdtj, msg.sender, address(this), _amount);


        // usdtj.transferFrom(msg.sender, address(this), _amount);
        // trasferisco da intermediary a neoToken
        //SafeERC20.safeApprove(neoToken, msg.sender, _amount);

        // neoToken.approve(msg.sender, _amount);// neotoken.approve ha come msg.sender l'address di intermediary e gli passo il chiamante;
        //test di verifica su allowance
        //require(neoToken.allowance(address(this),msg.sender) >= _amount, "NeoToken: insufficient allowace. 1");

        //require(neoToken.allowance(msg.sender,address(this)) >= _amount, "NeoToken: insufficient allowace. 2");
        SafeERC20.safeTransfer(neoToken, msg.sender, _amount);
        //neoToken.transfer(msg.sender, _amount);

        //da intermediary a msg.sender//n.b qnd si usa trasferfrom bisogna fare l'approvazione dell'allowance

        // aggiungo in staking alla quantita precedente
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
         // Amount deve essere > 0
        require(balance > 0, "staking balance cannot be less than zero");
            //
         // dal intermediary  sposto  verso la persona
         // allowance[owner][spender] = amount;
         // owner msg.sender
         // spender = to msg.sender
        uint256 bonus = claim();
        uint256 balance_bonus = balance + claim(); //usdtj

        //SafeERC20.safeApprove(neoToken,msg.sender, balance); // msg.sender sara' inetermediary e gli passo il chiamante
        SafeERC20.safeTransferFrom(neoToken,msg.sender,address(this), balance);
        // neoToken.transferFrom(msg.sender, address(this), balance);


        //SafeERC20.safeApprove(usdtj,msg.sender, balance_bonus); // msg.sender sara' inetrmediary e gli passo il chiamante
        // da intermediary a sender
        SafeERC20.safeTransfer(usdtj,msg.sender,balance_bonus);
        // usdtj.transfer(msg.sender, balance_bonus);

        // TO CHECK: SE LO SMART CONTRACT ( L'ADDERESS) NON HA L'ALLOWANCE PER GESTIRE QUEL BALANCE DI neoToken ALLORA FALLIRÀ
        // trasferisco da neoToken a intermediary
        // reset staking balance
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






