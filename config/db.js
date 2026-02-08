const dotenv = require('dotenv')
const mongoose = require('mongoose')
dotenv.config()
const mongoUri = process.env.MONGO_URI

const connectDB = async () => {mongoose.connect(mongoUri)
.then(() => {
    console.log("Connected to database")
})
.catch (()=>{
    console.log("NOT connected to Database")
})}

module.exports = connectDB
