const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("Deploying DResumeSBT contract to Polygon Amoy...");

  const DResumeSBT = await hre.ethers.getContractFactory("DResumeSBT");
  const dResumeSBT = await DResumeSBT.deploy();

  await dResumeSBT.waitForDeployment();

  const contractAddress = await dResumeSBT.getAddress();
  console.log("DResumeSBT deployed to:", contractAddress);

  const deploymentInfo = {
    contractAddress: contractAddress,
    network: "polygon-amoy",
    chainId: 80002,
    deployedAt: new Date().toISOString()
  };

  const deploymentPath = path.join(__dirname, "..", "src", "lib", "contract-address.json");
  fs.mkdirSync(path.dirname(deploymentPath), { recursive: true });
  fs.writeFileSync(deploymentPath, JSON.stringify(deploymentInfo, null, 2));

  console.log("Deployment info saved to:", deploymentPath);
  console.log("Contract Address:", contractAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
