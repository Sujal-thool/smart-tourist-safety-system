import { ethers } from 'ethers';

// Create a single server wallet to act as the Authority
// In production, this would be a secure private key loaded from .env
const authorityWallet = ethers.Wallet.createRandom();

/**
 * Creates a true Web3 Digital Identity using ethers.js
 * Generates an Ethereum-compliant keccak256 hash of the KYC data
 * and signs it with the Authority Wallet to create a verifiable Identity Token.
 */
export const generateBlockchainHash = async (data) => {
  const dataString = JSON.stringify(data);
  
  // 1. Hash the KYC data using Ethereum's keccak256
  const dataBytes = ethers.toUtf8Bytes(dataString);
  const dataHash = ethers.keccak256(dataBytes);
  
  // 2. Sign the hash to create an immutable Identity Signature (Tx Hash equivalent)
  const signature = await authorityWallet.signMessage(ethers.getBytes(dataHash));
  
  console.log(`\n🔗 [Web3] Digital ID Minted!`);
  console.log(`Data Hash: ${dataHash}`);
  console.log(`Signature: ${signature.substring(0, 40)}...\n`);
  
  return signature;
};

export const verifyBlockchainHash = async (data, signature) => {
  const dataString = JSON.stringify(data);
  const dataBytes = ethers.toUtf8Bytes(dataString);
  const dataHash = ethers.keccak256(dataBytes);
  
  // Recover the signer from the signature
  const recoveredAddress = ethers.verifyMessage(ethers.getBytes(dataHash), signature);
  
  return recoveredAddress === authorityWallet.address;
};
