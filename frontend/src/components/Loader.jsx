import React from 'react';

const Loader = ({ text = 'Loading...' }) => (
  <div className="flex flex-col items-center justify-center py-20 gap-4">
    <p className="text-[13px] text-gray-500 font-medium">{text}</p>
  </div>
);

export default Loader;
