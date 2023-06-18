import React from 'react';
import Domain from '../components/svg/Domain';

const Description = () => {
  return (
    <div className="flex flex-col items-center">
      <div className="text-center  text-white mt-32 ">
        <h1 className="text-4xl font-bold">
          Get Your Picardy Domains in Few Steps
        </h1>
        <p className="mt-4 text-gray-400">
          Become an owner of a permissionless domain in 3 easy steps
        </p>
      </div>

      <div className="flex flex-col text-white text-center items-center justify-center mt-10 gap-16 md:flex-row md:gap-24">
        <div>
          <Domain />
          <p className="mt-2">Put in Name Choice</p>
        </div>

        <div>
          <Domain />
          <p className="mt-2">Select Domain</p>
        </div>

        <div>
          <Domain />
          <p className="mt-2">Buy Domain</p>
        </div>
      </div>
    </div>
  );
};

export default Description;
