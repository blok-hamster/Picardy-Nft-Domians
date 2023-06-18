// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

import "../lib/strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IForbiddenTlds} from "../interface/IForbiddenTlds.sol";
import {IPicardyDomainHub} from "../interface/IPicardyDomainHub.sol";
import {IPicardyDomainFactory} from "../interface/IPicardyDomainFactory.sol";
import {IPicardyDomainSBT} from "../interface/IPicardyDomainSBT.sol";
import "./PicardyDomainSBT.sol";

/// @title Picardy Domain Factory
/// @author Blok_hamster
/// @notice Factory contract dynamically new domain contracts.
contract PicardyDomainSBTFactory is IPicardyDomainFactory, ReentrancyGuard, Context{
  using strings for string;

  event RequestSent(uint256 requestId);

  struct RandDetails{
    uint256[] randomNumbers;
    bytes32 nullifier;
  }

  string[] public tlds; // existing TLDs
  mapping (string => address) public override tldNamesAddresses; // a mapping of TLDs (string => TLDaddress)
  mapping(uint => RandDetails) private s_randDetails; 

  address public forbiddenTlds; // address of the contract that stores the list of forbidden TLDs
  address public metadataAddress; // default FlexiPunkMetadata address
  
  uint256 public price; // price for creating a new TLD
  uint256 public royalty = 0; // royalty for creating a new TLD in percentage
  bool public buyingEnabled = false; // buying TLDs enabled (true/false)
  uint256 public nameMaxLength = 40; // the maximum length of a TLD name

  event TldCreated(address indexed user, address indexed owner, string tldName, address tldAddress);
  event ChangeTldPrice(address indexed user, uint256 tldPrice);

    modifier onlyHubAdmin{
    _isHubAdmain();
    _;
  }

  IPicardyDomainHub public domainHub;
  address royaltyAddress;
  address randomNumberAddress;
  address linkToken;

  constructor(
    uint256 _price, 
    address _forbiddenTlds,
    address _metadataAddress,
    address _domainHub,
    address _royaltyAddress
  ) {
    price = _price;
    forbiddenTlds = _forbiddenTlds;
    metadataAddress = _metadataAddress;
    domainHub = IPicardyDomainHub(_domainHub);
    royaltyAddress = _royaltyAddress;
  }

  // READ
  function getTldsArray() public override view returns(string[] memory) {
    return tlds;
  }

  function _validTldName(string memory _name) view internal {
    require(strings.len(strings.toSlice(_name)) > 1, "TLD too short"); // at least two chars, which is a dot and a letter
    require(bytes(_name).length < nameMaxLength, "TLD too long");
    require(strings.count(strings.toSlice(_name), strings.toSlice(".")) == 1, "Name must have 1 dot");
    require(strings.count(strings.toSlice(_name), strings.toSlice(" ")) == 0, "Name must have no spaces");
    require(strings.startsWith(strings.toSlice(_name), strings.toSlice(".")) == true, "Name must start with dot");

    IForbiddenTlds forbidden = IForbiddenTlds(forbiddenTlds);
    require(forbidden.isTldForbidden(_name) == false, "TLD already exists or forbidden");
  }

  // WRITE

  /// @notice Create a new top-level domain contract (ERC-721).
  /// @param _name Enter TLD name starting with a dot and make sure letters are in lowercase form.
  /// @return TLD contract address
  function createTld(
   string memory _name,
    string memory _symbol,
    address _tldOwner,
    uint256 _domainPrice,
    bool _buyingEnabled
  ) external payable override nonReentrant returns(address) {
    require(buyingEnabled == true, "Buying TLDs disabled");
    require(msg.value >= price, "Value below price");

    (bool sent, ) = payable(royaltyAddress).call{value: address(this).balance}("");
    require(sent, "Failed to send TLD payment to factory owner");

    return _createTld(
      _name, 
      _symbol, 
      _tldOwner, 
      _domainPrice, 
      _buyingEnabled
    );

  }

  function _createTld(
    string memory _nameRaw,
    string memory _symbol,
    address _tldOwner,
    uint256 _domainPrice,
    bool _buyingEnabled
  ) internal returns(address) {
    string memory _name = strings.lower(_nameRaw);

    _validTldName(_name);

   PicardyDomainSBT tld = new PicardyDomainSBT(
      _name, 
      _symbol, 
      _tldOwner, 
      _domainPrice, 
      _buyingEnabled,
      address(this),
      metadataAddress
    );

    IForbiddenTlds forbidden = IForbiddenTlds(forbiddenTlds);
    forbidden.addForbiddenTld(_name);

    tldNamesAddresses[_name] = address(tld); 
    tlds.push(_name);

    emit TldCreated(_msgSender(), _tldOwner, _name, address(tld));

    return address(tld);
  }

  // function requestRandomNumber(uint32 numWords) external {
  //   IRandomNumberGen randomNumberGen = IRandomNumberGen(getRandomNumberGen());
  //   require(IERC20(linkToken).balanceOf(address(this)) >= randomNumberGen.fee() * 10**18, "Factory: Not enough LINK");
  //   require(IERC20(linkToken).balanceOf(msg.sender) >= randomNumberGen.fee() * 10**18, "User: Not enough LINK");
  //   IERC20(linkToken).transfer(address(this), randomNumberGen.fee());
  //   uint256 requestId = randomNumberGen.requestRandomNumber(numWords);
  //   emit RequestSent(requestId);
  // }

  // function checkFulfilled(uint256 _requestId) external view returns(bool) {
  //   IRandomNumberGen randomNumberGen = IRandomNumberGen(getRandomNumberGen());
  //   return randomNumberGen.checkFulfilled(_requestId);
  // }

  // //This function should be called by once. It changes the state of the random number generator
  // function confirmRandNumber(uint256 _requestId, string calldata _domainName, string calldata _tldName) external {
  //   IRandomNumberGen randomNumberGen = IRandomNumberGen(getRandomNumberGen());
  //   IPicardyDomainSBT sbtDomain = IPicardyDomainSBT(tldNamesAddresses[_tldName]);
  //   require(sbtDomain.getDomainHolder(_domainName) == msg.sender, "not domain holder");
  //   (,uint256 _tokenId, , , ) = sbtDomain.domains(strings.lower(_domainName));
  //   uint256[] memory randomNumbers = randomNumberGen.getRandomNumber(_requestId);
  //   uint256 _seed;
  //   if(_isEven(_tokenId)) {
  //     _seed = randomNumbers[1];
  //   } else {
  //     _seed = randomNumbers[0];
  //   }
  //   (bytes32 nullifier, ) = sbtDomain.updateHasProof(_domainName, _seed);
  //   s_randDetails[_requestId] = RandDetails({
  //     nullifier: nullifier,
  //     randomNumbers: randomNumbers
  //   });
  // }

  // function randDetails( uint256 _requestId, string calldata _domainName, string calldata _tldName) external view returns(uint256[] memory, bytes32) {
  //   IPicardyDomainSBT sbtDomain = IPicardyDomainSBT(tldNamesAddresses[_tldName]);
  //   require(sbtDomain.getDomainHolder(_domainName) == msg.sender, "not domain holder");
  //   uint256[] memory randomNumbers = s_randDetails[_requestId].randomNumbers;
  //   bytes32 nullifier = s_randDetails[_requestId].nullifier;
  //   return (randomNumbers, nullifier);
  // }

  function _isEven(uint256 _tokenId) internal pure returns (bool) {
    if (_tokenId % 2 == 0) {
      return true;
    } else {
      return false;
    }
  }

  // OWNER

  /// @notice only hub admin can change the ForbiddenTlds contract address.
  function changeForbiddenTldsAddress(address _forbiddenTlds) external onlyHubAdmin {
    forbiddenTlds = _forbiddenTlds;
  }

  /// @notice only hub admin can change the metadata contract address.
  function changeMetadataAddress(address _mAddr) external onlyHubAdmin {
    metadataAddress = _mAddr;
  }

  /// @notice only hub admin can change TLD max name length.
  function changeNameMaxLength(uint256 _maxLength) external onlyHubAdmin {
    nameMaxLength = _maxLength;
  }

  /// @notice only hub admin can change price for minting new TLDs.
  function changePrice(uint256 _price) external onlyHubAdmin {
    price = _price;
    emit ChangeTldPrice(_msgSender(), _price);
  }
  
  /// @notice only hub admin can change royalty fee for future contracts.
  function changeRoyalty(uint256 _royalty) external onlyHubAdmin {
    royalty = _royalty;
  }

  function getRoyaltyDetails() external override view returns(address, uint256) {
    return (royaltyAddress, royalty);
  }

  /// @notice only hub admin can create a new TLD for a specified address for free
  /// @param _name Enter TLD name starting with a dot and make sure letters are in lowercase form.
  /// @return TLD contract address
  function ownerCreateTld(
    string memory _name,
    string memory _symbol,
    address _tldOwner,
    uint256 _domainPrice,
    bool _buyingEnabled
  ) external onlyHubAdmin returns(address) {

    return _createTld(
      _name, 
      _symbol, 
      _tldOwner, 
      _domainPrice, 
      _buyingEnabled
    );

  }

  /// @notice Factory contract owner can enable or disable public minting of new TLDs.
  function toggleBuyingTlds() external onlyHubAdmin {
    buyingEnabled = !buyingEnabled;
  }

  
function _isHubAdmain() internal {
        require(domainHub.checkHubAdmin(_msgSender()), "Not Hub Admin");
    }

}
