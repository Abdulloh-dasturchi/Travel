const User = require("../models/user.model");
const UserTravel = require("../models/userTravel.model");
const Travel = require("../models/travel.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const MailService = require('../service/mail.service');
const moment = require("moment");  
const uuid = require("uuid");
const mongoose = require("mongoose");
// Functions 
// O'tgan sayohatlarni tekshirish va ularni foydalanuvchidan olib tashlash
const removeExpiredTravels = async (user) => {
    const currentDate = moment();  // Hozirgi vaqt

    // Foydalanuvchining favorites ro'yxatidagi sayohatlarni tekshirish
    if (user.favorites && user.favorites.length > 0) {
        user.favorites = await Promise.all(user.favorites.map(async (_id) => {
            const travel = await Travel.findById(new mongoose.Types.ObjectId(_id));
            if (!travel) return null; // Agar sayohat topilmasa null qaytarish

            // Agar sayohat muddati o'tgan bo'lsa, uni olib tashlash
            if (moment(travel.from).isBefore(currentDate)) {
                return null;
            }
            return _id;
        }));
    } else {
        user.favorites = [];
    }

    // Foydalanuvchining travels ro'yxatidagi sayohatlarni tekshirish
    if (user.travels && user.travels.length > 0) {
        user.travels = await Promise.all(user.travels.map(async (travelId) => {
            const travel = await Travel.findById(new mongoose.Types.ObjectId(travelId));
            if (!travel) return null; // Agar sayohat topilmasa null qaytarish

            // Agar sayohat muddati o'tgan bo'lsa, uni olib tashlash
            if (moment(travel.from).isBefore(currentDate)) {
                return null;
            }
            return travelId;
        }));
    } else {
        user.travels = [];
    }

    // Null qiymatlarni ro'yxatdan olib tashlash
    user.favorites = user.favorites.filter(item => item !== null);
    user.travels = user.travels.filter(item => item !== null);

    await user.save();  // Foydalanuvchini saqlash
};



//

// @desc    Register User
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = asyncHandler(async (req, res, next) => {
    const { username, email, password,telNumber } = req.body;
    if(!username || !email || !password || !telNumber){
        return next(new ErrorResponse("Please provide all required fields", 400));
    }
    if(await User.findOne({email})){
        return next(new ErrorResponse("Email already exists", 400));
    }
    if(await User.findOne({username})){
        return next(new ErrorResponse("Username already exists", 400));
    }
    if(await User.findOne({telNumber})){
        return next(new ErrorResponse("Phone number already exists", 400));
    }
    if(password.length < 6){
        return next(new ErrorResponse("Password must be at least 6 characters", 400));
    }
    if(await User.findOne({password})){
        return next(new ErrorResponse("Password already exists", 400));
    }
    const apiKey = uuid.v4();
    const user = await User.create({username,email,password,telNumber,apiKey});
    const token = user.getJWT()
    res.status(201).json({
        message:"User registered successfully",
        success:true,
        data:user,
        token
    })
});

// @desc    Login User
// @router  POST /api/v1/auth/login
// @access  Public
exports.login = asyncHandler(async (req, res, next) => {
    const { email, password, username } = req.body;

    if (!email && !username) {
        return next(new ErrorResponse("Please provide either an email or a username", 400));
    }

    if (!password) {
        return next(new ErrorResponse("Please provide a password", 400));
    }

    // Check if either email or username exists in the database
    const user = await User.findOne({ $or: [{ email }, { username }] });

    if (!user) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Check if the password matches
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
        return next(new ErrorResponse("Invalid credentials", 401));
    }

    // Generate JWT token
    const token = user.getJWT();

    res.status(200).json({
        message: "Login successfully",
        success: true,
        data: user,
        adminStatus: user.adminStatus,
        token
    });
});

// @desc    Profile  User
// @router  GET /api/v1/auth/profile
// @access  Public
exports.profile = asyncHandler(async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    res.status(200).json({
        message:"Profile finded",
        success:true,
        data:user
    })
})

// @desc    Avatar  User
// @router  POST /api/v1/auth/avatar
// @access  Public
exports.avatar = asyncHandler(async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    user.avatar = `http://localhost:4000/public/uploads/${req.files.avatar[0].filename}`;
    await user.save();
    res.status(200).json({
        message:"Avatar updated",
        success:true,
        data:user,
    })
})

// @desc    Profile  User
// @router  Put /api/v1/auth/put
// @access  Public
exports.updateProfile = asyncHandler(async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    const { username, email, telNumber } = req.body;
    user.username = username;
    user.email = email;
    user.telNumber = telNumber;
    await user.save();
    res.status(201).json({
        message:"Profile updated",
        success:true,
        data:user,
    })
})

// @desc    Profile  User
// @router  POST /api/v1/auth/profile/favourite/post
// @access  Public
exports.addFavourite = asyncHandler(async (req,res,next)=>{
    const user = await User.findById(req.user.id);
    const tour = await Travel.findById(req.body.travel_id);
    if(!tour){
        return next(new ErrorResponse("Tour not found", 400));
    }
    if(user.favorites.includes(tour._id)){
        return next(new ErrorResponse("You have already added this tour to your favorites", 400));
    }
    user.favorites = tour._id;
    await user.save();
    res.status(201).json({
        message:"Add favourite",
        success:true,
        data:user,
    })
})

// @desc    Profile  User get favorites
// @router  GET /api/v1/auth/profile/favourite/get
// @access  Public
exports.allFavourites = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    // O'tgan sayohatlarni foydalanuvchidan olib tashlash
    await removeExpiredTravels(user);

    const travels = await Travel.find({ _id: { $in: user.favorites } });

    res.status(200).json({
        message: "All favourites found",
        success: true,
        data: travels,
    });
});

// @desc    Delete from favourites
// @router  DELETE /api/v1/auth/profile/favourite/delete
// @access  Public
exports.deleteFavourites = asyncHandler(async (req, res, next) => {
    const { travel_id } = req.body;  // `travel_id`ni request body'dan olish

    // Foydalanuvchini topish
    const user = await User.findById(req.user.id);

    // Foydalanuvchi topilmasa xato qaytarish
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    // Agar favourites maydoni bo'lmasa, uni bo'sh massiv sifatida yaratish
    if (!user.favorites) {
        user.favorites = [];
    }

    // Favourites massivida `travel_id`ni topib, o'chirish
    const index = user.favorites.indexOf(travel_id);
    if (index === -1) {
        return next(new ErrorResponse("Travel not found in favourites", 404));
    }

    // `travel_id`ni o'chirish
    user.favorites.splice(index, 1);
    await user.save();

    res.status(200).json({
        message: "Travel removed from favourites",
        success: true,
        data: user.favorites,
    });
});

// @desc    Send OTP to email
// @router  POST /api/v1/auth/sendOtp
// @access  Public
exports.sendOtp = asyncHandler(async (req, res, next) => {
    const { email } = req.body;

    if (!email) {
        return next(new ErrorResponse("Email is required", 400));
    }

    const user = await User.findOne({ email });
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    // Send OTP
    const mailService = new MailService();
    const otp = await mailService.sendOtp(email);

    // Save OTP in the user record temporarily
    user.otp = otp;
    await user.save();

    res.status(200).json({
        message: "OTP sent successfully",
        success: true,
    });
});

// @desc    Profile User password update
// @router  UPDATE /api/v1/auth/profile/changePassword
// @access  Public
exports.changePassword = asyncHandler(async (req, res, next) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return next(new ErrorResponse("Email, OTP, and new password are required", 400));
    }

    // Step 1: Find user by email
    const user = await User.findOne({ email });

    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    // Step 2: Check OTP validity
    const mailService = new MailService();
    const validOtp = await mailService.verifyOtp(otp, user.otp);

    if (!validOtp) {
        return next(new ErrorResponse("Invalid OTP", 401));
    }

    // Step 3: Update the password
    user.password = newPassword;
    user.otp = undefined; // Reset OTP after successful verification
    await user.save();

    res.status(200).json({
        message: "Password updated successfully",
        success: true,
        data: user,
    });
});


// @desc    user travels
// @router  POST /api/v1/auth/travel/get
// @access  Public
exports.userTravels = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    // O'tgan sayohatlarni foydalanuvchidan olib tashlash
    await removeExpiredTravels(user);

    const travels = await Travel.find({ _id: { $in: user.travels } });

    res.status(200).json({
        message: "User travels",
        success: true,
        data: travels,
    });
});

// Delete UserTravel
// DELETE
// Private
exports.deleteUserTravel = asyncHandler(async (req, res, next) => {
    const { travelId } = req.body;  // travelId ni req.body dan olamiz

    // Find the user by ID (assuming req.user.id contains the logged-in user's ID)
    const user = await User.findById(req.user.id);

    // Check if the travel exists in the user's userTravels array
    if (!user.userTravels.includes(travelId)) {
        return next(new ErrorResponse("Sizning bu safar bilan aloqangiz yo'q", 404));
    }

    // Remove the travel from the user's userTravels array
    user.userTravels = user.userTravels.filter((id) => id.toString() !== travelId);

    // Find and delete the UserTravel entry by its ID
    const userTravel = await UserTravel.findByIdAndDelete(travelId);

    // If no travel found, return an error
    if (!userTravel) {
        return next(new ErrorResponse("Siz so'ragan safar topilmadi", 404));
    }

    // Save the user after removing the travel from the userTravels array
    await user.save();

    res.status(200).json({
        message: "User travel deleted successfully",
        success: true,
        data: userTravel,
    });
});

// @desc    All Users 
// @router  GET /api/v1/auth/users
// @access  Private
exports.allUsers = asyncHandler(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        message: "All users",
        success: true,
        data: users,
    });
})

// one user
exports.oneUser = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    res.status(200).json({
        message: "One user",
        success: true,
        data: user,
    });
})




