const sdk = require("node-appwrite");
const dotenv = require("dotenv");

dotenv.config({ path: "./config.env" });

const client = new sdk.Client();
client
  .setEndpoint(process.env.APPWRITE_ENDPOINT)
  .setProject(process.env.APPWRITE_PROJECT_ID)
  .setKey(process.env.APPWRITE_API_KEY);

module.exports = client;
