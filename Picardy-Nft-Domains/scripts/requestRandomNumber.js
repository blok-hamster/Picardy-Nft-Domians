const randomNumberGenAbi = require("./abi/randomNumberGenAbi.json");
const ethers = require("ethers");
const dotenv = require("dotenv").config();

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.HTTP_ENDPOINT
  );

  const privateKey = process.env.PRIVATE_KEY;

  const wallet = new ethers.Wallet(privateKey, provider);
  const account = wallet.connect(provider);
  console.log("wallet address: ", account.address);

  const randomNumberAddress = "0xB989F4ce47BE32eC37D1b30e4b8Ea82f91A16D29";

  const randomNumberGen = new ethers.Contract(
    randomNumberAddress,
    randomNumberGenAbi,
    account
  );

  let randonNum;

  //   const tx = await randomNumberGen.requestIds();
  //   console.log(tx);

  const request = await randomNumberGen.requestRandomNumber(3);
  await request.wait(2);
  console.log("requestRandomNumber: ", await request.hash);

  console.log("request: ", request);

  //   const get = await randomNumberGen.getRandomNumber().then((res) => {
  //     console.log("get: ", res);
  //     randonNum = res;
  //   });
};

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
