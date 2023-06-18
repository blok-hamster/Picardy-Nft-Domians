import Switch from "./Switch";
import { useState } from "react";
import { useAccount } from "wagmi";
import sbtDomainFactoryAbi from "../constants/sbtFactoryAbi.json";
import { config } from "../constants";
import { ethers } from "ethers";

const CustomSbtDomain = () => {
  const { address } = useAccount();
  const [sbtAddress, setSbtAddress] = useState("");
  const [tldName, setTldName] = useState("");
  const [price, setPrice] = useState("");
  const [symbol, setSymbol] = useState("");
  const [buyingEnabled, setBuyingEnabled] = useState(false);

  const createSbtDomain = async (e) => {
    e.preventDefault();

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const formattedTldName = tldName.replace(/\s+/g, "").toLowerCase().trim();
    const formattedSymbol = symbol.replace(/\s+/g, "").toUpperCase().trim();

    console.log(formattedTldName, formattedSymbol, price, buyingEnabled);

    const sbtFactory = new ethers.Contract(
      config.sbtFactoryAddress,
      sbtDomainFactoryAbi,
      signer
    );
    const { 0: sbtAddress } = await sbtFactory.createTld(
      formattedTldName,
      formattedSymbol,
      address,
      price,
      buyingEnabled
    );
    setSbtAddress(sbtAddress);
    console.log(sbtAddress);
  };

  return (
    <section>
      <form>
        <div className=" flex items-center gap-10 md:mx-[400px] text-center">
          <input
            type="text"
            id="enter_tld"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl outline-none focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            placeholder="Enter your SBT TLD"
            required
            onChange={(e) => setTldName(e.target.value)}
          />
          <input
            type="text"
            id="tld_symbol"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl outline-none focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            placeholder="Symbol"
            required
            onChange={(e) => setSymbol(e.target.value)}
          />
        </div>

        <div>
          <div className="mt-6 flex items-center md:mx-[350px] text-center">
            <input
              type="text"
              id="last_name"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l-2xl outline-none focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
              placeholder="Price/per mint"
              required
              onChange={(e) => setPrice(e.target.value)}
            />
            <div className="p-0 rounded-r-2xl">
              <select className="focus:outline-none h-[42px] cursor-pointer rounded-r-2xl bg-gradient-to-r from-[#C6FFDD] via-[#FBD786] to-[#F7797D] font-bold px-4 text-md">
                <option value="3rd" className="p-2 px-4 text-md">
                  MATIC
                </option>
              </select>
            </div>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            <Switch
              isOn={buyingEnabled}
              handleToggle={() => setBuyingEnabled(!buyingEnabled)}
            />
          </div>
        </div>

        <button
          type="submit"
          className="text-white mt-6 font-bold border-2 border-[button-gradient] flex mx-auto justify-center bg-black hover:opacity-80 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-black dark:hover:bg-black dark:focus:ring-black"
          onClick={createSbtDomain}
        >
          Buy TLD
        </button>

        <p className="text-gradient font-bold text-center mt-3">
          except .eth, .ens, .com, .org, .net, .smol, .dao, .xyz
        </p>
      </form>
    </section>
  );
};

export default CustomSbtDomain;
