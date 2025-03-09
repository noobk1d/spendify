const { Client, Account } = require("node-appwrite");
const AppError = require("../utils/appError");

const client = new Client()
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("67cb42410000c1e48f09")
  .setKey(
    "standard_870027465b52a57c020987a38932b9385eff07dd88e3b3857899ef72ab0aad418fb80946c48951a63fb8cb13466c496e01f423bbf0f1d731a1439c79cfb6f94858a19f12c01cd527693b11f7505cc40ff4fe57f5ce8972e43fcfc16827d4d836f1cf29c8a7ba58bf8d3682634db8c1d7a0319071d2c029e7e1896d6a9e4609c8"
  ); // Use a server key, not a client key!

const account = new Account(client);

exports.loginUser = async (email, password) => {
  console.log(1);
  try {
    // Authenticate user (session won't be used)
    const session = await account.createEmailPasswordSession(email, password);

    // Generate JWT token from Appwrite
    const jwt = await account.createJWT(session);

    // // Set JWT token as HTTP-only cookie

    return session;
  } catch (error) {
    throw new AppError(error.message, 401);
  }
};
