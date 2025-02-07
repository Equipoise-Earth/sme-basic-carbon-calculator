// functions/src/index.ts
import * as functions from "firebase-functions";
import * as express from "express";
import * as path from "path";

const app = express();
const buildPath = path.join(__dirname, "../../public"); // Match "public" in firebase.json

app.use(express.static(buildPath));

app.get("/*", (req, res) => {
  res.sendFile(path.join(buildPath, "index.html"));
});

// Export with the correct name
exports.nextApp = functions.https.onRequest(app);
