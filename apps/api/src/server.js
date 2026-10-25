import "dotenv/config";
import app from "./app.js";
import { connectDatabase } from "./config/database.js";

const port = Number(process.env.PORT || 4000);

async function startServer() {
  try {
    await connectDatabase();

    app.listen(port, "127.0.0.1", () => {
      console.log(`Commerce API running at http://127.0.0.1:${port}`);
    });
  } catch (error) {
    console.error("Could not start the API:", error.message);
    process.exit(1);
  }
}

startServer();