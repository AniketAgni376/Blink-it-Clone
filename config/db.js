const mongoose = require('mongoose');

const uri = process.env.MONGOURL;

if (!uri) {
  console.error("❌ MONGOURL is not defined in your .env file!");
  process.exit(1);
}

mongoose
  .connect(uri, {
    serverSelectionTimeoutMS: 8000,
    maxPoolSize: 10,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    console.error("🔎 MONGOURL host:", (() => {
      try { return new URL(uri.replace('mongodb+srv', 'http').replace('mongodb', 'http')).host; } catch { return 'unknown'; }
    })());
  });

module.exports = mongoose;
