require('dotenv').config();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const User = require('./models/user');
const sampleData = require('./init/data');

mongoose.connect(process.env.mongo_url)
  .then(async () => {
    console.log('✅ Connected to Atlas');
    const user = await User.findOne();
    if (!user) {
      console.log('❌ No user! Visit /demoUser first');
      process.exit(1);
    }
    
    await Listing.deleteMany({});
    await Listing.insertMany(sampleData.data.map(listing => ({
      ...listing,
      owner: user._id
    })));
    console.log('🎉 Seeded 30+ listings!');
    mongoose.connection.close();
  }).catch(err => {
    console.error(err);
    process.exit(1);
  });
