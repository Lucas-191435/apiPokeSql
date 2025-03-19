import "dotenv/config";

const authConfig = {
  secret: process.env.SECRET_KEY,
  expiresIn: "7d",
};

export default authConfig;
