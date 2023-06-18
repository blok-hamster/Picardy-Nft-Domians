// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;

interface IDomainImageContract {
    function _getImage1(string memory _fullDomainName) external view returns(string memory);
    function _getImage2(string memory _fullDomainName) external view returns(string memory);
}