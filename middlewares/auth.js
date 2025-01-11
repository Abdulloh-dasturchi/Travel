const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../models/user.model");
const rateLimit = require("express-rate-limit");
require("dotenv").config()
// Himoya middleware
exports.authenticate = asyncHandler(async (req, res, next) => {
    let token;
  
    // Tokenni olish
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }
  
    if (!token) {
      return next(new ErrorResponse("No token provided", 401));
    }
  
    try {
      // Tokenni tekshirish
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if(!decoded){
        return next(new ErrorResponse("No decoded partials"))
      }
  
      const user = await User.findById(decoded.id);
      console.log("User:", user);
      if (!user) {
          return res.status(404).json({ message: "No user found" });
      }
  
      // `req.user` ni o'rnatish
      req.user = user;
      next();
    } catch (error) {
      return next(new ErrorResponse("Invalid token", 401));
    }
  });
  

// Muayyan rollarga kirishni ruxsat berish
exports.adminAccess = (req, res, next) => {
  if (!req.user.adminStatus) {
    return next(
      new ErrorResponse("This route can be access only admin status users", 403)
    );
  }
  next();
};

exports.limitter = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 daqiqa
  max: 5, // 5 martadan ko'proq login urinishiga ruxsat berilmaydi
  message: 'Too many login attempts from this IP, please try again after 3 minutes.',
  keyGenerator: (req) => req.body.email | req.body.username, // Har bir foydalanuvchi uchun alohida limit qo'yiladi
  handler: (req, res) => {
      res.status(429).json({
          message: 'Too many login attempts, please try again later.',
      });
  }
});

exports.otp = rateLimit({
  windowMs: 3 * 60 * 1000, // 3 daqiqa
  max: 1, // 5 martadan ko'proq login urinishiga ruxsat berilmaydi
  message: 'Too many login attempts from this IP, please try again after 3 minutes.',
  keyGenerator: (req) => req.body.email, // Har bir foydalanuvchi uchun alohida limit qo'yiladi
  handler: (req, res) => {
      res.status(429).json({
          message: 'Too many send otp attempts, please try again later.',
      });
  }
});