const Country = require("../models/country.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");

// Get All Countries
// GET
// Public
exports.getAllCountries = asyncHandler(async (req, res, next) => {
    const allCountries = await Country.find();
    res.status(200).json({
        message: "All countries found",
        success: true,
        data: allCountries
    });
});

// POST countries
// POST
// Public
exports.postCountries = asyncHandler(async (req, res, next) => {
    const { nameUz, nameRu, nameEn, imageUrl } = req.body;

    if (!nameUz || !nameRu || !nameEn) {
        return next(new ErrorResponse("Please fill out all fields!", 400));
    }

    // Check if imageUrl is provided; if not, use file upload
    let flag;
    if (req.file) {
        flag = `http://localhost:4000/public/uploads/${req.file.filename}`;
    } else if (imageUrl) {
        flag = imageUrl; // Agar imageUrl mavjud bo'lsa
    } else {
        return next(new ErrorResponse("Flag is required", 400)); // Fayl yoki URL berilmagan
    }

    const newCountry = await Country.create({ nameUz, nameRu, nameEn, flag });
    res.status(201).json({
        message: "Country created successfully",
        success: true,
        data: newCountry
    });
});

// Delete countries
// DELETE
// Public
exports.deleteCountry = asyncHandler(async (req, res, next) => {
    const { country_id } = req.body;
    await Country.findByIdAndDelete(country_id);
    res.status(200).json({
        message: "Country deleted successfully",
        success: true
    });
});

// Update countries
// PUT
// Public
exports.updateCountry = asyncHandler(async (req, res, next) => {
    const { country_id } = req.body;
    const { nameUz, nameRu, nameEn, imageUrl } = req.body;

    // Check if imageUrl is provided; if not, use file upload
    const flag = imageUrl ? imageUrl : `http://localhost:4000/public/uploads/${req.file.filename}`;

    const updatedCountry = await Country.findByIdAndUpdate(country_id, { nameUz, nameRu, nameEn, flag }, { new: true, runValidators: true });

    res.status(200).json({
        message: "Country updated successfully",
        success: true,
        data: updatedCountry
    });
});
