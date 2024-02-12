require('dotenv').config(); // Load environment variables from .env file
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URI; // Make sure this is correctly loaded from your .env file

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    console.log("Connected successfully to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  } finally {
    await client.close();
  }
}

run().catch(console.dir);
