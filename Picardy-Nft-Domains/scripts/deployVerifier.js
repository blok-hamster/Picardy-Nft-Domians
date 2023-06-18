const hre = require("hardhat");

async function main() {
  const verifier = await hre.ethers.getContractFactory("Verifier");
  const verifierContract = await verifier.deploy();
  await verifierContract.deployed();
  const verifierAddress = verifierContract.address;
  console.log("Verifier deployed to:", verifierAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
