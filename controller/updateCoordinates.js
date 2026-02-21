require("dotenv").config();
const mongoose = require("mongoose");
const Listing = require("../MODEL/LISTING");
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");

const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");

async function updateListings() {
  const listings = await Listing.find({});

  for (let listing of listings) {
    if (!listing.location) continue;

    const geoResponse = await geocodingClient
      .forwardGeocode({
        query: listing.location,
        limit: 1,
      })
      .send();

    if (geoResponse.body.features.length) {
      listing.geometry = geoResponse.body.features[0].geometry;
      await listing.save();
      console.log(`Updated: ${listing.title}`);
    }
  }

  console.log("All listings updated!");
  mongoose.connection.close();
}

updateListings();
