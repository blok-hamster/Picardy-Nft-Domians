import React from 'react';
import ProfileRectangle from './svg/ProfileRectangle';
import { FaWallet } from 'react-icons/fa';
import styles from '../helper/style';
import { useAccount, useBalance } from 'wagmi';

const ProfileHeader = () => {
  const { address } = useAccount();
  const { data } = useBalance({
    addressOrName: address,
  });

  const formatAddress = (address) => {
    let addressFormatted;
    if (address) {
      addressFormatted = address.slice(0, -16);
    } else {
      addressFormatted = '---';
    }
    return addressFormatted;
  };

  const formatBalance = (balance) => {
    let balanceFormatted;
    if (balance) {
      balanceFormatted = balance.slice(0, -16);
    } else {
      balanceFormatted = '---';
    }
    return balanceFormatted;
  };

  // console.log(address);
  // console.log(data);

  return (
    <section className={` bg-black md:flex-row flex-col ${styles.paddingY}`}>
      <div
        className={`feature-bal rounded-none mx-0 block items-center justify-between flex-1 ${styles.flexStart} flex-col gap-6 py-10 md:flex-row md:mx-[100px] md:rounded-2xl xl:px-0 sm:px-32 px-6`}
      >
        <div>
          <ProfileRectangle />
        </div>

        <div className="flex justify-between  black-orange-gradient w-full p-10 rounded-2xl">
          <div>
            <h1>Balance:</h1>
            <p>
              {formatBalance(data?.formatted)} {data?.symbol}
            </p>
          </div>

          <div className="bg-gray-400 p-3 rounded-xl">
            <FaWallet className="text-2xl" />
          </div>
        </div>

        <div className="flex gap-8 justify-between black-orange-gradient w-full p-10 rounded-2xl ">
          <div>
            <h1>Address:</h1>
            <p>{formatAddress(address)}...</p>
          </div>

          <div className="bg-gray-400 p-3 rounded-xl">
            <FaWallet className="text-2xl" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;
