import React, { useState } from 'react';
import DomainName from './svg/DomainName';
import styles from '../helper/style';
import Image from 'next/image';
import { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import Link from 'next/link';
import 'react-toastify/dist/ReactToastify.css';

const domain = 'esse.3rd';
// const communityName = '.3rd';

const DomainCard = ({ response }) => {
  const [isEditing, setEditing] = useState(false);
  const [communityName, setCommunityName] = useState('');
  const notify = () =>
    toast(
      'Congrats: Your proof is httttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttttt'
    );

  const { name, image } = response;

  const editingDomainData = (
    <>
      {/* <h3 className="text-xl md:ml-[280px]">Edit Domain Data</h3> */}
      <form
        className={`h-full md:flex-row flex-col ${styles.paddingY} md:ml-[250px] md:w-[80%]`}
      >
        <div
          className={`feature-bal rounded-3xl mx-0 block items-center justify-between flex-1 ${styles.flexStart} flex-col gap-6 py-10 md:flex-row md:mx-[30px] md:rounded-2xl xl:px-0 sm:px-32 px-6`}
        >
          <label className="text-xl uppercase text-stone-500 font-semibold mr-4">
            Instagram
          </label>
          <input
            className="border-b-2 border-gray-400 feature-bal text-gray-200 px-5 outline-none"
            type="text"
          />
        </div>

        <div
          className={`feature-bal mt-10 rounded-3xl mx-0 block items-center justify-between flex-1 ${styles.flexStart} flex-col gap-6 py-10 md:flex-row md:mx-[30px] md:rounded-2xl xl:px-0 sm:px-32 px-6`}
        >
          <label className="text-xl uppercase text-stone-500 font-semibold mr-4">
            Twitter
          </label>
          <input
            className="border-b-2 border-gray-400 feature-bal text-gray-200 px-5 outline-none"
            type="text"
          />
        </div>

        <div
          className={`feature-bal mt-10 rounded-3xl mx-0 block items-center justify-between flex-1 ${styles.flexStart} flex-col gap-6 py-10 md:flex-row md:mx-[30px] md:rounded-2xl xl:px-0 sm:px-32 px-6`}
        >
          <label className="text-xl text-stone-500 font-semibold mr-4">
            Url Link
          </label>
          <input
            className="border-b-2 border-gray-400 feature-bal text-gray-200 px-5 outline-none"
            type="text"
          />
        </div>

        <div className="flex gap-4">
          <div className="ml-10 mt-5 border-4 border-white w-[100px] text-center p-2 rounded-full">
            <button type="submit">Save</button>
          </div>
          <div className="mt-5 border-4 border-white w-[100px] text-center p-2 rounded-full">
            <button type="submit" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        </div>
      </form>
    </>
  );

  const viewDomainData = (
    <>
      {/* <h3 className="text-xl md:ml-[280px]">Domains</h3> */}
      <div
        className={`h-full md:flex-row flex-col ${styles.paddingY} md:ml-[250px] md:w-[90%]`}
      >
        <div
          className={`feature-bal rounded-3xl mx-0 block items-center justify-between flex-1 ${styles.flexStart} flex-col gap-6 py-10 md:flex-row md:mx-[30px] md:rounded-2xl xl:px-0 sm:px-28 px-1`}
        >
          <div className="block gap-10 items-center sm:flex">
            <Image src={image} alt="" width="103" height="103" />

            <div>
              <div>
                <h2 className="mb-2 font-bold text-xl mt-4 sm:mt-0">{name}</h2>
                <p className="mb-2">
                  A Domain issued to{' '}
                  <span className="italic">
                    .{name ? name.split('.')[1] : '---'}
                  </span>{' '}
                  members
                </p>
              </div>

              <div className="flex flex-row gap-8 text-stone-400 ">
                <button
                  className="hover:opacity-80"
                  onClick={() => setEditing(true)}
                >
                  Edit domain data
                </button>
                <button className="hover:opacity-80">Transfer Domain</button>
              </div>
              {/* second button */}
              <div className="mt-4 flex flex-row gap-8 text-stone-400 ">
                <button
                  className="text-stone-300  italic items-center hover:opacity-80 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-700 rounded-xl px-3 py-1 shadow-2xl"
                  onClick={notify}
                >
                  Get Proof
                </button>
                <ToastContainer />

                <Link href="/verify-sbt">
                  <button className="text-stone-300  italic items-center hover:opacity-80 bg-gradient-to-r from-zinc-800 via-zinc-600 to-zinc-700 rounded-xl px-3 py-1">
                    Verify Sbt
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return <div>{isEditing ? editingDomainData : viewDomainData}</div>;
};

export default DomainCard;
