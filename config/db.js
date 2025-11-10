const mongoose = require('mongoose');

const uri = process.env.MONGOURL;

if (!uri) {
  console.error("❌ MONGOURL is not defined in your .env file!");
  console.error("⚠️ App will continue but database operations will fail!");
  // Don't exit - let the app start and show errors
}

// MongoDB Atlas connection options for production deployment
const options = {
  serverSelectionTimeoutMS: 10000, // Timeout after 10s
  socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
  // Keep bufferCommands enabled so operations can queue until connection is ready
  bufferCommands: true,
  maxPoolSize: 10, // Maintain up to 10 socket connections
  minPoolSize: 2, // Maintain at least 2 socket connections
  maxIdleTimeMS: 30000, // Close connections after 30 seconds of inactivity
};

// Function to connect to MongoDB
const connectDB = async () => {
  if (!uri) {
    console.error("❌ Cannot connect: MONGOURL is not defined");
    return;
  }

  try {
    await mongoose.connect(uri, options);
    // Connection success is logged by the 'connected' event listener
  } catch (err) {
    console.error("❌ MongoDB Atlas connection failed:", err.message);
    console.error("⚠️ Retrying connection in 5 seconds...");
    // Retry connection after 5 seconds
    setTimeout(connectDB, 5000);
  }
};

// Start connection
if (uri) {
  connectDB();
}

// Connection event listeners for better error handling
mongoose.connection.on('connected', () => {
  console.log('✅ Connected to MongoDB Atlas');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Atlas connection error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Disconnected from MongoDB Atlas');
  // Attempt to reconnect
  if (uri) {
    console.log('🔄 Attempting to reconnect...');
    setTimeout(connectDB, 5000);
  }
});

// Handle app termination gracefully
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB Atlas connection closed through app termination');
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await mongoose.connection.close();
  console.log('MongoDB Atlas connection closed through app termination');
  process.exit(0);
});

module.exports = mongoose;
