const express = require("express")
const app = express()
const session = require('express-session')
const path = require ("path")
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const connectDB = require('./config/db')
const router = require('./routes/allRoutes')
const bcrypt = require("bcryptjs")
require('./routes/allRoutes')
dotenv.config()
const port = process.env.PORT || 3000
const secret = process.env.SESSION_SECRET

connectDB()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')));
app.get("/", (req, res) => {
  res.json({ status: "API running" })
})

app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json('Internal server error')
})


app.use(session({
  secret: secret, 
  resave: false, 
  saveUninitialized: false, 
  cookie: { 
    httpOnly: true
  }
}))
app.use("/", router)

app.listen(port, () => {

    console.log("Server live at", port)})

