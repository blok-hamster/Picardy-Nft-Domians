import { createContext, useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { config } from '../constants';
import sbtResolverAbi from '../constants/sbtResolver.json';
import Domain from '../components/svg/Domain';

export const DomainContext = createContext();

const tld = '.picardy';

export const DomainContextProvider = ({ children }) => {
  const { address, isConnected } = useAccount();
  const [mintedName, setMintedName] = useState('');

  const getSbtNameDetails = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const sbtDomainResolver = new ethers.Contract(
      config.sbtResolverAddress,
      sbtResolverAbi,
      signer
    );

    const defaultSbtDomain = await sbtDomainResolver.getDefaultDomain(
      address,
      tld
    );
    console.log(defaultSbtDomain);

    const sbtDomainUri = await sbtDomainResolver.getDomainTokenUri(
      defaultSbtDomain,
      tld
    );
    setMintedName(defaultSbtDomain);
  };

  useEffect(() => {
    getSbtNameDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DomainContext.Provider value={{ mintedName }}>
      {children}
    </DomainContext.Provider>
  );
};


