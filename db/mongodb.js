import { MongoClient } from "mongodb";

const uri = "mongodb+srv://sudo:qt87PYmvuCuuGwXr@cluster0.ifgbm.mongodb.net";
const options = {};

if (!uri) {
  console.log(process.env.DB_URL);
  throw new Error("Please add your MONGO_URI to .env, ", process.env.DB_URL);
}
let client = new MongoClient(uri, options);
let clientPromise;

if (true) {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  clientPromise = client.connect();
}

export default clientPromise;