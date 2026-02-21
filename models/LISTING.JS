// MODEL/LISTING.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

const listingSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  image: {
    url: {
      type: String,
      default: "https://www.freepik.com/free-photos-vectors/2d-house",
      set: v =>
        v === ""
          ? "https://www.freepik.com/free-photos-vectors/2d-house"
          : v,
    },
    filename: String,
  },
  price: Number,
  location: String,
  country: String,

  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: "Review",
    },
  ],

  owner: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // MODEL/LISTING.js
category: {
  type: String,
  enum: [
    "Trending","Rooms","Mountain","Beach","Forest","Lake",
    "City","Snow","Camping","Farm","Boats","Homes","Luxury","Village"
  ],
  default: "Trending"
},


  geometry: {
    type: {
      type: String,
      enum: ["Point"],      // GeoJSON type
      required: true,
    },
    coordinates: {
      type: [Number],       // [lng, lat]
      required: true,
    },
  },
});

// delete all reviews when a listing is deleted
listingSchema.post("findOneAndDelete", async listing => {
  if (listing) {
    await Review.deleteMany({ _id: { $in: listing.reviews } });
  }
});

const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;
