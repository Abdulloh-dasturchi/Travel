const mongoose = require("mongoose");

const travelSchema = new mongoose.Schema({
    country:{
        type:Array,
        required:true
    },
    locationUz:{
        type:String,
        required:true,
    },
    locationRu:{
        type:String,
        required:true,
    },
    locationEn:{
        type:String,
        required:true,
    },
    nameUz:{
        type:String,
        required:true,
    },
    nameRu:{
        type:String,
        required:true,
    },
    nameEn:{
        type:String,
        required:true,
    },
    day:{
        type:Number,
        required:true,
    },
    descriptionUz:{
        type:String,
        required:true,
    },
    descriptionRu:{
        type:String,
        required:true,
    },
    descriptionEn:{
        type:String,
        required:true,
    },
    price:{
        type:String,
        required:true
    },
    rating:{
        type:Number,
        default:10,
    },
    year:{
        type:String,
        required:true
    },
    rank:{
        type:String,
        default:"All inclusive",
    },
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
    comments:[
        {
            user:String,
            comment: String,
            rating: Number,
        }
    ],
    map:{
        type:String,
        required:true,
    },
    image:{
        type:String,
        required:true
    },
    from:{
        type:mongoose.Schema.Types.Date,
        required:true
    },
    to:{
        type:mongoose.Schema.Types.Date,
        required:true
    },
    howMany:{
        type:Number,
        default:0
    }
},{
    timestamps: true,
});



module.exports = mongoose.model("Travel",travelSchema)