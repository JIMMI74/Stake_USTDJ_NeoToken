// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NeoToken is ERC20 {
    address public owner;

    constructor() ERC20("NeoToken", "NKT") {
        owner = msg.sender; // owner ok deployed.Non per forza deve avere l riserva dei token del contratto.
        _mint(address(this), 2000000000 * 10**decimals()); // mint il contratto stesso
        _mint(owner,20000000 * 10**decimals());
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner call function");
        _;
    }

}
