const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// NOTE: get the default export, which is the plugin function
const passportLocalMongoose =
  require("passport-local-mongoose").default || require("passport-local-mongoose");

console.log("PLM type:", typeof passportLocalMongoose); // should now be "function"

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true
  }
});

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
