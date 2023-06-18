import styles from '../helper/style';
import Head from 'next/head';
import Rectangle from './svg/Rectangle';
import SmallRectangle from './svg/SmallRectangle';

const Hero = ({ header, description }) => {
  return (
    <section id="home" className={`md:flex-row flex-col ${styles.paddingY}`}>
      <div
        className={`flex items-center flex-1 ${styles.flexStart} flex-col xl:px-0 sm:px-16 px-4`}
      >
        <div className="w-full text-center mt-2">
          <h1 className="text-center text-gradient font-poppins font-semibold ss:text-[58px] text-[40px] flex-wrap text-white sm:w-full ss:leading-[100.8px] leading-[75px] animate-pulse">
            {header}
          </h1>
        </div>

        <p className={`${styles.paragraph} text-center mb-4 mt-2`}>
          {description}
        </p>
      </div>

      <div className={`${styles.flexCenter} md:my-0 my-4 relative`}>
        <div className="hidden sm:block">
          <Rectangle />
        </div>

        <div className=" ss:block sm:hidden">
          <SmallRectangle />
        </div>

        {/* gradient start */}
        {/* <div className="absolute z-[0] w-[40%] h-[35%] top-0 pink__gradient" /> */}
        {/* <div className="absolute z-[1] w-[80%] h-[80%] rounded-full white__gradient bottom-40" /> */}
        <div className="absolute z-[0] w-[50%] h-[50%] right-20 bottom-20 blue__gradient" />
        {/* gradient end */}
      </div>
    </section>
  );
};

export default Hero;
