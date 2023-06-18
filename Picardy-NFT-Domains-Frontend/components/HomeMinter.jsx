import { useState, useEffect } from 'react';
import { useAccount } from 'wagmi';
import picardyDomainFactoryAbi from '../constants/picardyDomainFactoryAbi.json';
import picardyDomainAbi from '../constants/picardyDomainAbi.json';
import { ethers } from 'ethers';
import { config } from '../constants';

// const tldss = ['blokness', '.3rd'];
// const tld = '.blokness';

const HomeMinter = () => {
  const { address } = useAccount();
  const [userDomain, setUserDomain] = useState('');
  const [selectTld, setSelectTld] = useState('.blokness');
  const [domainFactory, setDomainFactory] = useState('');
  const [tlds, setTlds] = useState();

  const getTldDomains = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const newDomainFactory = new ethers.Contract(
      config.domainFactoryAddress,
      picardyDomainFactoryAbi,
      signer
    );
    setDomainFactory(newDomainFactory);

    const tldAddresses = await newDomainFactory.getTldsArray().then((res) => {
      setTlds(res);
      console.log(res);
    });
  };

  const handleChange = (event) => {
    setSelectTld(event.target.value);
  };

  useEffect(() => {
    getTldDomains();
  }, []);

  // console.log(tlds);

  const mintDomain = async (e) => {
    e.preventDefault();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const formattedName = userDomain.replace(/\s+/g, '').toLowerCase().trim();
    const tldAddress = await domainFactory.tldNamesAddresses(selectTld);

    console.log(formattedName, tldAddress);

    const domainContract = new ethers.Contract(
      tldAddress,
      picardyDomainAbi,
      signer
    );

    const mint = await domainContract.mint(formattedName, address);
    const receipt = await mint.wait();
    console.log(receipt);
    const txHash = await receipt.transactionHash;
    console.log(txHash);

    // const userInput = userDomain.concat(selectTld);
    // const formatInput = userInput.replace(/\s+/g, '').toLowerCase().trim();

    // const userName =
  };

  const submitDomain = (e) => {
    e.preventDefault();

    const combine = userDomain.concat(selectTld);
    const formatInput = combine.replace(/\s+/g, '').toLowerCase().trim();

    console.log(formatInput);
    setUserDomain('');
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
              {tlds
                ? tlds.map((option, index) => (
                    <option key={index} value={option} className="p-2">
                      {option}
                    </option>
                  ))
                : '...'}
              {/* {tlds.map((option, index) => (
                <option key={index} value={option} className="p-2">
                  {option}
                </option>
              ))} */}
            </select>
          </div>
        </div>

        <p className="text-white font-bold text-center mb-4">
          Domain Price: 0.003ETH
        </p>

        <button
          type="submit"
          className="text-white font-bold border-2 border-[button-gradient] flex mx-auto justify-center bg-black hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black"
          onClick={mintDomain}
        >
          Buy Domain
        </button>
      </form>
    </section>
  );
};

export default HomeMinter;