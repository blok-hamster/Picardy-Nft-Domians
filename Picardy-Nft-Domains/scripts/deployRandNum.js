const hre = require("hardhat");

const main = async () => {
  const subId = 2552;
  const keyHash =
    "0x4b09e658ed251bcafeebbc69400383d49f344ace09b9576fe248bb02c003fe9f";
  const RandomNumberGen = await hre.ethers.getContractFactory(
    "RandomNumberGen"
  );
};
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
