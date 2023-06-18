// SPDX-License-Identifier: GPL-3.0-or-later
pragma solidity ^0.8.4;

import { IPicardyDomainMetadata } from "../interface/IPicardyDomainMetadata.sol";
import {IPicardyDomainFactory} from "../interface/IPicardyDomainFactory.sol";
import {IPicardyDomain} from "../interface/IPicardyDomain.sol";
import {IDomainImageContract} from "../interface/IDomainImageContract.sol";
import "../lib/strings.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";


/// @title Picardy Domain contract
/// @author Blok_hamster
/// @notice Dynamically generated NFT Domain Contract
contract PicardyDomain is IPicardyDomain, ERC721, Ownable, ReentrancyGuard {
  using strings for string;

  // Domain struct is defined in IPicardyDomain
  address public metadataAddress; // Picardy Domain metadata contract address
  address public minter; // address which is allowed to mint domains even if contract is paused
  address public factoryAddress; // 
  address imageAddress;

  bool public buyingEnabled = false; // buying domains enabled
  bool public buyingDisabledForever = false; // buying domains disabled forever
  bool public metadataFrozen = false; // metadata address frozen forever

  uint256 public totalSupply;
  uint256 public idCounter = 1; // up only

  uint256 public override price; // domain price
  uint256 public nameMaxLength = 140; // max length of a domain name
  
  mapping (string => Domain) public override domains; 
  mapping (uint256 => string) public domainIdsNames; 
  mapping (address => string) public override defaultNames; // user's default domain

  event MintingDisabledForever(address user);

  constructor(
    string memory _name,
    string memory _symbol,
    address _tldOwner,
    uint256 _domainPrice,
    bool _buyingEnabled,
    address _factoryAddress,
    address _metadataAddress,
    address _imageAddress
  ) ERC721(_name, _symbol) {
    price = _domainPrice;
    buyingEnabled = _buyingEnabled;
    metadataAddress = _metadataAddress;
    factoryAddress = _factoryAddress;
    imageAddress = _imageAddress;
    transferOwnership(_tldOwner);
  }

  // READ

  // Domain getters - you can also get all Domain data by calling the auto-generated domains(domainName) method
  function getDomainHolder(string calldata _domainName) public override view returns(address) {
    return domains[strings.lower(_domainName)].holder;
  }

  function getImageAddress() external view returns(address){
    return imageAddress;
  }

  function getDomainData(string calldata _domainName) public override view returns(string memory) {
    return domains[strings.lower(_domainName)].data; // should be a JSON object
  }

  function getDomainTokenId(string calldata _domainName) public override view returns(uint256) {
    return domains[strings.lower(_domainName)].tokenId;
  }

  function tokenURI(uint256 _tokenId) public view override returns (string memory) {
    return IPicardyDomainMetadata(metadataAddress).getMetadata(
      domains[domainIdsNames[_tokenId]].name, 
      name(),
      _tokenId,
      address(this)
    );
  }

  function getOwner() external view returns(address){
    return owner();
  }

  // WRITE

  /// @notice This distroys the domain name
  function burn(string calldata _domainName) external {
    string memory dName = strings.lower(_domainName);
    require(domains[dName].holder == _msgSender(), "You do not own the selected domain");
    uint256 tokenId = domains[dName].tokenId;
    delete domainIdsNames[tokenId]; // delete tokenId => domainName mapping
    delete domains[dName]; // delete string => Domain struct mapping

    if (keccak256(bytes(defaultNames[_msgSender()])) == keccak256(bytes(dName))) {
      delete defaultNames[_msgSender()];
    }

    _burn(tokenId); // burn the token
    --totalSupply;
    emit DomainBurned(_msgSender(), dName);
  }

  function editDefaultDomain(string calldata _domainName) external {
    string memory dName = strings.lower(_domainName);
    require(domains[dName].holder == _msgSender(), "You do not own domain");
    defaultNames[_msgSender()] = dName;
    emit DefaultDomainChanged(_msgSender(), dName);
  }

  /// @notice Edit domain custom data. Make sure to not accidentally delete previous data. Fetch previous data first.
  /// @param _domainName Only domain name, no extension.
  /// @param _data Custom data needs to be in a JSON object format.
  function editData(string calldata _domainName, string calldata _data) external {
    string memory dName = strings.lower(_domainName);
    require(domains[dName].holder == _msgSender(), "Only domain holder can edit");
    domains[dName].data = _data;
    emit DataChanged(_msgSender());
  }

  /// @notice Mint a new domain name as NFT (no dots and spaces allowed).
  /// @param _domainName Enter domain name without domain extension and make sure letters are in lowercase form.
  /// @return token ID
  function mint(
    string memory _domainName,
    address _domainHolder
  ) external payable nonReentrant returns(uint256) {
    require(!buyingDisabledForever, "Domain minting disabled forever");
    require(buyingEnabled || _msgSender() == owner() || _msgSender() == minter, "Buying domains disabled");
    require(msg.value >= price, "Value below price");

    _sendPayment(msg.value);

    return _mintDomain(_domainName, _domainHolder, "");
  }

  function _mintDomain(
    string memory _domainNameRaw, 
    address _domainHolder,
    string memory _data
  ) internal returns(uint256) {
    // convert domain name to lowercase (only works for ascii, clients should enforce ascii domains only)
    string memory _domainName = strings.lower(_domainNameRaw);

    require(strings.len(strings.toSlice(_domainName)) > 0, "Domain name empty");
    require(bytes(_domainName).length < nameMaxLength, "Domain name is too long");
    require(strings.count(strings.toSlice(_domainName), strings.toSlice(".")) == 0, "There should be no dots in the name");
    require(strings.count(strings.toSlice(_domainName), strings.toSlice(" ")) == 0, "There should be no spaces in the name");
    require(domains[_domainName].holder == address(0), "Domain with this name already exists");

    _mint(_domainHolder, idCounter);

    Domain memory newDomain; // Domain struct is defined in IPicardyDomain
    
    // store data in Domain struct
    newDomain.name = _domainName;
    newDomain.tokenId = idCounter;
    newDomain.holder = _domainHolder;
    newDomain.data = _data;

    // add to both mappings
    domains[_domainName] = newDomain;
    domainIdsNames[idCounter] = _domainName;

    if (bytes(defaultNames[_domainHolder]).length == 0) {
      defaultNames[_domainHolder] = _domainName; // if default domain name is not set for that holder, set it now
    }
    
    emit DomainCreated(_msgSender(), _domainHolder, string(abi.encodePacked(_domainName, name())));

    ++idCounter;
    ++totalSupply;

    return idCounter-1;
  }

  function _sendPayment(uint _amount) internal {
    (address addr, uint percentage) = IPicardyDomainFactory(factoryAddress).getRoyaltyDetails();
    uint percentageToBips = percentage * 100;
    
    if (percentage > 0 && percentage < 50) { 
      // send royalty - must be less than 50% 
      (bool sentRoyalty, ) = payable(addr).call{value: ((_amount * percentageToBips) / 10000)}("");
      require(sentRoyalty, "Failed to send royalty hub owner");
    }

    (bool sent, ) = payable(owner()).call{value: address(this).balance}("");
    require(sent, "Failed to send domain payment to TLD owner");
  }

  ///@dev Hook that is called before any token transfer. This includes minting and burning.
  function _beforeTokenTransfer(address from,address to,uint256 tokenId) internal override virtual {

    if (from != address(0)) { // run on every transfer but not on mint
      domains[domainIdsNames[tokenId]].holder = to; // change holder address in Domain struct
      
      if (bytes(defaultNames[to]).length == 0 && to != address(0)) {
        defaultNames[to] = domains[domainIdsNames[tokenId]].name; // if default domain name is not set for that holder, set it now
      }

      if (strings.equals(strings.toSlice(domains[domainIdsNames[tokenId]].name), strings.toSlice(defaultNames[from]))) {
        delete defaultNames[from]; // if previous owner had this domain name as default, unset it as default
      }
    }
    
  }

  // OWNER

  function changeMetadataAddress(address _metadataAddress) external onlyOwner {
    require(!metadataFrozen, "Cannot change metadata address anymore");
    metadataAddress = _metadataAddress;
  }

  function changeImageAddress(address _imageAddress) external onlyOwner{
    imageAddress = _imageAddress;
  }

  function changeMinter(address _minter) external onlyOwner {
    minter = _minter;
  }

  /// @notice Only TLD contract owner can call this function.
  function changeNameMaxLength(uint256 _maxLength) external override onlyOwner {
    nameMaxLength = _maxLength;
  }

  /// @notice Only TLD contract owner can call this function.
  function changePrice(uint256 _price) external override onlyOwner {
    price = _price;
    emit TldPriceChanged(_msgSender(), _price);
  }
  
  function disableBuyingForever() external onlyOwner {
    buyingDisabledForever = true; // this action is irreversible
    emit MintingDisabledForever(_msgSender());
  }

  /// @notice Freeze metadata address. Only TLD contract owner can call this function.
  function freezeMetadata() external onlyOwner {
    metadataFrozen = true; // this action is irreversible
  }

  /// @notice Only TLD contract owner can call this function.
  function toggleBuyingDomains() external onlyOwner {
    buyingEnabled = !buyingEnabled;
    emit DomainBuyingToggle(_msgSender(), buyingEnabled);
  }

  function withdrawETH() external onlyOwner {
    (bool sent, ) = payable(owner()).call{value: address(this).balance}("");
    require(sent, "failed to withdraw");
  }

  function withdrawERC20(address _tokenAddress) external onlyOwner {
    IERC20 token = IERC20(_tokenAddress);
    token.transfer(owner(), token.balanceOf(address(this)));
  }

}


