const PinataSDK = require("@pinata/sdk");
const fs = require("fs-extra");
const path = require("path");
require("dotenv").config();

const pinataApiKey = process.env.PINATA_API_KEY;
const pinataApiSecret = process.env.PINATA_API_SECRET;
const pinata = new PinataSDK(pinataApiKey, pinataApiSecret);

async function uploadToPinata(filePath) {
  const fileAbsolutePath = path.resolve(filePath);
  console.log(`fileAbsolutePath: ${fileAbsolutePath}`);
  const readableStreamForFile = fs.createReadStream(fileAbsolutePath);
  const options = {
    pinataMetadata: {
      name: "test",
    },
  };
  console.log(`uploading file to pinata...`);
  const res = await pinata.pinFileToIPFS(readableStreamForFile, options);
  console.log(`file uploaded to pinata!`);
  return res;
}

async function storeTokenURIMetadata(metadata) {
  const options = {
    pinataMetadata: {
      name: metadata.name,
    },
  };

  try {
    const res = await pinata.pinJSONToIPFS(metadata, options);
    return res;
  } catch (error) {
    console.log(error);
  }
  return null;
}

module.exports = { uploadToPinata, storeTokenURIMetadata };
