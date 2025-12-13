import axios from 'axios';

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

export async function uploadToIPFS(data: object): Promise<string> {
  try {
    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinJSONToIPFS',
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    throw new Error('Failed to upload to IPFS');
  }
}

export async function uploadFileToIPFS(file: Buffer, fileName: string): Promise<string> {
  try {
    const formData = new FormData();
    const blob = new Blob([file]);
    formData.append('file', blob, fileName);

    const response = await axios.post(
      'https://api.pinata.cloud/pinning/pinFileToIPFS',
      formData,
      {
        headers: {
          'pinata_api_key': PINATA_API_KEY,
          'pinata_secret_api_key': PINATA_SECRET_KEY,
        },
      }
    );
    return response.data.IpfsHash;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw new Error('Failed to upload file to IPFS');
  }
}

export function getIPFSUrl(hash: string): string {
  return `https://gateway.pinata.cloud/ipfs/${hash}`;
}

export async function fetchFromIPFS(hash: string): Promise<unknown> {
  try {
    const response = await axios.get(getIPFSUrl(hash));
    return response.data;
  } catch (error) {
    console.error('Error fetching from IPFS:', error);
    throw new Error('Failed to fetch from IPFS');
  }
}
