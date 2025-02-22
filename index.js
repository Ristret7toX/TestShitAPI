const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");

// Load .env only in development
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
  }),
});

const db = admin.firestore();
const app = express();
app.use(express.json());
app.use(cors({ origin: "*", methods: ["POST", "GET"] }));

app.get("/", async (req, res) => {
  res.send("Hello COK!");
});

// Save URL to Firestore
app.post("/save", async (req, res) => {
  try {
    const { url } = req.body;
    if (!url) return res.status(400).json({ error: "URL is required" });

    await db.collection("urls").add({ url, timestamp: new Date().toISOString() });
    console.log("Saved");
    return res.json({ message: "URL saved successfully" });
  } catch (error) {
    console.error("Error:", error);
    console.log("error");

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = { app };
