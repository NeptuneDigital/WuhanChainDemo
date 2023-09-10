require("@nomicfoundation/hardhat-toolbox");


//Complile :
// npx hardhat compile
//Deploy : 
// npx hardhat run --network ope_test scripts/deploy.js
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "ope_test",
  networks: {
    hardhat: {
      chainId: 1337
    },
    ope_test: {
      url: `http://34.150.88.147:18602`,
      chainId: 5555,
      accounts: ["c5a0a3af70527b752ccf587e5acafc160dfbb51028735eba921fc24a11c63764"],
      //accounts: [process.env.privateKey]
    }
  },
  solidity: "0.8.19",
};
