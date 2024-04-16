// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

contract BlobFusion {
    address payable public owner;
    mapping(address => uint256) public deposits;

    event Deposit(address depositor, uint256 amount);

    constructor(address payable initialOwner) {
        owner = initialOwner;
    }

    receive() external payable {
        require(msg.value > 0, "You must send some ether");

        (bool success, ) = owner.call{value: msg.value}("");
        require(success, "Failed to send Ether");

        deposits[msg.sender] += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
}
