const jwt = require('jsonwebtoken')
const dotenv =  require('dotenv')
dotenv.config()
const jwt_secret = process.env.JWTK

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json('No token provided')
  }

  const token = authHeader.split(' ')[1]

  try {
    const verify = jwt.verify(token, jwt_secret)
    req.userId = verify.userId
    next()
  } catch (err) {
    return res.status(401).json('Invalid or expired token')
  }
}
