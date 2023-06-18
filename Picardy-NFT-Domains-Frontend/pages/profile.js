import React from 'react';
import ProfileInfo from '../components/ProfileInfo';
import { useAccount } from 'wagmi';
import styles from '../helper/style';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useState, useEffect } from 'react';
// import DomainCard from '../components/DomainCard';

import dynamic from 'next/dynamic';

const SbtDomains = dynamic(
  () => {
    return import('../components/SbtDomains');
  },
  { ssr: false }
);
const ProfileHeader = dynamic(
  () => {
    return import('../components/ProfileHeader');
  },
  { ssr: false }
);

const Profile = () => {
  const { isConnected } = useAccount();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  });

  return (
    mounted && (
      <>
        {isConnected && (
          <div className="w-full h-full mt-12 text-white black-bg-gradient">
            <ProfileHeader />

            <div className="mx-[20px] block items-center mt-20 md:flex md:mx-0 ">
              <ProfileInfo />

              <div className="flex flex-col ">
                {/* <h3 className=" text-2xl md:ml-[280px]">Domains</h3> */}

                <SbtDomains />
                {/* <DomainCard /> */}
              </div>
            </div>
          </div>
        )}
        {/* {!isConnected && (
        <div
          className={`h-full md:flex-row flex-col ${styles.paddingY} items-center text-center w-full px-[400px]`}
        >
          <div
            className={`feature-bal rounded-3xl mx-0 flex flex-col items-center gap-6 py-20 my-20 md:rounded-2xl xl:px-0 sm:px-28 px-1 w-full`}
          >
            <h1 className="text-white w-full h-full mt-12">
              Please Connect Wallet to Continue
            </h1>
            <span>
              <ConnectButton />
            </span>
          </div>
        </div>
      )} */}
      </>
    )
  );
};

export default Profile;
