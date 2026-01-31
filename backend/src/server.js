import "dotenv/config";
import app from "./app.js";
import { initSchema } from "./config/db.js";

const PORT = process.env.PORT || 3001;

async function start() {
  try {
    await initSchema();
    console.log("Database schema ready.");
  } catch (err) {
    console.error("Database init failed:", err.message);
    process.exit(1);
  }
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

start();
