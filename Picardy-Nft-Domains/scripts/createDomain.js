const ethers = require("ethers");
const dotenv = require("dotenv").config();
const hubAbi = require("./abi/hubAbi.json");
const factoryAbi = require("./abi/factoryAbi.json");
const forbiddenAbi = require("./abi/forbiddenAbi.json");

const main = async () => {
  const hubAddress = "0xB5C69bF93F608Ed7A06aeEFe428EdEcA7C5650Be";
  const factoryAddress = "0x1DCa1A8372bc5883414E636222650EFB4418De14";
  const sbtFactoryAddress = "0x7E70091180826d0c637DcE2a893885651361F1a3";
  const forbiddenTldsAddress = "0x100E93e5fF95937380c3D8a0e581755D38bdBc0f";
  const metaDataAddress = "0x7DAB5949B6C74FC31d6332eB5B42C948Dec5ACC9";
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.HTTP_ENDPOINT
  );
  // const wallet = new ethers.Wallet.fromMnemonic(process.env.PHARSE);

  // const hubAddress = "0x809d550fca64d94Bd9F66E60752A544199cfAC3D";
  // const factoryAddress = "0x2bdCC0de6bE1f7D2ee689a0342D76F52E8EFABa3";
  // const sbtFactoryAddress = "0xcbEAF3BDe82155F56486Fb5a1072cb8baAf547cc";
  // const forbiddenTldsAddress = "0x82e01223d51Eb87e16A03E24687EDF0F294da6f1";
  // const metaDataAddress = "0x5E8Ef50EAF2237E037217298341458C66cC4836F";

  const privateKey = process.env.PRIVATE_KEY;

  // const provider = new ethers.providers.JsonRpcProvider(
  //   "http://127.0.0.1:8545"
  // );
  //wallet from private key
  const wallet = new ethers.Wallet(privateKey, provider);
  const account = wallet.connect(provider);
  console.log("wallet address: ", account.address);
  const price = ethers.utils.parseEther("0.5");
  //console.log(price);

  const picardyFactory = new ethers.Contract(
    factoryAddress,
    factoryAbi,
    account
  );

  const picardySBTFactory = new ethers.Contract(
    sbtFactoryAddress,
    factoryAbi,
    account
  );

  const forbiddenTlds = new ethers.Contract(
    forbiddenTldsAddress,
    forbiddenAbi,
    account
  );

  // const domain = await picardyFactory.ownerCreateTld(
  //   ".chainlink",
  //   "link",
  //   account.address,
  //   price,
  //   true
  // );
  // const recipt1 = await domain.wait();
  // console.log("domain: ", await domain.hash);
  // console.log("recipt1: ", recipt1);

  const changeMetadataAddress1 = await picardySBTFactory.changeMetadataAddress(
    "0x55F57C210d5b7378A2465B5bf52400abA877A5Ec"
  );
  await changeMetadataAddress1.wait();

  const changeMetadataAddress = await picardyFactory.changeMetadataAddress(
    "0x55F57C210d5b7378A2465B5bf52400abA877A5Ec"
  );
  const recipt1 = await changeMetadataAddress.wait();
  console.log("domain: ", await changeMetadataAddress.hash);
  console.log("recipt1: ", recipt1);
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
