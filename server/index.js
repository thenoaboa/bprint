require('dotenv').config(); // Load environment variables from .env file
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = process.env.DB_URI; // Ensure this is correctly loaded from your .env file

console.log("Attempting to connect to MongoDB with URI:", uri);

const client = new MongoClient(uri, {
  serverApi: ServerApiVersion.v1,
  strict: true,
  deprecationErrors: true,
});

async function run() {
  try {
    console.log("Initializing connection...");
    await client.connect();
    console.log("Connected successfully to MongoDB");

    // For debugging: Log the databases available (requires listDatabases permission)
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    // Log detailed error information if available
    if (err instanceof Error) {
      console.log("Error name:", err.name);
      console.log("Error message:", err.message);
      console.log("Error stack:", err.stack);
    }
  } finally {
    console.log("Closing connection...");
    await client.close();
    console.log("Connection closed.");
  }
}

run().catch(console.dir);