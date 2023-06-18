import Head from 'next/head';
import { useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import { config } from '../constants';
import { useAccount } from 'wagmi';
import sbtFactoryAbi from '../constants/sbtFactoryAbi.json';
import sbtDomainAbi from '../constants/sbtDomainAbi.json';

// import randomNumberGenAbi from '../constants'

const VerifySbt = () => {
  const { address } = useAccount();
  const [proofInput, setProofInput] = useState('');
  const [requestId, setRequestId] = useState('');
  const [nullifier, setNullifier] = useState('');

  // 
  // console.log('Yollo', DomainName);

  const getZkProof = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="w-full">
      <Head>
        <title>Verify SBT | Picardy</title>
        <meta name="description" content="Verify your SBT Token" />
      </Head>
      <h1>Verify Sbt</h1>

      <section className="relative shadow-2xl text-center items-center py-8 px-14 max-h-full">
        <div className="mt-1 w-full">
          <form className="" noValidate autoComplete="off">
            <div className="px-[300px] pb-6 sm:mt-0 sm:col-span-2">
              <label
                htmlFor="eventname"
                className="block text-2xl mb-10 font-medium text-gray-300 sm:mt-px sm:pt-2"
              >
                Picardy SBT Verifier
              </label>
              <textarea
                id="proof-input"
                name="SBT Proof Input"
                type="text"
                className="items-center p-2 pb-16 bg-gray-800 shadow-2xl text-stone-300 block w-full focus:ring-gray-500 focus:border-gray-500 sm:text-sm border border-gray-300 rounded-md"
                required
                placeholder="Input your SBT Proof token"
                value={proofInput}
                onChange={(e) => setProofInput(e.target.value)}
              />
            </div>

            <button
              className="text-stone-300 text-xl italic items-center hover:opacity-80 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-700 rounded-xl p-3 px-8 shadow-2xl"
              variant="contained"
            >
              Verify
            </button>
          </form>
        </div>
        <p className="text-white mt-4 text-xl">
          Verified Status:{' '}
          <span className="text-green-600 font-bold">True</span>
        </p>
      </section>
    </div>
  );
};

export default VerifySbt;
