const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  console.log('connecting to database...');
  await mongoose.connect(process.env.DB);
  console.log('connected to database');
}

module.exports = connectDB;
