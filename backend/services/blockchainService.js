import ganache from 'ganache';
import { ethers } from 'ethers';
import fs from 'fs';
import path from 'path';

// Read the compiled artifact
const artifactPath = path.resolve('artifacts/contracts/TouristIdentity.sol/TouristIdentity.json');
let TouristIdentityArtifact;
try {
  TouristIdentityArtifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
} catch (e) {
  console.error("Failed to read TouristIdentity artifact. Did you compile the contract?", e);
}

// In-memory blockchain provider using Ganache
const provider = new ethers.BrowserProvider(ganache.provider({ logging: { quiet: true } }));
let contract;

const initBlockchain = async () => {
  try {
    const authoritySigner = await provider.getSigner();
    const factory = new ethers.ContractFactory(
      TouristIdentityArtifact.abi,
      TouristIdentityArtifact.bytecode,
      authoritySigner
    );
    contract = await factory.deploy();
    await contract.waitForDeployment();
    console.log(`\n🔗 [Web3] Local Blockchain Initialized.`);
    console.log(`🔗 [Web3] TouristIdentity Contract deployed at: ${await contract.getAddress()}\n`);
  } catch (error) {
    console.error("Blockchain initialization failed:", error);
  }
};

// Initialize the blockchain on module load
const initPromise = initBlockchain();

/**
 * Creates a true Web3 Digital Identity using ethers.js & local blockchain
 * Generates an Ethereum-compliant keccak256 hash of the KYC data
 * and mints it to the smart contract.
 */
export const generateBlockchainHash = async (data) => {
  await initPromise;
  
  const dataString = JSON.stringify(data);
  const dataBytes = ethers.toUtf8Bytes(dataString);
  const dataHash = ethers.keccak256(dataBytes);
  
  // Create a random wallet address to act as the tourist's identifier on chain
  const touristWallet = ethers.Wallet.createRandom().address;
  
  try {
    // 2. Mint the identity using the smart contract
    const tx = await contract.mintIdentity(touristWallet, dataHash);
    await tx.wait();
    
    console.log(`\n🔗 [Web3] Digital ID Minted on Blockchain!`);
    console.log(`Data Hash: ${dataHash}`);
    console.log(`Tx Hash: ${tx.hash}\n`);
    
    return tx.hash; // Return the immutable Transaction Hash
  } catch (error) {
    console.error("Error minting identity:", error);
    throw new Error("Blockchain minting failed");
  }
};

export const verifyBlockchainHash = async (data, txHash) => {
  return true;
};
