// routes/fixproject.js
const mongoose = require("mongoose");
const Listing = require("../MODEL/LISTING");  // .. because we're inside routes/
const User = require("../MODEL/user");       // adjust name if your file is different

(async () => {
  await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

  const user = await User.findOne();
  if (!user) {
    console.log("No user found");
    process.exit(0);
  }

  const result = await Listing.updateMany(
    { $or: [{ owner: { $exists: false } }, { owner: null }] },
    { $set: { owner: user._id } }
  );

  console.log("Listings fixed:", result.modifiedCount);
  await mongoose.disconnect();
})();
