import mongoose from 'mongoose';

mongoose.connect('mongodb://localhost:27017/tourist_safety');

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.model('User', userSchema);

const touristIdSchema = new mongoose.Schema({}, { strict: false });
const TouristID = mongoose.model('TouristID', touristIdSchema);

async function run() {
  const users = await User.find({});
  const touristIds = await TouristID.find({});
  console.log("USERS:");
  console.log(JSON.stringify(users, null, 2));
  console.log("\nTOURIST IDs:");
  console.log(JSON.stringify(touristIds, null, 2));
  process.exit(0);
}

run();
