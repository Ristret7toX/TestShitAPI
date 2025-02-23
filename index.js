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

app.get("/table", async (req, res) => {
  try {
    const snapshot = await db.collection("data").get();

    if (snapshot.empty) {
      return res.send("<h1>No business data found</h1>");
    }

    const businesses = snapshot.docs.map(doc => doc.data());

    let tableRows = businesses.map(business => `
      <tr>
        <td>${business.businessName}</td>
        <td>${business.trade}</td>
        <td>${business.phone}</td>
        <td>${business.website}</td>
        <td>${business.email}</td>
      </tr>
    `).join("");

    let htmlResponse = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Business Table</title>
        <style>
          table { width: 100%; border-collapse: collapse; }
          th, td { border: 1px solid black; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
        </style>
      </head>
      <body>
        <h1>Business Listings</h1>
        <table>
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Trade</th>
              <th>Phone</th>
              <th>Website</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            ${tableRows}
          </tbody>
        </table>
      </body>
      </html>
    `;

    res.send(htmlResponse);
  } catch (error) {
    console.error("Error fetching business data:", error);
    res.status(500).send("<h1>Internal Server Error</h1>");
  }
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

// Save extracted business data to Firestore in "data" collection
app.post("/save-business", async (req, res) => {
  try {
    const businessInfo = req.body;

    if (!businessInfo || Object.keys(businessInfo).length === 0) {
      return res.status(400).json({ error: "Business info is required" });
    }

    await db.collection("data").add({
      ...businessInfo,
      timestamp: new Date().toISOString()
    });

    console.log("Business data saved to 'data' collection.");
    return res.json({ message: "Business data saved successfully" });
  } catch (error) {
    console.error("Error saving business data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get all saved business data from Firestore
app.get("/businesses", async (req, res) => {
  try {
    const snapshot = await db.collection("data").get();

    if (snapshot.empty) {
      return res.status(404).json({ message: "No business data found" });
    }

    const businesses = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return res.json(businesses);
  } catch (error) {
    console.error("Error fetching business data:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = app;
