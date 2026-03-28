const express = require("express")
const router = express.Router()
const path = require('path')
const bcrypt = require("bcryptjs")
const jwt = require('jsonwebtoken')

const User = require('../model/User')
const Food = require('../model/Food')
const Book = require('../model/Book')

const { validateBody } = require('../middleware/validate')
const { registerSchema, loginSchema } = require('../validators/authSchema')
const auth = require('../middleware/auth')

const dotenv =  require('dotenv')
dotenv.config()
const map_key = process.env.OPENWEATHER_API_KEY
const jwt_secret = process.env.JWTK
const URLW = "https://api.openweathermap.org/data/2.5/weather";

//functions
function requireLogin(req, res, next) {
  if (!req.session.userId) {
    req.session.redirectTo = req.originalUrl
    return res.redirect('/login')
  }
  next()
}

//api
router.get('/api/weather', async (req, res)=>{
    const city = req.query.city

    if (!req.query.city){
        return res.status(400).json("Empty city!")
    }
    try {
    const params = new URLSearchParams({
      q: city,
      appid: map_key,
      units: "metric"
    });
    const response = await fetch(`${URLW}?${params.toString()}`);

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message);
    }

    const data = await response.json();
    res.json({
        coordLAT: data.coord.lat,
        coordLON: data.coord.lon})
    }
    catch (error) {
      console.log(error)
        return res.status(500).json("Error 500!MapAPI issue")
   }
})
router.get('/api/last-booking', async (req, res) => {
  if(!req.session.lastBookingId){
    return res.status(401).json(null)
  }

  const booking = await Book.findById(req.session.lastBookingId)
  res.json(booking)
})

//webpages
router.get('/booking', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/booking.html'));
})
router.get('/menu', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/menu.html'));
})
router.get('/answer', (req, res) => {
  if (!req.session.lastBookingId){
    return res.redirect('/')
  }
  res.sendFile(path.join(__dirname, '../views/answer.html'))
})
router.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/login.html'))
})
router.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/register.html'))
})
router.get('/logout', (req, res) => {
  res.sendFile(path.join(__dirname, '../views/logout.html'))
})
router.get('/delivery', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, '../views/delivery.html'));
})

//db related anything tbh
router.get('/type/:typename', async (req, res) => {
  try {
    const {typename}= req.params
    const foods = await Food.find({type: typename})
    res.json(foods)
  }
  catch (error) {
    console.error(err);
    res.status(500).send(err.message);

  }
})
router.post('/reservation', async (req, res) => {
  try {
    if (!req.session.userId){
      return res.status(401).json('Login required!')
    }

    const reservation = await Book.create(req.body)
    req.session.lastBookingId = reservation._id
    
    res.json({success: true})
  }
  catch (error) {
    console.log(error)
    res.status(500).json('Reservation failed, server error')
  }
})
router.get('/food/:ids', async (req, res) => {
  try {
    const { ids }= req.params
    const foodid = await Food.findOne({id: ids})
    return res.json(foodid)
  }
  catch (error) {
    console.log(error)
    return res.status(500).json("Error 500! GET food id problem")
  }
})

//auth
router.post('/api/auth/register',validateBody(registerSchema), async (req, res) => {
    try {
        const hashed = await bcrypt.hash(req.body.password, 10)

        const user = await User.create({
            ...req.body,
            password: hashed
        })
        res.status(201)
        res.redirect('/login')

    }
    catch (error) {
        console.log(error)
        return res.status(500).json("Error 500! POST register problem")
    }
});
router.post('/api/auth/login',  validateBody(loginSchema), async (req, res) => {
    try {
        const enter_email = req.body.email
        const enter_password = req.body.password
        const user = await User.findOne({email: enter_email})

        if (!user){
            return res.status(404).json("Error 404! No record of given email")
        }
        
        const match = await bcrypt.compare(enter_password, user.password)
        
        if (!match) {
            return res.status(401).json("Invalid password")
        }

        req.session.userId= user._id
        const token = jwt.sign(
          { userId: user._id },
          jwt_secret,
          { expiresIn: '1h' }
        )

        res.status(200).json({ token })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json("Error 500! POST login problem")
    }
})
router.post('/logout', async (req, res) => {
    try {
        req.session.destroy(error => {
            
            if (error) {
                return res.status(500).json("Error logging out")
            }

            res.clearCookie('connect.sid')
            res.redirect('/')
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json("Error 500! POST logout problem")
    }
})
router.get('/api/users/profile', auth, async (req, res) => {
  const user = await User.findById(req.userId)
  res.json(user)
})
router.put('/api/users/profile', auth, async (req, res) => {
  
  const user2 = {}
  if(req.body.name){
    user2.name = req.body.name
  }
  if(req.body.email){
    user2.email = req.body.email
  }
  if(req.body.password){
    user2.password = await bcrypt.hash(req.body.password, 10)
  }
  const updUser = await User.updateOne({_id: req.userId}, user2)
  res.status(200).json(updUser)
})
router.post('/api/resource', auth, async (req, res) => {
  try {
    const food = await Food.create(req.body)
    res.status(200).json(food)
    }
  catch (error) {
    console.log(error)
    return res.status(500).json("Error 500! POST add food problem")
  }
})
router.get('/api/resource', auth, async(req, res)=>{
  try {
    const all = await Food.find()
    res.status(200).json(all)
  }
  catch (error){
    console.log(error)
    return res.status(500).json("Error 500! GET all food problem")
  }
})
router.get('/api/resource/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const one = await Food.findOne({id: id})
    res.status(200).json(one)
  }
  catch (error){
    console.log(error)
    return res.status(500).json("Error 500! GET one food problem")
  }
})
router.put('/api/resource/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const food2 = {}

    if(req.body.id){
      food2.id = req.body.id
    }
    if(req.body.img){
      food2.img = req.body.img
    }
    if(req.body.name){
      food2.name = req.body.name
    }
    if(req.body.description){
      food2.description = req.body.description
    }
    if(req.body.price){
      food2.price = req.body.price
    }
    if(req.body.currency){
      food2.currency = req.body.currency
    }
    if(req.body.category){
      food2.category = req.body.category
    }
    if(req.body.type){
      food2.type = req.body.type
    }


    const updFood = await Food.updateOne({id: id}, food2)
    res.status(200).json(updFood)
  }
  catch (error){
    console.log(error)
    return res.status(500).json("Error 500! PUT food problem")
  }
})
router.delete('/api/resource/:id', auth, async (req, res) => {
  try {
    const { id } = req.params
    const deleted = await Food.deleteOne({id: id})
    res.status(200).json(deleted)
  }
  catch (error) {
    console.log(error)
    return res.status(500).json("Error 500! GET one food problem")
  }
})

module.exports = router
