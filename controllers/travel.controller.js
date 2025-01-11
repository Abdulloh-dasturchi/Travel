const Travel  = require("../models/travel.model");
const User = require("../models/user.model");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const countryModel = require("../models/country.model");
// @desc    Create Travel
// @router  POST /api/v1/travel/create
// @access  Private
exports.postTravel = asyncHandler(async (req, res, next) => {
    const { country_id, nameUz, nameRu, nameEn, locationUz, locationRu, locationEn, day, price, rating, year, statusUz, statusRu, statusEn, map, descriptionUz, descriptionRu, descriptionEn, from, to } = req.body;
    if (!nameUz || !nameRu || !nameEn || !locationUz || !locationRu || !locationEn || !day || !price || !year || !map || !from || !to || !country_id || !statusUz || !statusRu || !statusEn || !descriptionUz || !descriptionRu || !descriptionEn) {
        return next(new ErrorResponse("Barcha ma'lumotlarni to'liq to'ldiring !!!", 400));
    }

    const statusUzArray = statusUz.split(',').map(item => item.trim());
    const statusRuArray = statusRu.split(',').map(item => item.trim());
    const statusEnArray = statusEn.split(',').map(item => item.trim());
    const parsedFrom = new Date(from);
    const parsedTo = new Date(to);

    if (isNaN(parsedFrom) || isNaN(parsedTo)) {
        return next(new ErrorResponse("Sana noto'g'ri formatda kiritilgan!", 400));
    }
    if (parsedFrom > parsedTo) {
        return next(new ErrorResponse("Boshlanish sanasi tugash sanasidan kichik bo'lishi kerak!", 400));
    }
    if (!req.file) {
        return next(new ErrorResponse("Rasm yuklanmadi!", 400));
    }

    const image = `http://localhost:4000/public/uploads/${req.file.filename}`;

    const countrys = await countryModel.findById(country_id);
    if (!countrys) {
        return next(new ErrorResponse("Bunday davlatga sayohat qo'shib bo'lmaydi!", 400));
    }

    const travel = await Travel.create({
        country: countrys,
        from: parsedFrom,
        to: parsedTo,
        nameUz,
        nameRu,
        nameEn,
        locationUz,
        locationRu,
        locationEn,
        day,
        price,
        rating,
        year,
        statusUz: statusUzArray,
        statusRu: statusRuArray,
        statusEn: statusEnArray,
        map,
        descriptionUz,
        descriptionRu,
        descriptionEn,
        image
    });

    const currentTime = new Date();
    const timeDifference = parsedTo - currentTime;

    if (timeDifference > 0) {
        setTimeout(async () => {
            await Travel.findByIdAndDelete(travel._id);
            console.log(`Travel entry with ID ${travel._id} deleted as its "to" date passed.`);
        }, timeDifference);
    }

    res.status(201).json({
        message: "Travel created successfully",
        success: true,
        data: travel
    });
});




// Get All Travel
// GET
// Public
exports.getAllTravels = asyncHandler(async (req, res, next) => {
    const travel = await Travel.find()

    res.status(201).json({
        message:"All travel finded",
        success:true,
        data:travel
    })
});

// Delete Travel
// DELETE
// Private
exports.deleteTravel = asyncHandler(async (req, res, next) => {
    const travel_Id = req.body.travel_id
    const tid = await Travel.findById(travel_Id)
    if(!travel_Id){
        return next(ErrorResponse("Travel id not defined"))
    }
    if(!tid){
        return next(ErrorResponse("Travel id not defined"))
    }
    await Travel.findByIdAndDelete(travel_Id)
    res.status(201).json({
        message:"Travel deleted",
        success:true,
    })
});

// Get One Travel
// GET
// Public
exports.getTravel = asyncHandler(async (req, res, next) => {
    const travel_Id = req.body.travel_id
    const travel = await Travel.findOne(travel_Id)

    res.status(201).json({
        message:"Travel finded",
        success:true,
        data:travel
    })
});

// Update Travel
// PUT 
// Private
exports.putTravel = asyncHandler(async (req, res, next) => {
    const travel_Id = req.body.travel_id
    const { 
        country,
        nameUz, nameRu, nameEn, 
        locationUz, locationRu, locationEn, 
        day, price, rating, year, 
        statusUz, statusRu, statusEn, 
        map, descriptionUz, descriptionRu, descriptionEn, 
        from, to 
    } = req.body;

    // Required fields validation
    if (!nameUz || !nameRu || !nameEn || !locationUz || !locationRu || !locationEn || !day || !price || !year || !map || !from || !to || !country) {
        return next(new ErrorResponse("Barcha ma'lumotlarni to'liq to'ldiring !!!", 400));
    }

    // Convert status strings into arrays
    const statusUzArray = statusUz.split(',').map(item => item.trim());
    const statusRuArray = statusRu.split(',').map(item => item.trim());
    const statusEnArray = statusEn.split(',').map(item => item.trim());

    // Parse and validate dates
    const parsedFrom = new Date(from);
    const parsedTo = new Date(to);
    if (isNaN(parsedFrom) || isNaN(parsedTo)) {
        return next(new ErrorResponse("Sana noto'g'ri formatda kiritilgan!", 400));
    }
    if (parsedFrom < parsedTo) {
        return next(new ErrorResponse("Boshlanish sanasi tugash sanasidan kichik bo'lishi kerak!", 400));
    }

    // Image URL
    const image = `http://localhost:4000/public/uploads/${req.file.filename}`;

    if(!travel_Id){
        return next(ErrorResponse("Travel id not defined",404))
    }
    if(!image){
        return next(ErrorResponse("Image not defined",404))
    }
     // country document
    const countrys = await countryModel.findById(country);
    if (!countrys) {
        return next(new ErrorResponse("Bunday davlatga sayohat qo'shib bo'lmaydi!", 400));
    }
    const travel = await Travel.findByIdAndUpdate(travel_Id,{country,
        from: parsedFrom,
        to: parsedTo,
        nameUz,
        nameRu,
        nameEn,
        locationUz,
        locationRu,
        locationEn,
        day,
        price,
        rating,
        year,
        statusUz: statusUzArray,
        statusRu: statusRuArray,
        statusEn: statusEnArray,
        map,
        descriptionUz,
        descriptionRu,
        descriptionEn,
        image
    },{new:true},{runValidators:true})

    res.status(201).json({
        message:"Travel updated successfully",
        success:true,
        data:travel
    })
});

// Get all travel comments
// GET
// Public
exports.getAllCommentsTravel = asyncHandler(async (req, res, next) => {
    const travel_Id = req.body.travel_id
    const comments = await Travel.findById(travel_Id).populate("comments")
    res.status(201).json({
        message:"All comments finded",
        success:true,
        data:comments
    })
});

// Add comment to travel
// POST
// Private
exports.addComments= asyncHandler(async (req, res, next) => {
    const { travel_id } = req.body;
    const { comment,rating } = req.body;
    const travel = await Travel.findById(travel_id);
    if (!travel) {
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
    travel.comments.push(newComment);
    await travel.save();
    res.status(201).json({
        message: "Comment added successfully",
        success: true,
        data: travel,
    });
});

// Get all comments
// GET
// Public
exports.getAllComments = asyncHandler(async (req, res, next) => {
    const travels = await Travel.find().populate("comments");

    // Extract all comments from travels
    const allComments = travels.reduce((acc, travel) => {
        return acc.concat(travel.comments);
    }, []);

    res.status(200).json({
        message: "All comments retrieved successfully",
        success: true,
        data: allComments
    });
});

// Delete comment from travel
// DELETE
// Private
exports.deleteComment = asyncHandler(async (req, res, next) => {
    const { travel_id, comment_id } = req.body;
    const travel = await Travel.findById(travel_id);
    if (!travel) {
        return next(new ErrorResponse("Travel not found", 404));
    }
    const commentIndex = travel.comments.findIndex(comment => comment._id.toString() === comment_id);
    if (commentIndex === -1) {
        return next(new ErrorResponse("Comment not found", 404));
    }
    travel.comments.splice(commentIndex, 1);
    await travel.save();
    res.status(200).json({
        message: "Comment deleted successfully",
        success: true,
        data: travel,
    });
});

