const ethers = require("ethers");

let OPE_TEST_RPC_URL = "http://34.150.88.147:18602";
let decryptPrivatekey = "c5a0a3af70527b752ccf587e5acafc160dfbb51028735eba921fc24a11c63764";

let deployedJson = require("../deployed.json");
let abiContent = require("../contracts/Lock.json");

async function demo() {
  //let provider=new ethers.providers.JsonRpcProvider(OPE_TEST_RPC_URL); //for ether.js v5
  let provider = new ethers.JsonRpcProvider(OPE_TEST_RPC_URL); //for ether.js v6
  const signer = new ethers.Wallet(decryptPrivatekey, provider);

  //console.log("abiJson:",abiContent);
  console.log("deployed address:",deployedJson.address);
  let contract = new ethers.Contract(deployedJson.address, abiContent, signer);

  let balance0 = await provider.getBalance(signer.getAddress());
  console.log("balance0:",balance0);
  //let balanceInEth0 = ethers.utils.formatEther(balance0); //for ether.js v5
  let balanceInEth0 = ethers.formatEther(balance0); //for ether.js v6
  console.log("The orginal balance of wallet is ", balanceInEth0);

  let tx = await contract.withdraw();
  console.log("tx:",tx);
  await tx.wait();

  let balance1 = await provider.getBalance(signer.getAddress());
  let balanceInEth1 = ethers.formatEther(balance1);
  console.log("After withdraw,the balance of wallet is ", balanceInEth1);
}

demo()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
