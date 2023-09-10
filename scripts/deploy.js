// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");
const solc = require('solc');
const fs = require('fs');
const path=require('path');

async function main() {
  const currentTimestampInSeconds = Math.round(Date.now() / 1000);
  const unlockTime = currentTimestampInSeconds + 60;

  const lockedAmount = hre.ethers.parseEther("0.001");

  const lock = await hre.ethers.deployContract("Lock", [unlockTime], {
    value: lockedAmount,
  });

  await lock.waitForDeployment();

  console.log("Writing deployed smart contract address...");
  const data = {
    address: lock.target,
  };

  //This writes the ABI and address to the mktplace.json
  fs.writeFileSync('./deployed.json', JSON.stringify(data));

  console.log(
    `Lock with ${ethers.formatEther(
      lockedAmount
    )}ETH and unlock timestamp ${unlockTime} deployed to ${lock.target}`
  );

  console.log("Using solc compile smart contract to get ABI and bytecode...")
  compileContract("Lock.sol");



}

/**
 * 
 * @param {*} contractName  abc.sol
 * @returns 
 */
async function compileContract(contractName){
  const input = fs.readFileSync(
					path.join(__dirname, "../contracts/"+contractName)
				);
				const contract = 'contract';
				const inputPrarm = {
					language: 'Solidity',
					sources: {
						contract: {
							content: input.toString(),
						},
					},
					settings: {
						outputSelection: {
							'*': {
								'*': ['*'],
							},
						},
					},
				};

				//1.write *.compile file
				const compileStr = solc.compile(JSON.stringify(inputPrarm));
				const output = JSON.parse(compileStr);

				//如果编译出错直接返回。
				if (output['errors']) {
					const errInfo =
						'Compile ' +
						"contracts/"+contractName +
						' error. ErrInfo: ' +
						JSON.stringify(output['errors']);
					console.log(errInfo);
				}
				fs.writeFileSync(
					path.join(__dirname, "../contracts/"+contractName) +
						'.compile',
					compileStr
				);

				//2.write *.bytecode file
				const solFileName = contractName.substring(
					0,
					contractName.indexOf('.sol')
				);
				const bytecode =
					output.contracts[contract][solFileName].evm.bytecode.object;
				fs.writeFileSync(
					path.join(__dirname, "../contracts/"+solFileName) +
						'.bytecode',
					String(bytecode)
				);

				//3.write *.abi file
				const abi = output.contracts[contract][solFileName].abi;
				fs.writeFileSync(
					path.join(__dirname, "../contracts/"+solFileName) +
						'.json',
					JSON.stringify(abi)
				);

				const responseStr = {
					message:
						'Compile ' +
						contractName +
						' successfully',
					abi: JSON.stringify(abi),
					bytecode: String(bytecode),
				};
				console.log(responseStr);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
