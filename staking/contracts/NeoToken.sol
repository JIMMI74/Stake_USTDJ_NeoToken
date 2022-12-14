// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract NeoToken is ERC20 {
    address public owner;

    constructor() ERC20("NeoToken", "NKT") {
        owner = msg.sender; // ownr ok deploy pero' non deve per forza avere l riservw dei token del contratto.
        _mint(address(this), 2000000000 * 10**decimals()); // minto il contratto stesso
        _mint(owner,20000000 * 10**decimals());
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner call function");
        _;
    }

   /*  function selfTransfer(address from, address to, uint256 amount) public virtual returns (bool) {
        _transfer(from, to, amount);
        return true;
    } */

}
