// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;
interface IPicardyDomainHub {
    function checkHubAdmin(address addr) external returns(bool);
    function addForbiddenTld(address _tldAddress, address _factoryAddress) external;
}