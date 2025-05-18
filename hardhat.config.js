require("@nomicfoundation/hardhat-toolbox")

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.20",
  networks: {
    amoy: {
      url: "https://rpc-amoy.polygon.technology/",
      accounts: [process.env.PRIVATE_KEY || "8f5636a46a2fb9e14a401aecc17a28ce813242b0133959fa050260f64ca2b716"],
      chainId: 80002, // Polygon Amoy testnet chain ID
    },
    hardhat: {
      // For local development
    },
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
}
