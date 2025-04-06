import { Client, Account, Databases } from "appwrite";

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1") // Your API Endpoint
  .setProject("67cb42410000c1e48f09"); // Your project ID

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
