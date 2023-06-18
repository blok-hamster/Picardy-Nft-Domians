const ethers = require("ethers");
const resolverAbi = require("./abi/domainResolver.json");
const sbtResolverAbi = require("./abi/sbtResolver.json");
const dotenv = require("dotenv");
dotenv.config();

const main = async () => {
  const hubAddress = "0x86538155a314b32b74C3aF0815932ae9b67b4451";
  const factoryAddress = "0x7F84060AE3FE6079ac2f3Eaa3E76D80488a2D236";
  const sbtFactoryAddress = "0x83446129408979a0C7e018cc161dbCe8Cef34f86";
  const forbiddenTldsAddress = "0x69FA38e838649692FC85B897f56cd396C499e41A";
  const sbtResolverAddress = "0xc7b63c3F1212E063C386a2C05A171Db3217A99Ab";
  const domainResolverAddress = "0x557ad8C374aE2663AF6db3d2cD4C42f79FcF0324";
  const metaDataAddress = "0x7DAB5949B6C74FC31d6332eB5B42C948Dec5ACC9";
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

  const sbtResolver = new ethers.Contract(
    sbtResolverAddress,
    sbtResolverAbi,
    account
  );
  const resolver = new ethers.Contract(
    domainResolverAddress,
    resolverAbi,
    account
  );

  const domains = await resolver.getDefaultDomains(account.address);
  const domainArr = domains.split(" ");
  console.log("Domains:", domainArr);

  const sbtDomains = await sbtResolver.getDefaultDomains(account.address);
  const SbtDomainArr = sbtDomains.split(" ");
  console.log("SBT Domains:", SbtDomainArr);
};

main();
