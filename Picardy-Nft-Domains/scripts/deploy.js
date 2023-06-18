// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const subId = 2552;
  const keyHash =
    "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f";
  //Import contracts to deploy
  const PicardyDomainFactory = await hre.ethers.getContractFactory(
    "PicardyDomainFactoryV2"
  );

  const picardyDomainSBTFactory = await hre.ethers.getContractFactory(
    "PicardyDomainSBTFactory"
  );

  const PicardyDomainHub = await hre.ethers.getContractFactory(
    "PicardyDomainHub"
  );

  const PicardyDomainResolver = await hre.ethers.getContractFactory(
    "PicardyDomainResolver"
  );

  const PicardySBTDomainResolver = await hre.ethers.getContractFactory(
    "PicardySBTDomainResolver"
  );

  const RandomNumberGen = await hre.ethers.getContractFactory(
    "RandomNumberGen"
  );

  const ForbiddenTlds = await hre.ethers.getContractFactory("ForbiddenTldsV2");

  const metadataAddress = "0x7DAB5949B6C74FC31d6332eB5B42C948Dec5ACC9";

  const royaltyAddress = "0xfFD7E682420eD0d3f6b9cf714e86FE48d89b1c7b";

  const randomNumberGen = await RandomNumberGen.deploy(subId, keyHash);
  await randomNumberGen.deployed();
  const randomNumberGenAddress = randomNumberGen.address;

  const picardyHub = await PicardyDomainHub.deploy(metadataAddress);
  await picardyHub.deployed();
  const hubAddress = picardyHub.address;

  const picardyResolver = await upgrades.deployProxy(PicardyDomainResolver);
  const domainSbtResolver = await upgrades.deployProxy(
    PicardySBTDomainResolver
  );
  await picardyResolver.deployed();
  await domainSbtResolver.deployed();
  const resolverAddress = picardyResolver.address;
  const domainSbtResolverAddress = domainSbtResolver.address;
  console.log("resolver Address:", resolverAddress);
  console.log("domain Sbt resolver address:", domainSbtResolverAddress);

  await picardyResolver.addHubAddress(hubAddress, { gasLimit: 1000000 });
  await domainSbtResolver.addHubAddress(hubAddress, { gasLimit: 1000000 });

  const forbiddenTlds = await ForbiddenTlds.deploy(hubAddress);
  await forbiddenTlds.deployed();
  const forbiddenTldsAddress = forbiddenTlds.address;

  const picardyFactory = await PicardyDomainFactory.deploy(
    0,
    forbiddenTldsAddress,
    metadataAddress,
    hubAddress,
    royaltyAddress
  );
  await picardyFactory.deployed();
  const factoryAddress = picardyFactory.address;

  await picardyResolver.addFactoryAddress(factoryAddress);

  await forbiddenTlds.addFactoryAddress(factoryAddress);

  const init = await picardyHub.init(
    picardyFactory.address,
    forbiddenTldsAddress
  );
  await init.wait();

  // const toogle = await picardyFactory.toggleBuyingTlds();
  // await toogle.wait();

  console.log("picardyDomainHub deployed to: ", hubAddress);
  console.log("picardyDomainFactory deployed to: ", factoryAddress);
  console.log("forbiddenTlds deployed to: ", forbiddenTldsAddress);
  console.log("randomNumberGen: ", randomNumberGenAddress);

  const picardySBTFactory = await picardyDomainSBTFactory.deploy(
    0,
    forbiddenTldsAddress,
    metadataAddress,
    hubAddress,
    royaltyAddress
  );
  await picardySBTFactory.deployed();
  const sbtFactoryAddress = picardySBTFactory.address;
  await domainSbtResolver.addFactoryAddress(sbtFactoryAddress);

  console.log("picardyDomainSBTFactory deployed to: ", sbtFactoryAddress);

  await forbiddenTlds.addFactoryAddress(sbtFactoryAddress);

  const sbtInit = await picardyHub.initSBT(picardySBTFactory.address);
  await sbtInit.wait();

  // const sbtToogle = await picardySBTFactory.toggleBuyingTlds();
  // await sbtToogle.wait();

  // Deployed to mumbai testnet
  // resolver Address: 0x5caf1920EB5eDdD601b567c9103E151F07B7C913
  // domain Sbt resolver address: 0x40109472983F8B073d1CFd0691C2d4c8D4999c0d
  // picardyDomainHub deployed to:  0x86538155a314b32b74C3aF0815932ae9b67b4451
  // picardyDomainFactory deployed to:  0x7F84060AE3FE6079ac2f3Eaa3E76D80488a2D236
  // forbiddenTlds deployed to:  0x69FA38e838649692FC85B897f56cd396C499e41A
  // randomNumberGen:  0x8648e96990C8A38f44E6AcD4252D9d1fFA4FB33e
  // picardyDomainSBTFactory deployed to:  0x83446129408979a0C7e018cc161dbCe8Cef34f86
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
