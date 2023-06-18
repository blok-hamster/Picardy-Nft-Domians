import React from 'react';
// import Switch from 'react-switch';
import Switch from './Switch';
import Link from 'next/link';
import CustomSbtDomain from './CustomSbtDomain';
import CustomTransfDomain from './CustomTransfDomain';

import { useState } from 'react';

const CustomMinter = () => {
  const [openTab, setOpenTab] = useState(1);

  return (
    <div>
      <div className=" mx-auto mt-4">
        <div className="flex flex-col items-center justify-center ">
          <ul className="flex space-x-2 bg-white rounded-xl">
            <li>
              <a
                onClick={() => setOpenTab(1)}
                className={` ${
                  openTab === 1
                    ? 'bg-gradient-to-r from-[#C6FFDD] via-[#FBD786] to-[#F7797D] '
                    : ''
                } inline-block px-4 py-2 text-black font-bold rounded-xl shadow cursor-pointer`}
              >
                SBT Domains
              </a>
            </li>
            <li>
              <a
                onClick={() => setOpenTab(2)}
                className={` ${
                  openTab === 2
                    ? 'bg-gradient-to-r from-[#C6FFDD] via-[#FBD786] to-[#F7797D] text-white'
                    : ''
                } inline-block px-4 py-2 text-black font-bold rounded-xl shadow cursor-pointer`}
              >
                Transferrable Domains
              </a>
            </li>
          </ul>
          <div className="w-full mt-6">
            <div className={openTab === 1 ? 'block' : 'hidden'}>
              <CustomSbtDomain />
            </div>
            <div className={openTab === 2 ? 'block' : 'hidden'}>
              <CustomTransfDomain />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomMinter;
