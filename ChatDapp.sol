//SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract ChatDapp {
    mapping(address => string) private messages;

    function sendMessage(address recipient, string memory message) public {
        messages[recipient] = message;
    }

    function getMessage() public view returns (string memory) {
        return messages[msg.sender];
    }

    function getMessageFrom(address sender) public view returns (string memory) {
        return messages[sender];
    }
}