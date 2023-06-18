import Link from 'next/link';
import styles from '../helper/style';
import { FaDiscord } from 'react-icons/fa';
import { BsGithub, BsTwitter } from 'react-icons/bs';
import { SiMedium } from 'react-icons/si';

const Footer = () => (
  <section
    className={`${styles.flexCenter} ${styles.paddingY} flex-col mt-24 pt-16 border-t-[1px] border-t-[#3F3E45]`}
  >
    <div className="text-white flex justify-between text-lg gap-4">
      <Link href="/about">About</Link>
      <Link href="/">How it Works</Link>
      <Link href="/">FAQ</Link>
      <Link href="/">Blog</Link>
    </div>

    <div className="flex flex-row gap-6 text-gray-300 cursor-pointer text-2xl pt-8 md:mt-0 mt-2">
      <FaDiscord />
      <BsGithub />
      <BsTwitter />
      <SiMedium />
    </div>

    <div className="w-full flex justify-center items-center md:flex-row flex-col pt-6 ">
      <p className="font-poppins  font-normal text-center text-[18px] leading-[27px] text-white">
        Ⓒ 2022 Picardy NFT Domains. All Rights Reserved.
      </p>
    </div>

  </section>
);

export default Footer;
