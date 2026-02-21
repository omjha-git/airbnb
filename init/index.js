// init/index.js

const mongoose = require("mongoose");
const Listing = require("../MODEL/LISTING.js");
const User = require("../MODEL/user.js");
const initData = require("./data.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

const initdb = async () => {
  // connect first
  await mongoose.connect(MONGO_URL);
  console.log("MongoDB connected");

  // get native db handle safely
  const client = mongoose.connection.getClient();
  const db = client.db();          // default DB from connection string ("wanderlust")

  // drop entire listings collection if it exists
  const collections = await db.listCollections({ name: "listings" }).toArray();
  if (collections.length > 0) {
    await db.dropCollection("listings");
    console.log("Dropped existing listings collection");
  }

  // use any existing user as owner
  const user = await User.findOne();
  if (!user) {
    console.log("No user found. Please register first.");
    await mongoose.connection.close();
    return;
  }

  const ownerId = user._id;

  // attach owner, keep geometry from data.js
  const simpleData = initData.data.map(obj => ({
    ...obj,
    owner: ownerId,
  }));

  console.log("First seed object:", simpleData[1]); // should show NYC coords
  await Listing.insertMany(simpleData);
  console.log("Listings restored successfully!");

  await mongoose.connection.close();
};

// run
initdb().catch(err => {
  console.error(err);
  mongoose.connection.close();
});
