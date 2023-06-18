import React, { useState, useEffect } from 'react';
import sbtResolverAbi from '../constants/sbtResolver.json';
import { useAccount } from 'wagmi';
import { ethers } from 'ethers';
import { config } from '../constants';
import DomainCard from './DomainCard';

const tld = '.picardy';

const SbtDomains = () => {
  const { address, isConnected } = useAccount();
  const [response, setResponse] = useState({});

  const getSbtProfileDetails = async () => {
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
    console.log('Yollo', defaultSbtDomain);

    const sbtDomainUri = await sbtDomainResolver.getDomainTokenUri(
      defaultSbtDomain,
      tld
    );
    const formatImage = window.atob(sbtDomainUri.substring(29));

    const result = JSON.parse(formatImage);
    setResponse(result);
    // console.log(result);
  };

  useEffect(() => {
    getSbtProfileDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <DomainCard response={response} />
    </div>
  );
};

export default SbtDomains;
