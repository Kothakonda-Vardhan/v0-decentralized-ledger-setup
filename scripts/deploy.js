// Script to deploy the FoodLogisticsTracker contract
const hre = require("hardhat")

async function main() {
  console.log("Deploying FoodLogisticsTracker contract...")

  // Get the contract factory
  const FoodLogisticsTracker = await hre.ethers.getContractFactory("FoodLogisticsTracker")

  // Deploy the contract
  const foodLogisticsTracker = await FoodLogisticsTracker.deploy()

  // Wait for deployment to finish
  await foodLogisticsTracker.waitForDeployment()

  // Get the contract address
  const contractAddress = await foodLogisticsTracker.getAddress()

  console.log(`FoodLogisticsTracker deployed to: ${contractAddress}`)
  console.log("Deployment completed successfully!")
}

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Error during deployment:", error)
    process.exit(1)
  })
