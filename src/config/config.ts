import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "..", "..", ".env") });

const PORT = process.env.PORT || 3000;
const SEND_GRID_API_KEY = process.env.SEND_GRID_API_KEY || "";
const MONGO_URI = process.env.MONGO_URI || "";
const JWT_SECRET = process.env.JWT_SECRET || "";

const configs = {
  PORT,
  SEND_GRID_API_KEY,
  MONGO_URI,
  JWT_SECRET,
};

export default configs;
