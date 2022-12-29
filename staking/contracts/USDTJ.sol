// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract USDTJ is ERC20 {
    address public owner;

    constructor() ERC20("USDTJ", "UDJ") {
        owner = msg.sender;
        _mint(address(this), 2000000000 * 10**decimals());
        _mint(owner,20000000 * 10**decimals());
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner call function");
        _;
    }
}


