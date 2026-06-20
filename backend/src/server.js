import "dotenv/config";
import app from "./app.js";
import connectDB from "./config/db.js";

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
  console.error("MONGO_URI and JWT_SECRET must be set in the environment");
  process.exit(1);
}

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
