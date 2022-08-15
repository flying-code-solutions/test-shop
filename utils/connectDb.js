import mongoose from "mongoose";

const connection = {};

async function connectDb() {
  if (connection.isConnected) {
    // Use existing DB connection
    console.log("Using an existing DB connection.");
    return;
  }
  // Use a new DB connection
  const db = await mongoose.connect(process.env.MONGO_SRV);
  console.log("DB connected.");

  connection.isConnected = db.connections[0].readyState;
}

export default connectDb;
