import React from 'react';
import Enabled from './switch/Enabled';
import Disabled from './switch/Disabled';

const Switch = ({ isOn, handleToggle }) => {
  // console.log(isOn);

  return (
    <>
      <input
        checked={isOn}
        onChange={handleToggle}
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
      />
      <label
        style={{ background: isOn && '#32CD32' }}
        className="react-switch-label"
        htmlFor={`react-switch-new`}
      >
        <span className={`react-switch-button shadow-2xl`} />
        <div className="text-sm text-end ml-1 font-bold text-white">
          {isOn === true ? <Enabled /> : <Disabled />}
        </div>
      </label>
    </>
  );
};

export default Switch;
