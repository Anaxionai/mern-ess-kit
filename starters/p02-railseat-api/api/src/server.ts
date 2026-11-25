// The RailSeat API starts here: npm run dev (node --watch src/server.ts).

import { app } from "./app.ts";
import { connectDb, MONGODB_URI } from "./db.ts";

const PORT = Number(process.env.PORT ?? 3000);

await connectDb();
app.listen(PORT, () => {
  // Never log the whole address if it ever holds a password.
  console.log(
    `RailSeat API on http://localhost:${PORT} (MongoDB: ${MONGODB_URI.split("@").pop()})`,
  );
});
