// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/access/AccessControlEnumerable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

///@author blok-hamster
contract PicardyDomainHub is AccessControlEnumerable {

    event FactoryAddressAdded(address indexed sender, address indexed fAddress);
    event SbtFactoryAddressAdded(address indexed sender, address indexed fAddress);
   
    bytes32 public constant HUB_ADMIN_ROLE = keccak256("HUB_ADMIN_ROLE");
    address public factoryAddress;
    address public sbtFactoryAddress; // list of TLD factories that are allowed to add forbidden TLDs
    address public forbiddenTlds;
    address public metadataAddress;

    modifier onlyAdmin {
        _isHubAdmain();
        _;
    }
    constructor(address mAddress) {
        _setupRole(DEFAULT_ADMIN_ROLE, _msgSender());
        _setupRole(HUB_ADMIN_ROLE, _msgSender());
        metadataAddress = mAddress;
    }

    function getHubAddress() external view returns(address) {
        return address(this);
    } 

    function init(address _fAddress, address _forbiddenTlds) external onlyAdmin {
        factoryAddress= _fAddress;
        forbiddenTlds = _forbiddenTlds;
    }

    function initSBT(address _fAddress, address _forbiddenTlds) external onlyAdmin {
        sbtFactoryAddress = _fAddress;
        forbiddenTlds = _forbiddenTlds;
    }

    function getSBTFactoryAddress() external view returns(address) {
        return sbtFactoryAddress;
    }

    function getFactoryAddress() external view returns(address) {
        return factoryAddress;
    }


    function addFactoryAddress(address _factoryAddress) external onlyAdmin {
       factoryAddress = _factoryAddress;
        emit FactoryAddressAdded(msg.sender, _factoryAddress);
    }

    function addSbtFactoryAddress(address _factoryAddress) external onlyAdmin {
        sbtFactoryAddress = _factoryAddress;
        emit SbtFactoryAddressAdded(msg.sender, _factoryAddress);
    }

  function addForbiddenTlds(address _forbiddenTlds) external onlyAdmin{
    forbiddenTlds = _forbiddenTlds;
  }

  /// @notice Factory contract owner can change the metadata contract address.
  function changeMetadataAddress(address _mAddr) external onlyAdmin{
    metadataAddress = _mAddr;
  }


    function _isHubAdmain() internal view {
        require(hasRole(HUB_ADMIN_ROLE, _msgSender()), "Not Admin");
    }

    function checkHubAdmin(address addr) external view returns(bool){
        if (hasRole(HUB_ADMIN_ROLE, addr)){
            return true;
        } else {
            return false;
        }
    }

    function withdrawEth() external onlyAdmin {
        payable(msg.sender).transfer(address(this).balance);
    }

    function withdrawERC20(address _token) external onlyAdmin {
        IERC20 token = IERC20(_token);
        token.transfer(msg.sender, token.balanceOf(address(this)));
    }

    receive() external payable {}
}