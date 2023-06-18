// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

interface IPicardyDomainResolver {
 
  function addHubAddress(address _hubAddress) external; 

  function getDefaultDomain(address _addr, string calldata _tld) external view returns(string memory);

  function getDefaultDomains(address _addr) external view returns(string memory);

  /// @notice domain resolver
  function getDomainHolder(string calldata _domainName, string calldata _tld) external view returns(address); 

  /// @notice fetch domain metadata for a given domain (tokenURI)
  function getDomainTokenUri(string calldata _domainName, string calldata _tld) external view returns(string memory);

  function getFactoriesArray() external view returns(address[] memory);

  /// @notice reverse resolver: get single user's default name, the first that comes (all TLDs)
  function getFirstDefaultDomain(address _addr) external view returns(string memory);

  /// @notice get the address of a given TLD name
  function getTldAddress(string calldata _tldName) external view returns(address);

  /// @notice get the address of the factory contract through which a given TLD was created
  function getTldFactoryAddress(string calldata _tldName) external view returns(address);

  /// @notice get a stringified CSV of all active TLDs (name,address) across all factories
  function getTlds() external view returns(string memory);

}