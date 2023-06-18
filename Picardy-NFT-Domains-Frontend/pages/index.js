import styles from '../helper/style';
import Head from 'next/head';
import { HomeMinter, Hero, Description, Faq } from '../components';
import SbtMinter from '../components/SbtMinter';
import { faqQuestions } from '../helper';

export default function Home() {
  const header = 'Permissionless NFT Domains';
  const description = 'Mint your identity on the Blockchain';

  return (
    <div className=" w-full overflow-hidden">
      <Head>
        <title>Home | Picardy</title>
        <meta
          name="description"
          content="Mint your identity on the blockchain"
        />
      </Head>
      <div className={`bg--black-gradient-2 ${styles.flexStart}`}>
        <div className={`${styles.boxWidth}`}>
          <Hero header={header} description={description} />
        </div>
      </div>

      <div className={`bg-black ${styles.paddingX} ${styles.flexCenter}`}>
        <div className={`${styles.boxWidth}`}>
          <SbtMinter />
          <Description />
          <div className="text-white mt-28">
            <h1 className="text-4xl text-center">
              Frequently Asked Questions (FAQS)
            </h1>
            <p className="text-center mt-8">
              If your question is not answered below, please read the docs or
              get in touch with the team.
            </p>
            {faqQuestions.map((faq) => (
              <Faq key={faq.id} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
