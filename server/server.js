import app from "./app.js";
import { connectDatabase } from "./config/db.js";

const PORT = process.env.PORT || 3001;

connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });
