const axios = require("axios");
const AppError = require("../utils/appError");

const verifyAppwriteJWT = async (req, res, next) => {
  try {
    // Get the token from the request header
    const token = req.headers.authorization?.split(" ")[1]; // "Bearer <TOKEN>"

    if (!token) {
      throw new AppError("Authentication token is missing!", 401);
    }

    // ✅ Verify JWT with Appwrite
    const response = await axios.get(
      "https://cloud.appwrite.io/v1/account/sessions/jwt",
      {
        headers: {
          "X-Appwrite-Project": process.env.APPWRITE_PROJECT_ID,
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ If valid, attach user data to request
    req.user = response.data;
    next(); // Move to the next middleware/route handler
  } catch (error) {
    next(new AppError("Invalid or expired token!", 401));
  }
};

module.exports = verifyAppwriteJWT;
