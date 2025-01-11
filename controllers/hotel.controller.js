const Hotel = require("../models/hotel.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Country = require("../models/country.model");
// @desc    Get all hotels
// @router  GET /api/v1/hotel/get/all
// @access  Public
exports.getAllHotels = asyncHandler(async (req, res, next) => {
    const hotels = await Hotel.find();
    res.status(200).json({
        success: true,
        count: hotels.length,
        data: hotels
    });
});

// @desc    Create a new hotel
// @router  POST /api/v1/hotel/create
// @access  Public
exports.createHotel = asyncHandler(async (req, res, next) => {
    const {
        nameUz,
        nameRu,
        nameEn,
        locationUz,
        locationRu,
        locationEn,
        descriptionUz,
        descriptionRu,
        descriptionEn,
        statusUz,
        statusRu,
        statusEn,
        rating,
        price,
        year,
        country_id,
        map,
        from,
        to
    } = req.body;

    if (
        !nameUz ||
        !nameRu ||
        !nameEn ||
        !locationUz ||
        !locationRu ||
        !locationEn ||
        !descriptionUz ||
        !descriptionRu ||
        !descriptionEn ||
        !rating ||
        !price ||
        !year ||
        !country_id ||
        !map ||
        !statusUz ||
        !statusRu ||
        !statusEn ||
        !from ||
        !to 
    ) {
        return next(new ErrorResponse("Barcha maydonlarni to'ldiring!", 400));
    }

    // Extract image file paths
    const image1 = req.files.image1?.[0]?.filename
        ? `http://localhost:4000/public/uploads/${req.files.image1[0].filename}`
        : null;
    const image2 = req.files.image2?.[0]?.filename
        ? `http://localhost:4000/public/uploads/${req.files.image2[0].filename}`
        : null;
    const image3 = req.files.image3?.[0]?.filename
        ? `http://localhost:4000/public/uploads/${req.files.image3[0].filename}`
        : null;
    const image4 = req.files.image4?.[0]?.filename
        ? `http://localhost:4000/public/uploads/${req.files.image4[0].filename}`
        : null;
     // Convert status strings into arrays
     const statusUzArray = statusUz.split(',').map(item => item.trim());
     const statusRuArray = statusRu.split(',').map(item => item.trim());
     const statusEnArray = statusEn.split(',').map(item => item.trim());
     const parsedFrom = new Date(from);
    const parsedTo = new Date(to);
    if (isNaN(parsedFrom) || isNaN(parsedTo)) {
        return next(new ErrorResponse("Sana noto'g'ri formatda kiritilgan!", 400));
    }
    if (parsedFrom >parsedTo) {
        return next(new ErrorResponse("Boshlanish sanasi tugash sanasidan kichik bo'lishi kerak!", 400));
    }
    // country document
    const countrys = await Country.findById(country_id);
    if (!countrys) {
        return next(new ErrorResponse("Bunday davlatga sayohat qo'shib bo'lmaydi!", 400));
    }
    const countryNameEn = countrys.nameEn;
    const countryNameRu = countrys.nameRu;
    const countryNameUz = countrys.nameUz;
    const countryFlag = countrys.flag;
    // Create a new hotel document
    const hotel = await Hotel.create({
        from: parsedFrom,
        to: parsedTo,
        nameUz,
        nameRu,
        nameEn,
        image1,
        image2,
        image3,
        image4,
        locationUz,
        locationRu,
        locationEn,
        descriptionUz,
        descriptionRu,
        descriptionEn,
        statusUz: statusUzArray,
        statusRu: statusRuArray,
        statusEn: statusEnArray,
        rating,
        price,
        year,
        country_id: countrys,
        countryNameEn,
        countryNameRu,
        countryNameUz,
        countryFlag,
        map,
        day: Math.ceil((parsedTo - parsedFrom) / (1000 * 60 * 60 * 24))
    });

    res.status(201).json({
        success: true,
        message: "Hotel muvaffaqiyatli yaratildi",
        data: hotel,
    });
});

// @desc    Get a single hotel by hotel_id
// @router  POST /api/v1/hotel/get
// @access  Public
exports.getHotelById = asyncHandler(async (req, res, next) => {
    const { hotel_id } = req.body;

    const hotel = await Hotel.findById(hotel_id);

    if (!hotel) {
        return next(new ErrorResponse("Hotel topilmadi", 404));
    }

    res.status(200).json({
        success: true,
        data: hotel,
    });
}); 

// @desc    Update a hotel by hotel_id
// @router  PUT /api/v1/hotel/update
// @access  Public
exports.updateHotel = asyncHandler(async (req, res, next) => {
    const { hotel_id } = req.body;
    const country = req.body.country;
     // country document
     const countrys = await Country.findById(country);
     if (!countrys) {
         return next(new ErrorResponse("Bunday davlatga sayohat qo'shib bo'lmaydi!", 400));
     }
    const updatedData = req.body; // Bodyda kelgan barcha malumotlar yangilash uchun ishlatiladi
    const image1= `http://localhost:4000/public/uploads/${req.files.image1.filename}`
    if (image1) {
        updatedData.image = image1;
    }
    const hotel = await Hotel.findByIdAndUpdate(hotel_id, {
        from: parsedFrom,
        to: parsedTo,
        nameUz,
        nameRu,
        nameEn,
        image1,
        image2,
        image3,
        image4,
        locationUz,
        locationRu,
        locationEn,
        descriptionUz,
        descriptionRu,
        descriptionEn,
        statusUz: statusUzArray,
        statusRu: statusRuArray,
        statusEn: statusEnArray,
        rating,
        price,
        year,
        country: countrys,
        map,
        day: Math.ceil((parsedTo - parsedFrom) / (1000 * 60 * 60 * 24))
    }, {
        new: true,
        runValidators: true,
    });

    if (!hotel) {
        return next(new ErrorResponse("Hotel topilmadi", 404));
    }

    res.status(200).json({
        success: true,
        message: "Hotel muvaffaqiyatli yangilandi",
        data: hotel,
    });
});

// @desc    Delete hotel by ID
// @router  DELETE /api/v1/hotel/delete
// @access  Private
exports.deleteHotel = asyncHandler(async (req, res, next) => {
    const { id } = req.params;

    // Mehmonxonani topib o'chirish
    const deletedHotel = await Hotel.findByIdAndDelete(id);

    if (!deletedHotel) {
        return next(new ErrorResponse("Hotel not found", 404));
    }

    res.status(200).json({
        success: true,
        message: "Hotel deleted successfully",
        data: deletedHotel,
    });
});

// Get all hotel comments
// GET
// Public
exports.getAllCommentsHotel = asyncHandler(async (req, res, next) => {
    const hotel_Id = req.body.hotel_id
    const comments = await Travel.findById(hotel_Id).populate("comments")
    res.status(201).json({
        message:"All comments finded",
        success:true,
        data:comments
    })
});

// Add comment to hotel
// POST
// Private
exports.addComments= asyncHandler(async (req, res, next) => {
    const { hotel_id } = req.body;
    const { comment,rating } = req.body;
    const hotel = await Travel.findById(hotel_id);
    if (!hotel) {
        return next(new ErrorResponse("Travel not found", 404));
    }
    const user = await User.findById(req.user._id);
    if (!user) {
        return next(new ErrorResponse("User not found", 404));
    }
    if(rating<1 || rating>5){
        return next(new ErrorResponse("Rating must be between 1 and 5", 400));
    }
    const newComment = {
        comment,
        rating,
        user: user.username,
    };
    hotel.comments.push(newComment);
    await travel.save();
    res.status(201).json({
        message: "Comment added successfully",
        success: true,
        data: hotel,
    });
});

// Get all comments
// GET
// Public
exports.getAllComments = asyncHandler(async (req, res, next) => {
    const hotels = await Hotel.find().populate("comments");

    // Extract all comments from travels
    const allComments = hotels.reduce((acc, hotels) => {
        return acc.concat(hotels.comments);
    }, []);

    res.status(200).json({
        message: "All comments retrieved successfully",
        success: true,
        data: allComments
    });
});

// Delete comment from Hotel
// DELETE
// Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const { hotel_id, comment_id } = req.body;
    const hotel = await Hotel.findById(hotel_id);
    if (!travel) {
        return next(new ErrorResponse("Travel not found", 404));
    }
    const commentIndex = travel.comments.findIndex(comment => comment._id.toString() === comment_id);
    if (commentIndex === -1) {
        return next(new ErrorResponse("Comment not found", 404));
    }
    hotel.comments.splice(commentIndex, 1);
    await travel.save();
    res.status(200).json({
        message: "Comment deleted successfully",
        success: true,
        data: hotel,
    });
});
