import * as functions from "firebase-functions";
import next from "next";
import express from "express";

console.log("Initializing server...");

const app = next({
  dev: false,
  conf: { distDir: ".next" }, 
});
const handle = app.getRequestHandler();
const server = express();

// Prepare the Next.js app
app.prepare()
  .then(() => {
    console.log("Next.js app prepared successfully.");
    server.all("*", (req, res) => {
      console.log(`Handling request for ${req.url}`);
      return handle(req, res);
    });
  })
  .catch((err) => {
    console.error("Error during app.prepare():", err);
  });

// ✅ Deploy to europe-west6 only
exports.nextApp = functions
  .region('europe-west6')
  .https.onRequest(server);
