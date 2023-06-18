// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.9;

import "base64-sol/base64.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import {IPicardyDomain} from "../interface/IPicardyDomain.sol";
import {IDomainImageContract} from "../interface/IDomainImageContract.sol";

/// @title Picardy Domain Meta Data contract
/// @author @blok_hamster
/// @notice Contract that stores metadata picardy domain.
contract PicardyDomainMetadata is Context {
  mapping (address => string) public descriptions; // TLD-specific descriptions, mapping(tldAddress => description)
  bytes[] public images; // TLD-specific images, mapping(tldAddress => image)

  // EVENTS
  event DescriptionChanged(address indexed user, string description);

  // READ
  function getMetadata(string calldata _domainName, string calldata _tld, uint tokenId, address _tldAddress) public view returns(string memory) {
    address _imageAddress = IPicardyDomain(_tldAddress).getImageAddress();
    require(_imageAddress != address(0), "image address cannot be address zero(0)");
    string memory fullDomainName = string(abi.encodePacked(_domainName, _tld));

    if (tokenId % 2 == 0){
          return string(
      abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(abi.encodePacked(
        '{"name": "', fullDomainName, '", ',
        '"description": "', descriptions[_tldAddress], '", ',
        '"image": "', IDomainImageContract(_imageAddress)._getImage1(fullDomainName), '"}'))))
    );
    } else {
      return string(
      abi.encodePacked("data:application/json;base64,", Base64.encode(bytes(abi.encodePacked(
        '{"name": "', fullDomainName, '", ',
        '"description": "', descriptions[msg.sender], '", ',
        '"image": "', IDomainImageContract(_imageAddress)._getImage2(fullDomainName), '"}'))))
    );
    }
  }

  /// @notice Only owner can call this function.
  function changeDescription(address _tldAddress, string calldata _description) external {
    address _owner = IPicardyDomain(_tldAddress).getOwner();
    require(_owner == _msgSender(), "Not Tld Owner");
    descriptions[_tldAddress] = _description;
    emit DescriptionChanged(msg.sender, _description);
  }

}

interface IPicardyDomainMetadata {

  function getMetadata(string calldata _domainName, string calldata _tld) external view returns(string memory);


}