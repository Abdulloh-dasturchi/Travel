const mongoose = require("mongoose");

const hotelSchema = new mongoose.Schema({
    from: {
        type:mongoose.Schema.Types.Date,
        required:true
    },
    to: {
        type:mongoose.Schema.Types.Date,
        required:true
    },
    nameUz: {
        type: String,
        required: true,
    },
    nameRu: {
        type: String,
        required: true,
    },
    nameEn: {
        type: String,
        required: true,
    },
    image1: {
        type: String,
        required: true,
    },
    image2: {
        type: String,
        required: true,
    },
    image3: {
        type: String,
        required: true,
    },
    image4: {
        type: String,
        required: true,
    },
    locationUz: {
        type: String,
        required: true,
    },
    locationRu: {
        type: String,
        required: true,
    },
    locationEn: {
        type: String,
        required: true,
    },
    descriptionUz: {
        type: String,
        required: true,
    },
    descriptionRu: {
        type: String,
        required: true,
    },
    descriptionEn: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    year: {
        type: Number,
        required: true,
    },
    comments:[
        {
            user:String,
            comment: String,
            rating: Number,
        }
    ],
    statusUz: { 
        type: [String], 
        required: true 
    },
    statusRu: { 
        type: [String], 
        required: true 
    }, 
    statusEn: { 
        type: [String], 
        required: true 
    },
    country_id: [
        {
            type:Array,
            required: true,
            countryNameUz:{
                type:String,
                required:true
            },
            countryNameRu:{
                type:String,
                required:true
            },
            countryNameEn:{
                type:String,
                required:true
            },
            flag: {
                type: String,
                required: true,
            },
        },
        
    ],
    map: {
        type: String,
        required: true,
    },
    day: {
        type: Number,
        required: true,
    },
    howMany: {
        type: Number,
        default: 0
    },
},{
    timestamps: true
});

module.exports = mongoose.model("Hotel", hotelSchema);