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

app.post("/save", async (req, res) => {
  try {
    const data = req.body;
    if (!data) return res.status(400).json({ error: "Data is required" });

    await db.collection("objects").add({
      data,
      timestamp: new Date().toISOString()
    });
    console.log("Saved");
    return res.json({ message: "Object saved successfully" });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all saved objects from Firestore
app.get("/objects", async (req, res) => {
  try {
    const snapshot = await db.collection("objects").get();
    if (snapshot.empty) {
      return res.status(404).json({ message: "No objects found" });
    }

    const objects = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.json(objects);
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
