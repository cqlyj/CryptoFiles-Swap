const { run } = require("hardhat");

const verify = async (contractAddress, args) => {
  console.log("Verifying contract on Etherscan...");
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    });
  } catch (e) {
    if (e.message.includes("already verified")) {
      console.log("Already verified on Etherscan.");
    }
    console.log(e);
  }
};

module.exports = { verify };
