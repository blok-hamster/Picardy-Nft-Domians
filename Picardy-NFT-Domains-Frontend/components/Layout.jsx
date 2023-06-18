import React from 'react';
import Navbar from './Navbar';

import Footer from './Footer';
import styles from '../helper/style';

const Layout = ({ children }) => {
  return (
    <div className="bg-black w-full overflow-hidden">
      <div className={` `}>
        <div className={`${styles.boxWidth}`}>
          <Navbar />
        </div>
      </div>
      <main className="flex-1">{children}</main>
      <div className="mt-8" />
      <Footer />
    </div>
  );
};

export default Layout;
