// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Counter {
    uint256 public count = 0;

    function readCount() external view returns (uint256 cnt) {
        cnt = count;
    }

    function writeCount() external returns (uint256 nextCnt) {
        count += 1;
        nextCnt = count;
    }
}
