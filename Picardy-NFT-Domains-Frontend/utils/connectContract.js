import { ethers } from 'ethers';
import { config } from '../constants/index';
import domainResolverAbi from '../constants/domainResolver.json';
import sbtResolverAbi from '../constants/sbtResolver.json';

export const connectDomainResolver = () => {
  const contractAddress = config.domainResolverAddress;
  const contractABI = domainResolverAbi.abi;
  let domainResolverContract;
  try {
    const { ethereum } = window;

    if (ethereum.chainId === '0x13881') {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log('ContractABI', contractABI);
      domainResolverContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      ); // create new connection to the contract
    } else {
      throw new Error('Please connect to the Polygon Mumbai network');
    }
  } catch (error) {
    console.log('ERROR:', error);
  }
  return domainResolverContract;
};

export const connectSbtResolver = () => {
  const contractAddress = config.sbtResolverAddress;
  const contractABI = sbtResolverAbi.abi;
  let sbtResolverContract;

  try {
    const { ethereum } = window;

    if (ethereum.chainId === '0x13881') {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log('ContractABI', contractABI);
      sbtResolverContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      ); // create new connection to the contract
    } else {
      throw new Error('Please connect to the Polygon Mumbai network');
    }
  } catch (error) {
    console.log('ERROR:', error);
  }
  return sbtResolverContract;
};
