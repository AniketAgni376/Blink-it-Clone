const mongoose = require('mongoose');

const uri = process.env.MONGOURL;

if (!uri) {
  console.error("❌ MONGOURL is not defined in your .env file!");
  process.exit(1);
}

mongoose.connect(uri)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));

module.exports = mongoose;
