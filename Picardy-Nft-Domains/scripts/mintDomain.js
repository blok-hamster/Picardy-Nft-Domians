const ethers = require("ethers");
const dotenv = require("dotenv").config();
const hubAbi = require("./abi/hubAbi.json");
const factoryAbi = require("./abi/factoryAbi.json");
const forbiddenAbi = require("./abi/forbiddenAbi.json");
const sbtFactoryAbi = require("./abi/sbtFactoryAbi.json");
const domainAbi = require("./abi/domainAbi.json");
const sbtDomainAbi = require("./abi/sbtDomainAbi.json");

const main = async () => {
  const hubAddress = "0xB5C69bF93F608Ed7A06aeEFe428EdEcA7C5650Be";
  const factoryAddress = "0x1DCa1A8372bc5883414E636222650EFB4418De14";
  const sbtFactoryAddress = "0x7E70091180826d0c637DcE2a893885651361F1a3";
  const forbiddenTldsAddress = "0x100E93e5fF95937380c3D8a0e581755D38bdBc0f";
  const metaDataAddress = "0x55F57C210d5b7378A2465B5bf52400abA877A5Ec";
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.HTTP_ENDPOINT
  );
  //const wallet = new ethers.Wallet.fromMnemonic(process.env.PHARSE);

  // const hubAddress = "0x718cFF78Fa43615cDF1c43415b9C7A63c8cA9814";
  // const factoryAddress = "0x311F7f66f35BA7242F1FE5ae0d45eD51145Fa688";
  // const sbtFactoryAddress = "0x71D60c6E3723a4a9Cc351cC28Cd2C818Bf19e2D2";
  // const forbiddenTldsAddress = "0x37DbCC4f8D5672Ae624d1c92d53a700790009a5E";
  // const metaDataAddress = "0x5E8Ef50EAF2237E037217298341458C66cC4836F";

  const privateKey = process.env.PRIVATE_KEY;

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "http://127.0.0.1:8545"
  // );
  // //wallet from private key
  const wallet = new ethers.Wallet(privateKey, provider);

  const account = wallet.connect(provider);
  console.log("wallet address: ", account.address);

  const domainFactory = new ethers.Contract(
    factoryAddress,
    factoryAbi,
    account
  );

  const sbtDomainFactory = new ethers.Contract(
    sbtFactoryAddress,
    sbtFactoryAbi,
    account
  );

  // const tx = await sbtDomainFactory.updateRandomNumberAddress(
  //   "0x8648e96990C8A38f44E6AcD4252D9d1fFA4FB33e"
  // );
  // const recipt = await tx.wait();
  // console.log("recipt: ", recipt.transactionHash);

  const picardyAddress = await domainFactory.tldNamesAddresses(".chainlink");

  console.log(".picardy:", picardyAddress);

  const picardyDomain = new ethers.Contract(picardyAddress, domainAbi, account);
  const changeMetadataAddress = await picardyDomain.changeMetadataAddress(
    "0x55F57C210d5b7378A2465B5bf52400abA877A5Ec"
  );
  await changeMetadataAddress.wait();

  console.log(changeMetadataAddress.hash);
  // const mintTransferable = await picardyDomain.mint("arch", account.address);
  // await mintTransferable.wait();
  // console.log(
  //   "minted transferable domain:",
  //   `https://mumbai.polygonscan.com/tx/${mintTransferable.hash}`
  //);
  // const mintNonTransferable = await picardyDomain.mint(
  //   "arch",
  //   account.address,
  //   account.address,
  //   { gasLimit: 1000000 }
  // );
  // await mintNonTransferable.wait();
  // console.log(
  //   "minted non-transferable domain:",
  //   `https://mumbai.polygonscan.com/tx/${mintNonTransferable.hash}`
  // );
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
