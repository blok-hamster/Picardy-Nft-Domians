import Switch from './Switch';
import { useState } from 'react';

const CustomTransfDomain = () => {
  const [buyingEnabled, setBuyingEnabled] = useState(false);

  return (
    <section>
      <form>
        <div className=" flex items-center gap-10 md:mx-[400px] text-center">
          <input
            type="text"
            id="enter_tld"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl outline-none focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            placeholder="Enter your TLD"
            required
          />
          <input
            type="text"
            id="tld_symbol"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-2xl outline-none focus:ring-orange-500 focus:border-orange-500 block w-full p-2.5 dark:bg-gray-200 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-orange-500 dark:focus:border-orange-500"
            placeholder="Symbol"
            required
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
        >
          Buy TLD
        </button>

        <p className="text-gradient font-bold text-center mt-3">
          except .eth, .ens, .com, .org, .net, .smol, .punk, .dao, .xyz
        </p>
      </form>
    </section>
  );
};

export default CustomTransfDomain;
