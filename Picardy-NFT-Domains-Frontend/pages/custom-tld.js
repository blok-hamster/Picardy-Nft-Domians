import React from "react";
import Head from "next/head";
import { Hero, CustomMinter, Contact } from "../components";

const header = "Customized Top Level Domains";
const description = "Customize and select your choice top level domain";

const CustomTLD = () => {
  return (
    <div>
      <Head>
        <title>Customized Domains | Picardy</title>
        <meta
          name="description"
          content="Customize and select your choice top level domain"
        />
      </Head>

      <Hero header={header} description={description} />

      <CustomMinter />
      <div className="bg-black">
        <Contact />
      </div>
    </div>
  );
};

export default CustomTLD;
