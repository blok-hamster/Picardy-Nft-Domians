const ethers = require("ethers");
const verifierAbi = require("./abi/verifierAbi.json");
const dotenv = require("dotenv");
dotenv.config();

const main = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.HTTP_ENDPOINT
  );

  const privateKey = process.env.PRIVATE_KEY;

  //wallet from private key
  const wallet = new ethers.Wallet(privateKey, provider);
  const account = wallet.connect(provider);

  const verifierAddress = "0xe6a4624d93883F2a0de6A6c0443bCB28845014FF";
  const oracleAddress = "0x1aEe6e8DA64DCC9Aed927FBEE6Fb09a5d2e517c2";
  const jobId = "8e305d9f6fcf4284b9be0f3b4063c1de";

  const verifierContract = new ethers.Contract(
    verifierAddress,
    verifierAbi,
    account
  );

  const init = await verifierContract.initilizeVerifier(oracleAddress, jobId);

  const proof = [
    '{"scheme":"g16","curve":"bn128","proof":{"a":["0x0858709756340604cc1dceeff6d8b22fd1d2eebc5a55e7e25a2c8369b0738f1f","0x2993a723da59c96429f5067ed872f85deb69a25a6f04cfade73d39a5f41c4eb0"],"b":[["0x23634a6217082f1a87823c6198860cde22137dc4333168d6954c7013e50aef5c","0x1a3c7addf070c062a447f528dc5ea0ae45e42561ca0c90c5527e62f2f0d68b67"],["0x21a669a5cd400d4c9532db8812fe6a6683ed4774c366a77f2acce83968e193c2","0x2c6eb224a9fe97c873cf6e51dc88681df41e344e780f3c2ae33591126fd0fd35"]],"c":["0x13928ed337c046acafe5195637e748ea6a87ec7018b02140471303b2d45d3bb5","0x2796d4f08c3c14e60d827c613fa4b3c11c6eb2fa78af93eefe5eb39ade46909c"]},"inputs":[]}',
    '{"scheme":"g16","curve":"bn128","alpha":["0x10df1a8ed08f43aab34f318ecae4e875810b89d0439723ea4096361ecf364e59","0x21b4515855fc6030acec1228ee2bcdbf27606251d8fcc19087cf69d49d4fd1d5"],"beta":[["0x028b2a5f35f225a0fe61b08bca36b20a9f4c69de8be87269beaf62128b2de284","0x0cd715878eb6f4e5c1873c77f351a437f45f6569de2ec34867ba1bcfe68b77d9"],["0x09732de5b015e5b4be6af15675cabedad197827904bd5002de8c4c7bba27591a","0x20a32069fa7fe381b58449d13e6d88a19ebbf7caf048f0cfdb44c8adf46554cc"]],"gamma":[["0x17ec1af7384868bad42c99997ed6b2a9c24523d6cfc48ac08ec2bdb0691e0986","0x2673e197e369c7abe2c0822c51d2a2f85e1f878d381e3fc20589df539e053742"],["0x0355d0b0a8983d6bfcd4f0e131d04a057538798a43b533d4ce2ab264645ea86a","0x2554fe269634b6f597b6b50b3944af6782f9a43b698108b84fb26baa4410d376"]],"delta":[["0x1514b6b4e3bd6096b13c67c422f724584d4dccf1c11578677b5206b93501b085","0x2ea722566c79356d9d0a19c1ae025667699a3d89cdeb7e25071895aebcc79a8f"],["0x26fc6e1852b888c774cb34ca4b04bd5ec15affa655d6ebefc74c40221b6715d7","0x11a8abf5aaf488bfb55cb2843e4e3ebf8255d8eb66a795704f3b81be4b1e8db1"]],"gamma_abc":[["0x0d7208a6939ab9d78aa681a15427f096bb01170ca60e29f454066e12dda26cc3","0x0053006d8b2bd0f9e9428f5e0ca440a5f4c19f2486b4d2df8d6054ed38e68ee0"]]}',
  ];

  console.log(typeof proof[0]);
  console.log(typeof proof[1]);

  const verify = await verifierContract.verifyProof(proof, {
    gasLimit: 1000000,
  });
  const verifyTx = await verify.wait();
  console.log(verifyTx.transactionHash);
};

main();
