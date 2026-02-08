const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config()
const mongoUri = process.env.MONGO_URI

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected to database")
  } catch (err) {
    console.error("MongoDB connection error:", err.message)
  }
}
module.exports = connectDB

