import React from 'react';
import { useState } from 'react';
import { BsChevronDoubleUp, BsChevronDoubleDown } from 'react-icons/bs';

const Faq = ({ question, answer }) => {
  const [expand, setExpand] = useState(false);
  const expandClass = expand ? 'display' : 'hidden';
  const ansClass = `${expandClass} p-5`;

  return (
    <>
      <div className="mt-16 mx-auto text-white shadow rounded border border-gray-100 border-t-0 w-full md:w-3/4 transition-all duration-500">
        <div className="p-4 text-xl relative font-medium">
          <div
            className="w-5/6 cursor-pointer transition-all duration-500"
            onClick={() => setExpand(!expand)}
          >
            {question}
          </div>
          <button
            aria-label="question-expand"
            className="text-xl absolute top-0 right-0 p-4 focus:outline-none"
            onClick={() => setExpand(!expand)}
          >
            {expand ? (
              <BsChevronDoubleDown className="w-5" />
            ) : (
              <BsChevronDoubleUp className="w-5" />
            )}
          </button>
        </div>

        <div className={ansClass}>{answer}</div>
      </div>
    </>
  );
};

export default Faq;
