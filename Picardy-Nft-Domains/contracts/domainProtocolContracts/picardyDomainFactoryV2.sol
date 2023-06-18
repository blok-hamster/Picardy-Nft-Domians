// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

import "../lib/strings.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/Context.sol";
import {IForbiddenTlds} from "../interface/IForbiddenTlds.sol";
import {IPicardyDomainHub} from "../interface/IPicardyDomainHub.sol";
import {IPicardyDomainFactory} from "../interface/IPicardyDomainFactory.sol";
import "./PicardyDomain.sol";

/// @title Picardy Domain Factory
/// @author Blok_hamster
/// @notice Factory contract dynamically new domain contracts.
contract PicardyDomainFactoryV2 is IPicardyDomainFactory, ReentrancyGuard, Context{
  using strings for string;

  string[] public tlds; // existing TLDs
  mapping (string => address) public override tldNamesAddresses; // a mapping of TLDs (string => TLDaddress)
  mapping (address => string) public tldAddressesNames; // a mapping of TLDs (TLDaddress => string

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
  address domainImageAddress;

  constructor(
    uint256 _price, 
    address _forbiddenTlds,
    address _metadataAddress,
    address _domainHub,
    address _royaltyAddress,
    address _domainImageAddress
  ) {
    price = _price;
    forbiddenTlds = _forbiddenTlds;
    metadataAddress = _metadataAddress;
    domainHub = IPicardyDomainHub(_domainHub);
    royaltyAddress = _royaltyAddress;
    domainImageAddress = _domainImageAddress;
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

   PicardyDomain tld = new PicardyDomain(
      _name, 
      _symbol, 
      _tldOwner, 
      _domainPrice, 
      _buyingEnabled,
      address(this),
      metadataAddress,
      domainImageAddress
    );

    IForbiddenTlds forbidden = IForbiddenTlds(forbiddenTlds);
    forbidden.addForbiddenTld(_name);

    tldNamesAddresses[_name] = address(tld); 
    tldAddressesNames[address(tld)] = _name;
    tlds.push(_name);

    emit TldCreated(_msgSender(), _tldOwner, _name, address(tld));

    return address(tld);
  }

  function getTldAddress(string memory _name) external view returns(address) {
    return tldNamesAddresses[_name];
  }

  function getTldName(address _tldAddress) external view  returns(string memory) {
    return tldAddressesNames[_tldAddress];
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

  function withdrawETH() external onlyHubAdmin {
    (bool sent, ) = payable(_msgSender()).call{value: address(this).balance}("");
    require(sent, "Failed to send ETH");
  }

  function withdrawERC20(address _token) external onlyHubAdmin {
    IERC20 token = IERC20(_token);
    token.transfer(_msgSender(), token.balanceOf(address(this)));
  }

  
  function _isHubAdmain() internal {
        require(domainHub.checkHubAdmin(_msgSender()), "Not Hub Admin");
  }

  receive() external payable {}

}
