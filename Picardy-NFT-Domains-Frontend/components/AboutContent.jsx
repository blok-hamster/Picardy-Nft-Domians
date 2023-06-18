import React from 'react';
import Head from 'next/head';
import styles from '../helper/style';

const AboutContent = () => {
  return (
    <div className={`bg-black md:flex-row flex-col ${styles.paddingY}`}>
      <Head>
        <title>About | Picardy</title>
        <meta name="description" content="About Us" />
      </Head>

      <div
        className={`bg-black flex items-start flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-32 px-6`}
      >
        <h1 className="text-4xl text-gradient font-bold">
          About Picardy NFT Domains
        </h1>

        <p className="mt-6">
          PND allows you register domains as NFTs. It is a decentralized profile
          protocol that stores information of users (custom url, social media
          identities, etc) on chain.
        </p>

        <div>
          <h4 className="font-bold mt-6 text-lg">Usecases for PND</h4>
          <p className="mt-4">
            <span className="font-bold text-stone-500">Transferable:</span>{' '}
            whitelist communities (roles).
          </p>
          <p className="mt-4">
            <span className="font-bold text-stone-500">Non Transferable:</span>{' '}
            schools, DAOs, IDs.
          </p>
        </div>

        <div>
          <h4 className="font-bold mt-6 text-lg">Why would you need a PND?</h4>
        </div>

        <ul className="list-disc pl-8">
          <li className="mb-6">
            Crypto addresses are strings of numbers and alphabets together which
            makes them hard to remember. Having a human readable address like{' '}
            <span className="text-gray-700 font-bold">esse.degen</span>, makes
            it easy to remember anytime you need it.
          </li>
          <li className="mb-6">
            It also serves as proof of humanity and decentralized
            identification, when we use SBTs.
          </li>
          <li className="mb-6">
            Another usecase would be as pass into into various dApps or
            communities without signing up (when integrated).
          </li>
          <li>
            Help establish concensus and governance structure within DAOs and
            communities (using SBT Domains for DAOs)
          </li>
        </ul>

        <p className="mt-10">
          Picardy NFT Domain aims to provide verifiable identity digitally,
          which can be backed up by data contained in these domains. All these
          are done within the full scope of decentralization in web3
        </p>
      </div>

      <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 gray__gradient" />
    </div>
  );
};

export default AboutContent;
