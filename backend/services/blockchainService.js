import crypto from 'crypto-js';

/**
 * Mocks the process of anchoring KYC data on a blockchain.
 * Returns a SHA-256 hash simulating a transaction ID or digital record signature.
 */
export const generateBlockchainHash = (data) => {
  const dataString = JSON.stringify(data);
  const hash = crypto.SHA256(dataString).toString();
  return `0x${hash}`;
};

export const verifyBlockchainHash = (data, existingHash) => {
  const calculatedHash = generateBlockchainHash(data);
  return calculatedHash === existingHash;
};
