import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import sbtDomainAbi from '../constants/sbtDomainAbi.json';
import sbtDomainFactoryAbi from '../constants/sbtFactoryAbi.json';
import { config } from '../constants';
import { ethers } from 'ethers';

// const tld = '.picardy';
const tldss = ['.picardy', '.3rd'];

const SbtMinter = () => {
  const { address } = useAccount();
  const [userDomain, setUserDomain] = useState('');
  const [selectTld, setSelectTld] = useState('.picardy');
  const [sbtFactory, setSbtFactory] = useState('');
  const [sbtTlds, setSbtTlds] = useState([]);

  const getSbtTldDomains = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const newSbtFactory = new ethers.Contract(
      config.sbtFactoryAddress,
      sbtDomainFactoryAbi,
      signer
    );
    setSbtFactory(newSbtFactory);

    const sbtAddresses = await newSbtFactory.getTldsArray().then((res) => {
      setSbtTlds(res);
      console.log(res);
    });
  };

  //   console.log(sbtTlds);

  useEffect(() => {
    getSbtTldDomains();
  }, []);

  const handleChange = (event) => {
    setSelectTld(event.target.value);
    console.log(event.target.value);
  };

  const mintSbtDomain = async (e) => {
    e.preventDefault();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const formattedName = userDomain.replace(/\s+/g, '').toLowerCase().trim();
    const sbtTldAddress = await sbtFactory.tldNamesAddresses(selectTld);

    console.log(formattedName, sbtTldAddress);

    const sbtDomainContract = new ethers.Contract(
      sbtTldAddress,
      sbtDomainAbi,
      signer
    );

    const mint = await sbtDomainContract.mint(formattedName, address);
    const receipt = await mint.wait();
    console.log(receipt);
    const txnHash = await receipt.transactionHash;
    console.log('Minted:', txnHash);
  };

  return (
    <section>
      <form>
        <div className="mb-6 flex items-center md:mx-[400px] text-center">
          <input
            type="text"
            id="last_name"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-2xl outline-none focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            placeholder="Enter your preferred name"
            required
            value={userDomain}
            onChange={(e) => setUserDomain(e.target.value)}
          />
          <div className="p-0 rounded-r-2xl">
            <select
              className="focus:outline-none h-[42px]  rounded-r-2xl bg-yellow-600 font-bold"
              onChange={handleChange}
            >
              {sbtTlds
                ? sbtTlds.map((option, index) => (
                    <option key={index} value={option} className="p-2">
                      {option}
                    </option>
                  ))
                : '...'}
            </select>
          </div>
        </div>

        <p className="text-white font-bold text-center mb-4">
          Domain Price: 0.003ETH
        </p>

        <button
          type="submit"
          //   disabled={isConnected}
          className="text-white font-bold border-2 border-[button-gradient] flex mx-auto justify-center bg-black hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black"
          onClick={mintSbtDomain}
        >
          Buy Domain
        </button>
      </form>
    </section>
  );
};

export default SbtMinter;

// Minted: 0xc4ba8cbc29b6a34994f38cabfae61b5eff6cb3e694880ee7bf6f85fd4166a323
