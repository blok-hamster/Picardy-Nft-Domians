// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

interface IPicardyDomainMetadata {

  function getMetadata(string calldata _domainName, string calldata _tld, uint _tokenId, address _tldAddress) external view returns(string memory);


}