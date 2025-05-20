// lib/mongodb.js
import { MongoClient } from "mongodb";
import { MyConfig } from "./lib/utils/config";

export async function connectToMongoDBS1() {
  // Get your MongoDB connection string from MongoDB Atlas.
  const connectionString: string = MyConfig.uriS1 ?? "N/A";

  // Connect to MongoDB.
  const client = await MongoClient.connect(connectionString);

  // Return the database connection.
  return client.db(MyConfig.dbName);
}

export const Clients = {
  connectToMongoDBS1
}
