const BuyTravel = require("../models/buyTravels.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const User = require("../models/user.model");
const Travel = require("../models/travel.model");
const Hotel = require("../models/hotel.model");  // Hotel modeli
const BuyHotel = require("../models/buyHotels.model");  // BuyHotel modeli
// @desc    Travel sotib olish
// @router  POST /api/v1/auth/travel/buy
// @access  Public
exports.buyTravel = asyncHandler(async (req, res, next) => {
    const { travel_id, people } = req.body; // `people` arrayda odamlar ro'yxati bo'ladi

    const user = await User.findById(req.user.id);
    const travel = await Travel.findById(travel_id);

    if (!travel) {
        return next(new ErrorResponse("Travel not found", 404));
    }
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }

    // Validate `people` array
    if (!Array.isArray(people) || people.length === 0) {
        return next(new ErrorResponse("People array is required", 400));
    }

    // Create a new `BuyTravel` document
    const buyTravel = await BuyTravel.create({
        userId: user._id,
        travelId: travel._id,
        people: people.map((person) => ({
            firstName: person.firstName,
            lastName: person.lastName,
            gender: person.gender,
            familyPosition: person.familyPosition,
            nationality: person.nationality,
            birthDate: person.birthDate,
            passport: person.passport,
            phoneNumber: person.phoneNumber,
            email: person.email,
            birthCountry: person.birthCountry,
        })),
    });

    travel.howMany += people.length;
    travel.save();
    user.travels.push(travel._id);
    await user.save();

    res.status(201).json({
        message: "Travel buyed successfully",
        success: true,
        data: buyTravel,
    });
});

// @desc    Hotel sotib olish
// @router  POST /api/v1/auth/hotel/buy
// @access  Public
exports.buyHotel = asyncHandler(async (req, res, next) => {
    const { hotel_id, people } = req.body; // `people` arrayda odamlar ro'yxati bo'ladi

    const user = await User.findById(req.user.id);  // Foydalanuvchi topish
    const hotel = await Hotel.findById(hotel_id);  // Hotelni topish

    if (!hotel) {
        return next(new ErrorResponse("Hotel not found", 404));  // Agar hotel topilmasa
    }
    if (!user) {
        return next(new ErrorResponse("User not found", 404));  // Agar foydalanuvchi topilmasa
    }

    // Validate `people` array
    if (!Array.isArray(people) || people.length === 0) {
        return next(new ErrorResponse("People array is required", 400));  // Agar odamlar ro'yxati noto'g'ri bo'lsa
    }
    
    // Create a new `BuyHotel` document
    const buyHotel = await BuyHotel.create({
        userId: user._id,
        hotelId: hotel._id,
        people: people.map((person) => ({
            firstName: person.firstName,
            lastName: person.lastName,
            gender: person.gender,
            familyPosition: person.familyPosition,
            nationality: person.nationality,
            birthDate: person.birthDate,
            passport: person.passport,
            phoneNumber: person.phoneNumber,
            email: person.email,
            birthCountry: person.birthCountry,
        })),
    });

    hotel.howMany += people.length;
    hotel.save();
    user.hotels.push(hotel._id);
    await user.save();

    res.status(201).json({
        message: "Hotel booked successfully",
        success: true,
        data: buyHotel,
    });
});

// all buyed travels
// GET
// Public
exports.getAllBuyedTravels = asyncHandler(async (req, res, next) => {
    const buyedTravels = await BuyTravel.find();
    res.status(201).json({
        message: "All buyed travels found",
        success: true,
        data: buyedTravels,
    });
});

// all buyed hotels
// GET
// Public
exports.getAllBuyedHotels = asyncHandler(async (req, res, next) => {
    const buyedHotels = await BuyHotel.find();
    res.status(201).json({
        message: "All buyed hotels found",
        success: true,
        data: buyedHotels,
    });
});